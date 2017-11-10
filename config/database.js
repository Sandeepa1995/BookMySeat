const mysql      = require('mysql');

const connection = mysql.createConnection({
    host     : '139.59.116.69',
    user     : 'bookmyseat',
    password : 'password',
    database : 'bookmyseat'
});

exports.connection = connection;
