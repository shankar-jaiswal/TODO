require('dotenv').config();
console.log(process.env.PGUSER);
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/', async (req, res) => {
    try {
        const tasks = await pool.query('SELECT * FROM task');
        const rows = tasks.rows ? tasks.rows : []; // Used tasks.rows instead of result.rows
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
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
        res.status(200).json(newTask.rows[0]);
    } catch (error) {
        console.log(error);
        res.statusMessage = error
        res.status(500).json({ error: error.message });
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await pool.query('DELETE FROM task WHERE id = $1', [id]);
        res.status(200).json({ id: id });
    } catch (error) {
        console.log(error);
        res.statusMessage = error
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});