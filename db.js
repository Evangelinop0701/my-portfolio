const mysql = require('mysql2');

// Create connection
const db = mysql.createConnection({
  host: 'localhost',      // XAMPP runs on localhost
  user: 'root',           // default user in XAMPP
  password: '',           // default password is empty
  database: 'db_portfolio'      // replace with your database name
});

// Connect
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = db;
