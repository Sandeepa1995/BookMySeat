const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');
const config = require('./../../config.json');


router.post('/register',(req,res,next)=>{
    sqlcon.connection.query("SELECT * FROM passenger WHERE email=?",[req.body.email], function (error, results, fields) {
        if (error) {
            res.json({success: false, msg: "Failed to register passenger: Connection error."});
        }else {
            if (results.length > 0) {
                console.log("Passenger already in registered in the system");
                res.json({success:false, msg:"Passenger already in registered in the system"});
            }
            else {
                sqlcon.connection.query("INSERT INTO passenger VALUES (?,?,?,AES_ENCRYPT(?,?),?)",[
                    req.body.id,
                    req.body.email,
                    req.body.name,
                    req.body.password,
                    config.secret,
                    req.body.contact
                ], function (error, results, fields) {
                    if (error)
                    {
                        res.json({success: false, msg: "Failed to register passenger:Query Error"});
                    }
                    else {
                        console.log(req.body.name + " Registered as Passenger");
                        res.json({success: true, msg: "Passenger successfully registered"});
                    }
                });
            }
        }
    });
});

//Authenticate
router.post('/authenticate',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    sqlcon.connection.query("SELECT * FROM passenger WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Passenger not found");
            return res.json({success:false,msg:"Passenger not registered in the system"})
        }
        else{
            // console.log(results[0]);
            sqlcon.connection.query("SELECT compare_psnpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Query Error"});
                }
                else {
                    if (result[0].res===1){
                        const token = jwt.sign({data:results[0],type:"Passenger"},"BookMySeatSecret",{
                            expiresIn: 604800 //1 week
                        });

                        return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,name:results[0].name,type:"Passenger",contact:results[0].contact_no}})
                        // return res.json({success:true,token:'JWT '+token,user:results[0]})
                    }
                    else{
                        return res.json({success:false,msg:"Incorrect Password"});
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
    sqlcon.connection.query("SELECT * FROM passenger WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Passenger not found");
            return res.json({success:false,msg:"Passenger not registered in the system"})
        }
        else{
            // console.log(results[0]);
            sqlcon.connection.query("SELECT compare_ownerpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    return res.json({success:false,msg:"Error"});
                }
                else {
                    if (result[0].res===1){
                        sqlcon.connection.query("UPDATE passenger SET password=AES_ENCRYPT(?,?) WHERE email=?",[
                            newPass,
                            config.secret,
                            email
                        ], function (error, results, fields) {
                            if (error)
                            {
                                res.json({success: false, msg: "Failed to update Passenger:Query Error"});
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

//Change Details
router.post('/changedetails',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    const email = req.body.email;
    const contact = req.body.contact;
    const name = req.body.name;
    sqlcon.connection.query("SELECT * FROM passenger WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Passenger not found");
            return res.json({success:false,msg:"Passenger not registered in the system"})
        }
        else{
            sqlcon.connection.query("UPDATE passenger SET name=?,contact_no=? WHERE email=?",[
                name,
                contact,
                email
            ], (error, resultz, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Failed to update passenger:Query Error"});
                }
                else {
                    console.log(req.body.name + " Changed Details");
                    // console.log(results);
                    // res.json({success: true, msg: "Details successfully changed"});
                    res.json({success:true, msg: "Details successfully changed",user:{email:results[0].email,name:results[0].name,type:"Passenger",contact:results[0].contact_no}})

                }
            });
        }
    });
});

module.exports = router;