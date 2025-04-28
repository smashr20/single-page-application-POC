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
            creditScore: 300,
            id: "1",
        },
        {
            name: "Jane test",
            bank: "Commonwealth Bank",
            creditScore: 650,
            id: "2",
        },
        {
            name: "Mike kohli",
            bank: "Westpac Bank",
            creditScore: 560,
            id: "3",
        },
        {
            name: "user4",
            bank: "Commonwealth Bank",
            creditScore: 200,
            id: "4",
        },
        {
            name: "user5",
            bank: "Westpac Bank",
            creditScore: 388,
            id: "5",
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
            lastBankUsed: "icici",
            id: "1",
        },
        {
            name: "Jane Test",
            bank: "Commonwealth Bank",
            creditScore: 720,
            paymentdefualt: 2,
            lastBankUsed: "hdfc",
            id: "3",
        },
        {
            name: "Mike Kohli",
            bank: "Westpac Bank",
            creditScore: 680,
            paymentdefualt: 4,
            lastBankUsed: "axis",
            id: "2",
        }
    ];
    res.json(users);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
