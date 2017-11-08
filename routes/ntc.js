const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');

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
                    const token = jwt.sign({data:results[0]},"BookMySeatSecret",{
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

module.exports = router;