const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yournewpassword', 
  database: 'vocals'
});

db.connect(err => {
  if (err) {
    console.error("------Failed to connect to MySQL:----------", err.message);
    throw err;
  }
  console.log("----------Connected to MySQL database: vocals-------");
});

module.exports = db;
