require('dotenv').config();
const { Pool } = require('pg');

const query = (sql, values = []) => {
    return new Promise(async(resolve, reject) => {
        try {
            const pool = openDB();
            const result = await pool.query(sql, values);
            resolve(result);
        } catch (error) {
            reject(error.message);
        }
    });
}

const openDB = () => {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    return pool;
}
module.exports = { query};