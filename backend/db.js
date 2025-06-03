const mysql = require('mysql2');

// Replace these values with your actual Railway MySQL credentials
const db = mysql.createConnection({
  host: 'switchyard.proxy.rlwy.net',
  port: 24314,
  user: 'root',
  password: 'GCgwzyyozBEXPTMZvMrOujkPObFhOITX',
  database: 'railway',
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0

});

// Full schema SQL (users, bookings, booking_messages)
const schema = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  role ENUM(
    'entertainer',
    'bands',
    'celebrities',
    'services',
    'speakers',
    'customer',
    'admin'
  ) NOT NULL DEFAULT 'customer',
  profilePhoto VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT NOT NULL,
  entertainerId INT NOT NULL,
  bookingDate DATE NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES users(id),
  FOREIGN KEY (entertainerId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS booking_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookingId INT NOT NULL,
  senderId INT NOT NULL,
  message TEXT NOT NULL,
  sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id)
);
`;

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL');

  db.query(schema, (err, results) => {
    if (err) {
      console.error('❌ Error creating tables:', err.message);
    } else {
      console.log('✅ Tables created or already exist');
    }
    // db.end();
  });
});


module.exports = db;