const mysql      = require('mysql');
const config = require('./../../config.json');

const connection = mysql.createConnection({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : 'bookmyseat'
});

// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'ananda',
//     database : 'bookmyseat'
// });

exports.connection = connection;
