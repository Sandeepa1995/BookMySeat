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
                    + "LEFT JOIN (SELECT trip_ID, count(*) as bookings FROM booking_details WHERE date = ? GROUP BY bus_license,trip_ID) as y "
                    + "ON x.id = y.trip_ID ORDER BY time;";
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
    var seat  = req.body.seat;
    var time = details.time.toString();
    var ntime;
    var number = req.body.nos;

    if(time[6] === 'A'){
        if(time.substr(0,2) === '12'){
            var ntime = '00'+time.substr(2,4);
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
            // console.log(time.substr(2,4));
            var ntime = String(hr)+time.substr(2,4);
            // console.log(ntime);
        }
    }


    var insertQuery = "INSERT INTO booking_details(booker_id,bus_license,route,start_time,seat_no,date,trip_ID) VALUES(?,?,?,?,?,?,?);";

    sqlcon.connection.query(insertQuery,[
        user.name.toString(),
        details.license.toString(),
        details.route.toString(),
        ntime,
        seat.toString(),
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
    // console.log(req);
    var date = req.body.date.date;
    var details = req.body.details;
    var time = details.time.toString();
    var ntime;
    // console.log(date,details)

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
            var ntime = String(hr)+time.substr(2,4);
        }
    }

    var query ="SELECT seat_no FROM booking_details WHERE date = ? AND bus_license = ? AND start_time = ?";

    // "SELECT count FROM trips LEFT JOIN (SELECT trip_ID,count(*) as count FROM booking_details WHERE date = ? GROUP BY bus_license) as y "
    // +"on id = trip_ID WHERE license = ? AND time = ?;";

    sqlcon.connection.query(query,[
        date,
        details.license.toString(),
        ntime
    ],(error,results,fields) => {
        if(error){
            console.log('Error: '+error);
        }
        else{
            return res.json({success: true, output: results})
        }
    })
});

router.post('/getbookings', (req,res,next) => {
    var name = req.body.name.toString();
    var query = "SELECT reservation_ID,seat_no,time_format(start_time,'%h:%i %p') time,date,bus_license FROM booking_details WHERE booker_ID = ?";

    sqlcon.connection.query(query,[
        name
    ],(error,results,fields) => {
        if(error){
            console.log('Error '+error);
        }
        else{
            return res.json({success: true, output: results})
        }
    })
});

router.post('/cancelBooking', (req,res,next) => {
    var id = req.body.id.toString();
    var query = "DELETE FROM booking_details WHERE reservation_ID = ?";

    sqlcon.connection.query(query,[
        id
    ],(error,result,fields) => {
        if(error){
            console.log('Error: '+error)
        }
        else{
            return res.json({success:true})
        }
    })
});

router.post('/getdim', (req,res,next) => {
    var license = req.body.license.toString();
    var query = "SELECT r_rows,r_seats,l_rows,l_seats FROM bus WHERE licence_no = ?";

    sqlcon.connection.query(query,[
        license
    ],(error,results,fields) => {
        if(error){
            console.log('Error: '+error)
        }
        else{
            return res.json({success:true, output:results})
        }
    })
});




module.exports = router;