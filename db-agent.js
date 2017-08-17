'use strict';
//--------------------------------------------------------------------------------
const mysql = require('mysql');
//--------------------------------------------------------------------------------
let connetionParams = {
                      host     : 'localhost',
                      database : 'hike_spirit',
                      user     : 'root',
                      multipleStatements: true
                    };                    
//--------------------------------------------------------------------------------
if (process.env.DATABASE_URL) {
    connetionParams.host     = process.env.DATABASE_URL;
    connetionParams.database = process.env.DATABASE_DB_NAME;
    connetionParams.user     = process.env.DATABASE_USER;
    connetionParams.password = process.env.DATABASE_PASSWORD;
    console.log('Database connection parameters changed to : ' + JSON.stringify(connetionParams));
}
//--------------------------------------------------------------------------------
function executeSQL( querySQL ) {
    return new Promise((resolve,reject) => {
        let connection = mysql.createConnection(connetionParams);
        
        connection.connect();
        connection.query( querySQL, (err, data) => {
            connection.destroy();
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
//--------------------------------------------------------------------------------
module.exports = {
    executeSQL
}