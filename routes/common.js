const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');

router.post('/search', (req,res,next) => {
    const value = req.body.searchValue;
    var searchQuery = "SELECT id,license,route,start,end,time_format(time,'%h:%i %p') time,type,seats FROM trips WHERE start LIKE ? OR end LIKE ? OR route LIKE ? ORDER BY time;";

    sqlcon.connection.query(searchQuery,[
        ("%"+value.toString()+"%"),
        ("%"+value.toString()+"%"),
        ("%"+value.toString()+"%")
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