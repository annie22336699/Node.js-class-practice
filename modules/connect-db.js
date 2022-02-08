const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'cloud', 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME || 'mfee23', 
    waitForConnections: true,  // 是否等待連線，基本上都是是
    connectionLimit: 5,  // 最高多少人連線
    queueLimit: 0
});

module.exports= pool.promise();