const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');

router.post('/search', (req,res,next) => {
    const value1 = req.body.searchValue1;
    const value2 = req.body.searchValue2;
    var searchQuery = "SELECT id,license,route,start,end,time_format(time,'%h:%i %p') time,type,seats FROM trips WHERE start LIKE ? AND end LIKE ? ORDER BY time;";

    sqlcon.connection.query(searchQuery,[
        ("%"+value1.toString()+"%"),
        ("%"+value2.toString()+"%")
    ], (error,results,fields) => {
        if (error) {
            console.log('Error: '+error);
        }
        else if(results.length === 0) {
            console.log('Cannot find the route');
            return res.json({success: false, output: 'Cannot find the route'});
        }
        else {
            // console.log(results);
            return res.json({success:true,output: results})
        }
    });
});

module.exports = router;