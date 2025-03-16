const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',  // Change if using a remote database
    user: 'root',       // Your MySQL username
    password: '',       // Your MySQL password (leave empty if none)
    database: 'todo_db' // The database name
});

connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database!');
});

module.exports = connection;
