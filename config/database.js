const mysql      = require('mysql');

const connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'ananda',
    database : 'bookmyseat'
});

exports.connection = connection;
