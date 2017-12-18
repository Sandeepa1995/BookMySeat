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
    sqlcon.connection.query("SELECT * FROM owner WHERE email=?",[
        email
    ], function (error, results, fields) {
        if (error) throw error;
        if (results.length===0){
            console.log("Owner not found");
            return res.json({success:false,msg:"Bus Owner not registered in the system"})
        }
        else{
            sqlcon.connection.query("SELECT compare_ownerpassword(?,?) AS res;",[
                email,
                password
            ], (error, result, fields)=> {
                if (error)
                {
                    res.json({success: false, msg: "Query Error"});
                }
                else {
                    if (result[0].res===1){
                        const token = jwt.sign({data:results[0],type:"Owner"},"BookMySeatSecret",{
                            expiresIn: 604800 //1 week
                        });
                        return res.json({success:true,token:'JWT '+token,user:{email:results[0].email,name:results[0].name,type:"Bus Owner",contact:results[0].contact_no, id:results[0].owner_id}})
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
                        sqlcon.connection.query("UPDATE owner SET password=AES_ENCRYPT(?,?) WHERE email=?",[
                            newPass,
                            config.secret,
                            email
                        ], function (error, results, fields) {
                            if (error)
                            {
                                res.json({success: false, msg: "Failed to update Bus Owner:Query Error"});
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
        length: 15,
        numbers: true
    });
    sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[req.body.email], function (error, result, fields) {
        if (error) {
            res.json({success: false, msg: "Failed to register Bus Operator: Connection error."});
        }else {
            if (result.length > 0) {
                console.log("Bus Operator already registered in the system");
                res.json({success:false, msg:"Bus Operator already registered in the system"});
            }
            else {
                sqlcon.connection.query("INSERT INTO operator (email,name,password,contact_no) VALUES (?,?,AES_ENCRYPT(?,?),?)",[
                    req.body.email,
                    null,
                    password,
                    config.secret,
                    null
                ], function (error, resu, fields) {
                    if (error)
                    {
                        res.json({success: false, msg: "Failure :Query Error"});
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

//Manage Bus Load
router.post('/managebus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    sqlcon.connection.query("SELECT * FROM getOperators", function (error, results, fields) {
        if (error){
            throw error;
            return res.json({success: false})
        }
        if (results) {
            sqlcon.connection.query("SELECT licence_no,type,r_rows,l_rows,r_seats,l_seats,state,name,operator_id FROM bus NATURAL JOIN operator WHERE owner_id=?",[req.body.owner_id], function (er, resul, fields) {
                if (error){
                    throw error;
                    return res.json({success: false})
                }
                if (results) {
                    return res.json({success: true, operators: results, buses:resul})
                }
            });
        }
        // }
    });
});

router.post('/getbus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    sqlcon.connection.query("SELECT licence_no,type,r_rows,l_rows,r_seats,l_seats,state,name,operator_id FROM bus NATURAL JOIN operator WHERE licence_no=?", [req.body.licence],function (error, results, fields) {
        if (error){
            throw error;
            return res.json({success: false})
        }
        if (results) {
            return res.json({success: true, bus:results[0]})
        }
    });
});

//Add new bus
router.post('/addbus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    sqlcon.connection.query("SELECT * FROM bus WHERE licence_no=?",[req.body.licence], function (error, result, fields) {
        if (error) {
            console.log(error);
            res.json({success: false, msg: "Failed to add Bus to the System: Connection error."});
        }else {
            if (result.length > 0) {
                console.log("Bus already in the system");
                res.json({success:false, msg:"Bus already in the system"});
            }
            else {
                sqlcon.connection.query("INSERT INTO bus (licence_no,type,r_rows,r_seats,l_rows,l_seats,owner_id,operator_id,state) VALUES (?,?,?,?,?,?,?,?,?)",[
                    req.body.licence,
                    req.body.type,
                    req.body.r_rows,
                    req.body.r_seats,
                    req.body.l_rows,
                    req.body.l_seats,
                    req.body.owner,
                    req.body.operator,
                    'waiting'
                ], function (err, resu, fields) {
                    if (err)
                    {
                        console.log(err);
                        res.json({success: false, msg: "Failed to add Bus:Query Error"});
                    }
                    else {
                        res.json({success: true, msg: "Bus successfully added to the system"});
                    }
                });
            }
        }
    });
});

//Edit bus
router.post('/editbus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    console.log(req.body);
    sqlcon.connection.query("SELECT * FROM bus WHERE licence_no=?",[req.body.licence], function (error, result, fields) {
        if (error) {
            console.log(error);
            res.json({success: false, msg: "Failed to edit Bus: Connection error."});
        }else {
            if (result.length === 0) {
                console.log("Bus not found in the system");
                res.json({success:false, msg:"Bus not found in the system"});
            }
            else {
                sqlcon.connection.query("UPDATE bus SET licence_no=?,type=?,r_rows=?,r_seats=?,l_rows=?,l_seats=?,owner_id=?,operator_id=?,state=? WHERE licence_no=?",[
                    req.body.licence,
                    req.body.type,
                    req.body.r_rows,
                    req.body.r_seats,
                    req.body.l_rows,
                    req.body.l_seats,
                    req.body.owner,
                    req.body.operator,
                    req.body.state,
                    req.body.orig_licence,
                ], function (err, resu, fields) {
                    if (err)
                    {
                        console.log(err);
                        res.json({success: false, msg: "Failed to edit Bus:Query Error"});
                    }
                    else {
                        res.json({success: true, msg: "Bus successfully edited"});
                    }
                });
            }
        }
    });
});

router.post('/deletebus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    // console.log(req.body);
    sqlcon.connection.query("SELECT * FROM bus WHERE licence_no=?",[req.body.licence], function (error, result, fields) {
        if (error) {
            console.log(error);
            res.json({success: false, msg: "Failed to edit Bus: Connection error."});
        }else {
            if (result.length === 0) {
                console.log("Bus not found in the system");
                res.json({success:false, msg:"Bus not found in the system"});
            }
            else {
                sqlcon.connection.query("SELECT delete_bus(?) AS res;",[
                    req.body.licence
                ], function (err, resu, fields) {
                    if (err)
                    {
                        console.log(err);
                        res.json({success: false, msg: "Failed to delete Bus:Query Error"});
                    }
                    else {
                        if (resu[0].res === 1) {
                            res.json({success: true, msg: "Bus successfully deleted"});
                        }
                    }
                });
            }
        }
    });
});

router.post('/newopnbus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    var password = generator.generate({
        length: 15,
        numbers: true
    });
    sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[req.body.email], function (error, result, fields) {
        if (error) {
            res.json({success: false, msg: "Failed to register Bus Operator: Connection error."});
        }else {
            if (result.length > 0) {
                console.log("Bus Operator already registered in the system");
                res.json({success:false, msg:"Bus Operator already registered in the system"});
            }
            else {
                sqlcon.connection.query("SELECT add_bun_n_operator(?,?,?,?,?,?,?,?,?,?,?,?) AS res;",[
                    req.body.licence,
                    req.body.type,
                    req.body.r_rows,
                    req.body.r_seats,
                    req.body.l_rows,
                    req.body.l_seats,
                    null,
                    req.body.owner,
                    req.body.email,
                    'waiting',
                    password,
                    config.secret,
                ], function (error, resu, fields) {
                    if (error)
                    {
                        console.log(error);
                        res.json({success: false, msg: "Failed to register Bus Operator:Query Error"});
                    }
                    else {
                        if (resu[0].res === 1) {
                            var mailOptions = {
                                from: 'BookMySeat <bookmyseat.15@gmail.com>',
                                to: req.body.email,
                                subject: 'Login Password - BookMySeat',
                                text: 'Your password for the Bus Operator account is ' + password
                            };
                            transproter.sendMail(mailOptions, function (mailerror, mailres) {
                                if (mailerror) {
                                    res.json({
                                        success: true,
                                        msg: "Bus Operator successfully registered into database but error in sending email"
                                    });
                                }
                                else {
                                    console.log(req.body.name + " Registered as Operator");
                                    res.json({
                                        success: true,
                                        msg: "Bus Operator successfully registered",
                                        operator: resu.insertId
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

router.post('/editopnbus',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    var password = generator.generate({
        length: 15,
        numbers: true
    });
    sqlcon.connection.query("SELECT * FROM operator WHERE email=?",[req.body.email], function (error, result, fields) {
        if (error) {
            res.json({success: false, msg: "Failed to register Bus Operator: Connection error."});
        }else {
            if (result.length > 0) {
                console.log("Bus Operator already registered in the system");
                res.json({success:false, msg:"Bus Operator already registered in the system"});
            }
            else {
                sqlcon.connection.query("SELECT edit_bus_n_operator(?,?,?,?,?,?,?,?,?,?,?,?,?) AS res;",[
                    req.body.licence,
                    req.body.orig_licence,
                    req.body.type,
                    req.body.r_rows,
                    req.body.r_seats,
                    req.body.l_rows,
                    req.body.l_seats,
                    null,
                    req.body.owner,
                    req.body.email,
                    'waiting',
                    password,
                    config.secret,
                ], function (error, resu, fields) {
                    if (error)
                    {
                        console.log(error);
                        res.json({success: false, msg: "Failed to register Bus Operator:Query Error"});
                    }
                    else {
                        if (resu[0].res === 1) {
                            var mailOptions = {
                                from: 'BookMySeat <bookmyseat.15@gmail.com>',
                                to: req.body.email,
                                subject: 'Login Password - BookMySeat',
                                text: 'Your password for the Bus Operator account is ' + password
                            };
                            transproter.sendMail(mailOptions, function (mailerror, mailres) {
                                if (mailerror) {
                                    res.json({
                                        success: true,
                                        msg: "Bus Operator successfully edited but error in sending email"
                                    });
                                }
                                else {
                                    console.log(req.body.name + " Registered as Operator");
                                    res.json({
                                        success: true,
                                        msg: "Bus Operator successfully registered",
                                        operator: resu.insertId
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
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

router.post('/getRoute',(req,res,next) => {

    var query = "SELECT route_num FROM route";

    sqlcon.connection.query(query,[],(error,results,field) => {
        if(error){
            console.log('Error: '+error);
        }
        else{
            return res.json({success:true,output:results})
        }
    })
});

router.post('/getDest',(req,res,next) => {
    var route = req.body.route.toString();
    var query = "SELECT start,end FROM route WHERE route_num = ?";

    sqlcon.connection.query(query,[route],(error,results,field) => {
        if(error){
            console.log('Error: '+error);
        }
        else{
            return res.json({success:true,output:results})
        }
    })
})

module.exports = router;