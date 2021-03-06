const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');
const config = require('./../../config.json');

const generator = require('generate-password');
const nodemailer = require('nodemailer');

let transproter = nodemailer.createTransport({
    service: 'gmail',
    secure:false,
    port:25,
    auth:{
        user: config.user,
        pass: config.pass
    },
    tls:{
        rejectUnauthorized:false
    }
});


//Authenticate
router.post('/authenticate',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    sqlcon.connection.query("SELECT * FROM ntc WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("NTC not found");
            return res.json({success:false,msg:"Email does not match that which is registered in the system"})
        }
        else{
            sqlcon.connection.query("SELECT compare_ntcpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Query Error"});
                }
                else {
                    if (result[0].res===1){
                        const token = jwt.sign({data:results[0],type:"NTC"},"BookMySeatSecret",{
                            expiresIn: 604800 //1 week
                        });

                        return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,type:"NTC",name:"National Transport Commission",contact:results[0].contact_no}})
                    }
                    else{
                        return res.json({success:false,msg:"Incorrect Password"})
                    }
                }
            });
        }
    });
});

//Change Password
router.post('/changepass',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const newPass = req.body.newpass;
    sqlcon.connection.query("SELECT * FROM ntc WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("NTC: Email entered does not match");
            return res.json({success:false,msg:"Email entered does not match"})
        }
        else{
            sqlcon.connection.query("SELECT compare_ntcpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    return res.json({success:false,msg:"Error"});
                }
                else {
                    if (result[0].res===1){
                        sqlcon.connection.query("UPDATE ntc SET password=AES_ENCRYPT(?,?) WHERE email=?",[
                            newPass,
                            config.secret,
                            email
                        ], function (error, results, fields) {
                            if (error)
                            {
                                res.json({success: false, msg: "Failed to update NTC:Query Error"});
                            }
                            else {
                                res.json({success: true, msg: "Password successfully changed"});
                            }
                        });
                    }
                    else{
                        return res.json({success:false,msg:"Incorrect Old Password"});
                    }
                }
            });
        }
    });
});

//Register new Owner
router.post('/registerowner',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    var password = generator.generate({
        length: 15,
        numbers: true
    });
    sqlcon.connection.query("SELECT * FROM owner WHERE email=?",[req.body.email], function (error, result, fields) {
        if (error) {
            res.json({success: false, msg: "Failed to register Bus Owner: Connection error."});
        }else {
            if (result.length > 0) {
                console.log("Bus Owner already in registered in the system");
                res.json({success:false, msg:"Bus Owner already in registered in the system"});
            }
            else {
                sqlcon.connection.query("INSERT INTO owner (email,name,password,contact_no) VALUES (?,?,AES_ENCRYPT(?,?),?)",[
                    req.body.email,
                    req.body.name,
                    password,
                    config.secret,
                    null
                ], function (error, resu, fields) {
                    if (error)
                    {
                        res.json({success: false, msg: "Failed to register BUs Owner:Query Error"});
                    }
                    else {
                        var mailOptions={
                            from: 'BookMySeat <bookmyseat.15@gmail.com>',
                            to: req.body.email,
                            subject:'Login Password - BookMySeat',
                            text: 'Your password for the Bus Owner account is ' + password
                        };
                        transproter.sendMail(mailOptions,function (mailerror,mailres) {
                            if(mailerror){
                                res.json({success: true, msg: "Bus Owner successfully registered into database but error in sending email"});
                            }
                            else{
                                console.log(req.body.name + " Registered as Owner");
                                res.json({success: true, msg: "Bus Owner successfully registered"});
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;