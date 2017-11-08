const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');

const generator = require('generate-password');
const nodemailer = require('nodemailer');

let transproter = nodemailer.createTransport({
    service: 'gmail',
    secure:false,
    port:25,
    auth:{
        user: 'damitha.15@cse.mrt.ac.lk',
        pass: 'Need password'
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
            // console.log(results[0]);
            bcrypt.compare(password, results[0].password,(err,isMatch)=>{
                if(err){
                    return res.json({success:false,msg:"Error"})
                }
                if (isMatch){
                    const token = jwt.sign({data:results[0],type:"NTC"},"BookMySeatSecret",{
                        expiresIn: 604800 //1 week
                    });

                    return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,type:"NTC",name:"National Transport Commission",contact:results[0].contact_no}})
                    // return res.json({success:true,token:'JWT '+token,user:results[0]})
                }
                else{
                    return res.json({success:false,msg:"Incorrect Password"})
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
            // console.log(results[0]);
            bcrypt.compare(password, results[0].password,(err,isMatch)=>{
                if(err){
                    return res.json({success:false,msg:"Error"})
                }
                if (isMatch){
                    bcrypt.genSalt(10,function (err,salt) {
                        bcrypt.hash(newPass,salt,(err,hash) =>{
                            sqlcon.connection.query("UPDATE ntc SET password=? WHERE email=?",[
                                hash,
                                email
                            ], function (error, results, fields) {
                                if (error)
                                {
                                    res.json({success: false, msg: "Failed to update NTC:Query Error"});
                                }
                                else {
                                    // console.log(results[0].name + " Changed Password");
                                    res.json({success: true, msg: "Password successfully changed"});
                                }
                            });
                        });
                    });
                }
                else{
                    return res.json({success:false,msg:"Incorrect Old Password"})
                }
            });
        }
    });
});

//Register new Owner
router.post('/registerowner',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    // console.log(password);
    bcrypt.genSalt(10,(err,salt) =>{
        bcrypt.hash(password,salt,(err,hash) =>{
            sqlcon.connection.query("SELECT * FROM owner WHERE email=?",[req.body.email], function (error, result, fields) {
                if (error) {
                    res.json({success: false, msg: "Failed to register Bus Owner: Connection error."});
                }else {
                    if (result.length > 0) {
                        console.log("Bus Owner already in registered in the system");
                        res.json({success:false, msg:"Bus Owner already in registered in the system"});
                    }
                    else {
                        sqlcon.connection.query("INSERT INTO owner (email,name,password,contact_no) VALUES (?,?,?,?)",[
                            req.body.email,
                            req.body.name,
                            hash,
                            null
                        ], function (error, resu, fields) {
                            if (error)
                            {
                                res.json({success: false, msg: "Failed to register BUs Owner:Query Error"});
                            }
                            else {
                                var mailOptions={
                                    from: 'Damitha <damitha.15@cse.mrt.ac.lk>',
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
                                // console.log(req.body.name + " Registered as Owner");
                                // res.json({success: true, msg: "Bus Owner successfully registered"});
                            }
                        });
                    }
                }
            });
        });
    });
});

module.exports = router;