const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    multipleStatements: true
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à MySQL:', err);
    } else {
        console.log('Connexion MySQL réussie ✅');
        connection.release();
    }
});

module.exports = db.promise();