const mysql = require('mysql2')
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '2512',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});