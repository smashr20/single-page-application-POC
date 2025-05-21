const express = require('express');
const cors = require('cors');
const db = require('./db'); // ← import MySQL connection

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        console.log("server is up.");
        res.send("Server is running");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/setup', (req, res) => {
  createAllTables((err, message) => {
    if (err) {
      console.error("Setup failed:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("Setup complete:", message);
    res.status(200).json({ message });
  });
});

app.post('/api/signup', (req, res) => {
  console.log('hit signup');

  const {
    name,
    address,
    country,
    state,
    postcode,
    mobile,
    email,
    password,
    confirmPassword,
    website,
    role
  } = req.body;

  // Basic validation
  if (
    !name || !address || !country || !state || !postcode ||
    !mobile || !email || !password || !confirmPassword || !role
  ) {
    return res.status(400).json({ error: "All fields except website are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const allowedRoles = ['entertainer', 'customer', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  const insertQuery = `
    INSERT INTO users (name, address, country, state, postcode, mobile, email, password, website, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [name, address, country, state, postcode, mobile, email, password, website || '', role],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: "Email already exists." });
        }
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "User registered successfully.",
        userId: result.insertId
      });
    }
  );
});


app.post('/api/login', (req, res) => {
    console.log('hit login');

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const query = `SELECT id, name, email, role FROM users WHERE email = ? AND password = ?`;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err.message);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = results[0];
    res.status(200).json({
      message: "Login successful",
      user: user // includes id, name, email, role
    });
  });
});




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
