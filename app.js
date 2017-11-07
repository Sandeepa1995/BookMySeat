const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const sqlcon = require('./config/database');

const app=express();

const passenger = require('./routes/passenger');
const operator = require('./routes/operator');
const company = require('./routes/company');

// //Port Number
const  port=process.env.PORT || 3000;

//CORS Middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Routes
app.use("/passenger",passenger);
app.use("/operator",operator);
app.use("/company",company);

//Is database connected
sqlcon.connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + sqlcon.connection.threadId);
});
sqlcon.connection.end();


//Index Route
app.get('/',(req,res)=>{
    res.send("Invalid Endpoint");
});

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});

//Start Server
app.listen(port,()=>{
    console.log("Server started on "+port);
});