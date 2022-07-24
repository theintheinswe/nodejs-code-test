var mysql = require('mysql');
var util = require('util');

var poolPromise = mysql.createPool({
    connectionLimit: 20,
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

poolPromise.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    } else
        console.log("DB is Connected");

    if (connection) {
        console.log("Release connection");
        connection.release();
    }
    return;
});
// Promisify for Node.js async/await.

poolPromise.query = util.promisify(poolPromise.query);

poolPromise.format = (str, data) => {
    return mysql.format(str, data);
}

poolPromise.mysql_escape = function (str) {
    if (str === undefined || str === "") {
        return "";
    } else {
        var str = str.toString();
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
            }
        });
    }
}

module.exports = {
    mysql,
    poolPromise
}
