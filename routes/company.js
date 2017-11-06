const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');

router.post('/register',(req,res,next)=>{
    bcrypt.genSalt(10,function (err,salt) {
        bcrypt.hash(req.body.password,salt,(err,hash) =>{
            sqlcon.connection.query("SELECT * FROM user WHERE email='"+req.body.email.toString()+"'", function (error, results, fields) {
                if (error) {
                    res.json({success: false, msg: "Failed to register user"});
                }else {
                    if (results.length > 0) {
                        console.log("User already in DB");
                        res.json({success:false, msg:"User already in DB"});
                    }
                    else {
                        sqlcon.connection.query("INSERT INTO user VALUES ('" + req.body.name.toString() + "','" + req.body.email.toString() + "','" + hash.toString() + "','" + req.body.username.toString() + "')", function (error, results, fields) {
                            if (error) throw error;
                            console.log(req.body.name+" Registered");
                            res.json({success:true, msg:"User registered"});
                        });
                    }
                }
            });
        });
    });
});

//Authenticate
router.post('/authenticate',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    sqlcon.connection.query("SELECT * FROM user WHERE email='"+email.toString()+"'", function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("User not found");
            return res.json({success:false,msg:"User not found"})
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

                    return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,name:results[0].name}})
                }
                else{
                    return res.json({success:false,msg:"Incorrect Password"})
                }
            });
        }
    });
});

//Profile
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({user:req.user});
});

module.exports = router;