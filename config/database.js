const mysql      = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'ananda',
    database : 'bookmyseat'
});

exports.connection = connection;
