require('dotenv').config();
console.log(process.env.PGUSER);
const express = require('express');
const cors = require('cors');
// const { Pool } = require('pg');
const todoRouter = require('./routes/todo.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter);

const port = process.env.PORT;


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});