// tables.js
const db = require('./db');

function createAllTables(callback) {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      address VARCHAR(255),
      country VARCHAR(100),
      state VARCHAR(100),
      postcode VARCHAR(20),
      mobile VARCHAR(20),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      website VARCHAR(255)
    )
  `;

  db.query(createUsersTable, (err, result) => {
    if (err) return callback(err);
    console.log("✅ Users table created.");

    // You can add more table creation queries below, e.g.:
    // const createAnotherTable = `...`;
    // db.query(createAnotherTable, ...);

    callback(null, "All tables created successfully.");
  });
}

module.exports = createAllTables;
