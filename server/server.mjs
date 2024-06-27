// Import necessary modules
import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Initialize Express application
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Get the directory path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database setup
const dbPath = resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create employees table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      phone TEXT,
      age INTEGER,
      password TEXT
    )
  `);
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { username, email, phone, age, password } = req.body;
  db.run(
    `INSERT INTO employees (username, email, phone, age, password) VALUES (?, ?, ?, ?, ?)`,
    [username, email, phone, age, password],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(201).send({ id: this.lastID });
    }
  );
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT * FROM employees WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (row) {
        res.status(200).send({ message: 'Login successful', user: row });
      } else {
        res.status(400).send({ message: 'Invalid credentials' });
      }
    }
  );
});

// Retrieve all employees endpoint
app.get('/employees', (req, res) => {
  db.all(`SELECT * FROM employees`, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(rows);
  });
});

// Update employee by ID endpoint
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, phone, age, password } = req.body;
  db.run(
    `UPDATE employees SET username = ?, email = ?, phone = ?, age = ?, password = ? WHERE id = ?`,
    [username, email, phone, age, password, id],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ message: 'Employee updated' });
    }
  );
});

// Delete employee by ID endpoint
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM employees WHERE id = ?`, id, function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ message: 'Employee deleted' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
