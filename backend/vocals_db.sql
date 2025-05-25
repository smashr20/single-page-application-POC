create database vocals;

use vocals;

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
  website VARCHAR(255)
);

ALTER TABLE users
ADD COLUMN role ENUM(
  'entertainer',
  'bands',
  'celebrities',
  'services',
  'speakers',
  'customer',
  'admin'
) NOT NULL DEFAULT 'customer';

ALTER TABLE users ADD COLUMN profilePhoto VARCHAR(255);


select * from users;

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

select * from bookings;

CREATE TABLE IF NOT EXISTS booking_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookingId INT NOT NULL,
  senderId INT NOT NULL,
  message TEXT NOT NULL,
  sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id)
);

select * from booking_messages;

