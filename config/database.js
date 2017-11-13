const mysql      = require('mysql');
const config = require('./../../config.json');

const connection = mysql.createConnection({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : 'bookmyseat'
});

exports.connection = connection;
