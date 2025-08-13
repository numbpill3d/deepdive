const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ensure table exists
const createTableQuery = `CREATE TABLE IF NOT EXISTS sites (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
pool.query(createTableQuery).catch(console.error);

// Endpoint to submit a new site
app.post('/api/sites', async (req, res) => {
  const { url, title, description } = req.body;
  if (!url || !title) {
    return res.status(400).json({ error: 'URL and title are required.' });
  }
  try {
    await pool.query(
      'INSERT INTO sites (url, title, description) VALUES ($1, $2, $3)',
      [url, title, description]
    );
    res.status(201).json({ message: 'Site submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// Endpoint to get all submitted sites
app.get('/api/sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sites ORDER BY submitted_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
