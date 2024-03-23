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

app.get('/', async (req, res) => {
    try {
        const tasks = await pool.query('SELECT * FROM task');
        res.json(tasks.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/new', async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const newTask = await pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [description]);
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});