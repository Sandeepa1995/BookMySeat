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
        user: 'bookmyseat.15@gmail.com',
        pass: ''
    },
    tls:{
        rejectUnauthorized:false
    }
});


//Authenticate
router.post('/authenticate',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    sqlcon.connection.query("SELECT * FROM owner WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Owner not found");
            return res.json({success:false,msg:"Bus Owner not registered in the system"})
        }
        else{
            // console.log(results[0]);
            bcrypt.compare(password, results[0].password,(err,isMatch)=>{
                if(err){
                    return res.json({success:false,msg:"Error"})
                }
                if (isMatch){
                    const token = jwt.sign({data:results[0],type:"Owner"},"BookMySeatSecret",{
                        expiresIn: 604800 //1 week
                    });

                    return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,name:results[0].name,type:"Bus Owner",contact:results[0].contact_no}})
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
    sqlcon.connection.query("SELECT * FROM owner WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Bus Owner not found");
            return res.json({success:false,msg:"Bus Owner not registered in the system"})
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
                            sqlcon.connection.query("UPDATE owner SET password=? WHERE email=?",[
                                hash,
                                email
                            ], function (error, results, fields) {
                                if (error)
                                {
                                    res.json({success: false, msg: "Failed to update Bus Owner:Query Error"});
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

//Change Details
router.post('/changedetails',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    const email = req.body.email;
    const contact = req.body.contact;
    const name = req.body.name;
    sqlcon.connection.query("SELECT * FROM owner WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Bus Owner not found");
            return res.json({success:false,msg:"Bus Owner not registered in the system"})
        }
        else{
            sqlcon.connection.query("UPDATE owner SET name=?,contact_no=? WHERE email=?",[
                name,
                contact,
                email
            ], (error, resultz, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Failed to update Bus Owner:Query Error"});
                }
                else {
                    console.log(req.body.name + " Changed Details");
                    // console.log(results);
                    // res.json({success: true, msg: "Details successfully changed"});
                    res.json({success:true, msg: "Details successfully changed",user:{email:results[0].email,name:results[0].name,type:"Bus Owner",contact:results[0].contact_no}})

                }
            });
        }
    });
});

//Register new Operator
router.post('/registeroperator',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    // console.log(password);
    bcrypt.genSalt(10,(err,salt) =>{
        bcrypt.hash(password,salt,(err,hash) =>{
            sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[req.body.email], function (error, result, fields) {
                if (error) {
                    res.json({success: false, msg: "Failed to register Bus Operator: Connection error."});
                }else {
                    if (result.length > 0) {
                        console.log("Bus Operator already in registered in the system");
                        res.json({success:false, msg:"Bus Operator already in registered in the system"});
                    }
                    else {
                        sqlcon.connection.query("INSERT INTO operator (email,name,password,contact_no) VALUES (?,?,?,?)",[
                            req.body.email,
                            null,
                            hash,
                            null
                        ], function (error, resu, fields) {
                            if (error)
                            {
                                res.json({success: false, msg: "Failed to register Bus Operator:Query Error"});
                            }
                            else {
                                var mailOptions={
                                    from: 'BookMySeat <bookmyseat.15@gmail.com>',
                                    to: req.body.email,
                                    subject:'Login Password - BookMySeat',
                                    text: 'Your password for the Bus Operator account is ' + password
                                };
                                transproter.sendMail(mailOptions,function (mailerror,mailres) {
                                    if(mailerror){
                                        res.json({success: true, msg: "Bus Operator successfully registered into database but error in sending email"});
                                    }
                                    else{
                                        console.log(req.body.name + " Registered as Operator");
                                        res.json({success: true, msg: "Bus Operator successfully registered"});
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    });
});

router.post('/newtrip',passport.authenticate('jwt',{session:false}),(req,res,next) => {
    var license = req.body.license;
    var route = req.body.route;
    var start = req.body.start;
    var end = req.body.end;
    var type = req.body.type;
    var time = req.body.time;
    var seats = req.body.seats;

    var checkQuery = "SELECT * FROM trips WHERE route = ? AND start = ? AND end = ? AND type = ? AND time = ? AND seats = ?;";

    var insertQuery = "INSERT INTO trips(license,route,start,end,time,type,seats) VALUES(?,?,?,?,?,?,?);";

    sqlcon.connection.query(checkQuery,[
        route.toString(),
        start.toString(),
        end.toString(),
        type.toString(),
        time.toString(),
        seats.toString()
    ], (error,results,fields) => {
        if(error){
            console.log('Error: '+error);
            res.json({success:false, output: "Failed"});
        }
        else{
            if(results.length > 0){
                console.log('Trip already exists');
                res.json({success: false, output: "Exists"});
            }
            else{
                sqlcon.connection.query(insertQuery,[
                    license.toString(),
                    route.toString(),
                    start.toString(),
                    end.toString(),
                    time.toString(),
                    type.toString(),
                    seats.toString()
                ],(error,results,fields) => {
                    if(error) throw error;
                    console.log('Successful');
                    res.json({success:true, output: "Successful"});
                })
            }
        }
    });
});

module.exports = router;