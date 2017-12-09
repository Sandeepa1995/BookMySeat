const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlcon = require('./../config/database');

// function convert(time){
//     if(time[6] === 'A'){
//         if(time.substr(0,2) === '12'){
//             var ntime = '00'+time.substr(2,5);
//         }
//         else{
//             var ntime = time.substr(0,5);
//         }
//     }
//     else{
//         if(time.substr(0,2) === '12'){
//             var ntime = time.substr(0,5);
//         }
//         else{
//             hr = parseInt(time.substr(0,2)) + 12;
//             var ntime = String(hr)+time.substr(2,5);
//         }
//     }
//     return ntime
// }

router.post('/search', (req,res,next) => {
    const value1 = req.body.searchValue1;
    const value2 = req.body.searchValue2;
    const date = req.body.date;
    var searchQuery = "SELECT id,license,route,start,end,time_format(time,'%h:%i %p') time,type,seats,bookings "
                    + "FROM (SELECT * FROM trips where start LIKE ? and end LIKE ? ) as x "
                    + "LEFT JOIN (SELECT trip_ID, count(*) as bookings FROM booking_details WHERE date = ? GROUP BY bus_license) as y "
                    + "ON id = trip_ID ORDER BY time;";
    // var searchQuery = "SELECT id,license,trips.route,start,end,time_format(time,'%h:%i %p') time,type,seats,count(*) FROM trips WHERE start LIKE ? AND end LIKE ? ORDER BY time;";

    sqlcon.connection.query(searchQuery,[
        ("%"+value1.toString()+"%"),
        ("%"+value2.toString()+"%"),
        (date.toString())
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

router.post('/reserve',(req,res,next) => {
    var details = req.body.details;
    var date = req.body.date;
    var user = req.body.user;
    var time = details.time.toString();
    var ntime;
    var number = req.body.nos;

    if(time[6] === 'A'){
        if(time.substr(0,2) === '12'){
            var ntime = '00'+time.substr(2,5);
        }
        else{
            var ntime = time.substr(0,5);
        }
    }
    else{
        if(time.substr(0,2) === '12'){
            var ntime = time.substr(0,5);
        }
        else{
            hr = parseInt(time.substr(0,2)) + 12;
            var ntime = String(hr)+time.substr(2,5);
        }
    }


    var insertQuery = "INSERT INTO booking_details(booker_id,bus_license,route,start_time,date,trip_ID) VALUES(?,?,?,?,?,?);";

    sqlcon.connection.query(insertQuery,[
        user.name.toString(),
        details.license.toString(),
        details.route.toString(),
        ntime,
        date.date.toString(),
        details.id.toString()
    ], (error,results,fields) => {
        if(error){
            console.log('Error: '+error);
            res.json({success:false, output: "Unsuccessful"});
        }
        else{
            res.json({success:true, output: "Successful"});
        }
    });
});

router.post('/bookings',(req,res,next) => {
    var date = req.body.date.date;
    var details = req.body.details;
    var time = details.time.toString();
    var ntime;

    if(time[6] === 'A'){
        if(time.substr(0,2) === '12'){
            var ntime = '00'+time.substr(2,5);
        }
        else{
            var ntime = time.substr(0,5);
        }
    }
    else{
        if(time.substr(0,2) === '12'){
            var ntime = time.substr(0,5);
        }
        else{
            hr = parseInt(time.substr(0,2)) + 12;
            var ntime = String(hr)+time.substr(2,5);
        }
    }

    var query = "SELECT count FROM trips LEFT JOIN (SELECT trip_ID,count(*) as count FROM booking_details WHERE date = ? GROUP BY bus_license) as y "
                +"on id = trip_ID WHERE license = ? AND time = ?;";

    sqlcon.connection.query(query,[
        date,
        details.license.toString(),
        ntime
    ],(error,results,fields) => {
        if(error){
            console.log('Error: '+error);
        }
        else{
            return res.json({success: true, output: results[0].count})
        }
    })
});




module.exports = router;