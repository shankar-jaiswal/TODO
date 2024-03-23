const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Todo',
    password: 'Chandrauta369@',
    port: 5432
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'hello world' });
});

app.post('/new', (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING id', [description], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: result.rows[0].id });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});