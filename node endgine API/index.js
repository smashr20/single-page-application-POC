const express = require('express');
const app = express();
const port = 3000;

app.post('/api/login', (req, res) => {
    console.log(req.body)
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ error: "Name and password are required" });
    }
    res.json({ message: "Login successful", user: { name } });
});


app.get('/api/users', (req, res) => {
    const users = [
        {
            name: "John Doe",
            bank: "ANZ Bank",
            creditScore: 750
        },
        {
            name: "Jane Smith",
            bank: "Commonwealth Bank",
            creditScore: 600
        },
        {
            name: "Mike Johnson",
            bank: "Westpac Bank",
            creditScore: 400
        }
    ];
    res.json(users);
});

app.get('/api/users/details', (req, res) => {
    const users = [
        {
            name: "John Doe",
            bank: "ANZ Bank",
            creditScore: 750,
            paymentdefualt: 0,
            lastbankused: "anz",
        },
        {
            name: "Jane Smith",
            bank: "Commonwealth Bank",
            creditScore: 720,
            paymentdefualt: 2,
            lastbankused: "anz",
        },
        {
            name: "Mike Johnson",
            bank: "Westpac Bank",
            creditScore: 680,
            paymentdefualt: 4,
            lastbankused: "anz",
        }
    ];
    res.json(users);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
