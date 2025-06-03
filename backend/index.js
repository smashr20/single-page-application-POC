const express = require('express');
const cors = require('cors');
const db = require('./db');
const uploadRoute = require('./upload');

const app = express();
const port = 3000;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend.onrender.com'], // add your frontend URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', uploadRoute);
app.use('/uploads', express.static('uploads')); // serve uploaded images


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

  if (
    !name || !address || !country || !state || !postcode ||
    !mobile || !email || !password || !confirmPassword || !role
  ) {
    return res.status(400).json({ error: "All fields except website are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const allowedRoles = ['entertainer', 'bands', 'celebrities', 'services', 'speakers', 'customer', 'admin'];
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

      // Get the newly inserted user
      const newUserQuery = `SELECT id, name, email, role FROM users WHERE id = ?`;
      db.query(newUserQuery, [result.insertId], (err2, userResults) => {
        if (err2 || userResults.length === 0) {
          return res.status(500).json({ error: "User registered but failed to fetch user details." });
        }

        const user = userResults[0];
        res.status(201).json({
          message: "User registered successfully.",
          user: user
        });
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

app.post('/api/get-profile', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
    SELECT id, name, address, country, state, postcode, mobile, email, website, role, profilePhoto 
    FROM users 
    WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: results[0] });
  });
});



app.post('/api/update-profile', (req, res) => {
  const {
    id,
    name,
    address,
    country,
    state,
    postcode,
    mobile,
    website
  } = req.body;

  if (!id || !name || !address || !country || !state || !postcode || !mobile) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const query = `
    UPDATE users 
    SET name = ?, address = ?, country = ?, state = ?, postcode = ?, mobile = ?, website = ?
    WHERE id = ?
  `;

  const values = [name, address, country, state, postcode, mobile, website || "", id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  });
});


app.get('/api/entertainers', (req, res) => {
  const query = `
    SELECT id, name, address, country, state, postcode, mobile, email, website, role, profilePhoto
    FROM users
    WHERE role NOT IN ('admin', 'customer')
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching entertainers:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ entertainers: results });
  });
});

app.post('/api/book', (req, res) => {
  const { customerId, entertainerId, bookingDate, description, status } = req.body;

  if (!customerId || !entertainerId || !bookingDate || !description || !status) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const insertQuery = `
    INSERT INTO bookings (customerId, entertainerId, bookingDate, description, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [customerId, entertainerId, bookingDate, description, status], (err, result) => {
    if (err) {
      console.error("Booking DB error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    res.status(201).json({ message: "Booking created successfully.", bookingId: result.insertId });
  });
});


const entertainerRoles = ["entertainer", "bands", "celebrities", "speakers", "services"];

app.post("/api/get-bookings", (req, res) => {
  const { id, role } = req.body;
  console.log("Received data -> id:", id, "role:", role);

  if (!id || !role) {
    return res.status(400).json({ error: "Missing id or role in request body" });
  }

  let query = "";
  let params = [];

  if (entertainerRoles.includes(role)) {
    query = `
      SELECT b.id, u.name AS customer, b.bookingDate, b.description, b.status
      FROM bookings b
      JOIN users u ON b.customerId = u.id
      WHERE b.entertainerId = ?
      ORDER BY b.bookingDate DESC
    `;
    params = [id];
  } else if (role === "customer") {
    query = `
      SELECT b.id, e.name AS customer, b.bookingDate, b.description, b.status
      FROM bookings b
      JOIN users e ON b.entertainerId = e.id
      WHERE b.customerId = ?
      ORDER BY b.bookingDate DESC
    `;
    params = [id];
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Failed to retrieve bookings" });
    }
    res.status(200).json({ bookings: results });
  });
});





app.post('/api/update-booking', (req, res) => {
  let { id, status, message, senderId } = req.body;

  id = parseInt(id);
  senderId = parseInt(senderId);

  if (!id || !status || !senderId) {
    return res.status(400).json({ error: "Missing required fields (id, status, senderId)." });
  }

  const updateStatusQuery = `UPDATE bookings SET status = ? WHERE id = ?`;

  db.query(updateStatusQuery, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating booking status:", err);
      return res.status(500).json({ error: "Database error while updating booking." });
    }

    // Only insert a message if it's provided
    if (message && message.trim() !== "") {
      const insertMessageQuery = `
        INSERT INTO booking_messages (bookingId, senderId, message)
        VALUES (?, ?, ?)
      `;
      db.query(insertMessageQuery, [id, senderId, message.trim()], (err2, result2) => {
        if (err2) {
          console.error("Error inserting message:", err2);
          return res.status(500).json({ error: "Message save failed." });
        }

        return res.status(200).json({ message: "Booking status and message updated." });
      });
    } else {
      return res.status(200).json({ message: "Booking status updated (no message sent)." });
    }
  });
});







app.post('/api/send-booking-message', (req, res) => {
  const { bookingId, senderId, message } = req.body;

  if (!bookingId || !senderId || !message?.trim()) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO booking_messages (bookingId, senderId, message)
    VALUES (?, ?, ?)
  `;

  db.query(query, [bookingId, senderId, message], (err, result) => {
    if (err) {
      console.error("Error sending message:", err);
      return res.status(500).json({ error: "Message sending failed" });
    }

    res.status(200).json({ message: "Message sent successfully" });
  });
});


app.get('/api/stats-summary', (req, res) => {
  const summary = {
    totalBookings: 0,
    totalMessages: 0,
  };

  const bookingCountQuery = `SELECT COUNT(*) AS count FROM bookings`;
  const messageCountQuery = `SELECT COUNT(*) AS count FROM booking_messages`;

  db.query(bookingCountQuery, (err1, result1) => {
    if (err1) {
      console.error("Error getting booking count:", err1);
      return res.status(500).json({ error: "Error fetching booking count" });
    }

    summary.totalBookings = result1[0].count;

    db.query(messageCountQuery, (err2, result2) => {
      if (err2) {
        console.error("Error getting message count:", err2);
        return res.status(500).json({ error: "Error fetching message count" });
      }

      summary.totalMessages = result2[0].count;
      res.status(200).json(summary);
    });
  });
});


app.get("/api/get-users", (req, res) => {
  const query = `
    SELECT id, name, email, mobile, address, country, state, postcode, role, profilePhoto
    FROM users
    ORDER BY id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to retrieve users" });
    }

    res.status(200).json({ users: results });
  });
});




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
