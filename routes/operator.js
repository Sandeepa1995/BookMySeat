const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');
const config = require('./../../config.json');


//Authenticate
router.post('/authenticate',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Operator not found");
            return res.json({success:false,msg:"Bus Operator not registered in the system"})
        }
        else{
            // console.log(results[0]);
            sqlcon.connection.query("SELECT compare_operpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Query Error"});
                }
                else {
                    if (result[0].res===1){
                        const token = jwt.sign({data:results[0],type:"Operator"},"BookMySeatSecret",{
                            expiresIn: 604800 //1 week
                        });

                        return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,name:results[0].name,type:"Bus Operator",contact:results[0].contact_no}})
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
    sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Bus Operator not found");
            return res.json({success:false,msg:"Bus Operator not registered in the system"})
        }
        else{
            sqlcon.connection.query("SELECT compare_operpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    return res.json({success:false,msg:"Error"});
                }
                else {
                    if (result[0].res===1){
                        sqlcon.connection.query("UPDATE operator SET password=AES_ENCRYPT(?,?) WHERE email=?",[
                            newPass,
                            config.secret,
                            email
                        ], function (error, results, fields) {
                            if (error)
                            {
                                res.json({success: false, msg: "Failed to update Bus Operator:Query Error"});
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
    sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Bus Operator not found");
            return res.json({success:false,msg:"Bus Operator not registered in the system"})
        }
        else{
            sqlcon.connection.query("UPDATE operator SET name=?,contact_no=? WHERE email=?",[
                name,
                contact,
                email
            ], (error, resultz, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Failed to update Bus Operator:Query Error"});
                }
                else {
                    console.log(req.body.name + " Changed Details");
                    // console.log(results);
                    // res.json({success: true, msg: "Details successfully changed"});
                    res.json({success:true, msg: "Details successfully changed",user:{email:results[0].email,name:results[0].name,type:"Bus Operator",contact:results[0].contact_no}})

                }
            });
        }
    });
});

module.exports = router;