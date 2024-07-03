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

// Create users table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      password TEXT
    )
  `);

  // Create employees table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      phone TEXT,
      age INTEGER
    )
  `);
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, password],
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
    `SELECT * FROM users WHERE username = ? AND password = ?`,
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

// Add new employee endpoint
// app.post('/employees', (req, res) => {
//   const { name, email, phone, age } = req.body;
//   db.run(
//     `INSERT INTO employees (name, email, phone, age) VALUES (?, ?, ?, ?)`,
//     [name, email, phone, age],
//     function (err) {
//       if (err) {
//         return res.status(500).send(err.message);
//       }
//       res.status(201).send({ id: this.lastID });
//     }
//   );
// });

// Routes
app.get('/employees', (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    res.status(200).send(rows);
  });
});

app.post('/employees', (req, res) => {
  const { username, email, phone, age } = req.body;
  console.log('Request body:', req.body); // Log the request body

  // Validate input
  if (!username || !email || !phone || !age) {
    console.log('Validation error: All fields are required');
    return res.status(400).send({ message: 'All fields are required' });
  }

  // Run database insertion
  db.run(
    'INSERT INTO employees (username, email, phone, age) VALUES (?, ?, ?, ?)',
    [username, email, phone, age],
    function (err) {
      if (err) {
        console.error('Error inserting employee:', err.message);
        return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
      }
      res.status(201).send({ id: this.lastID });
    }
  );
});

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM employees WHERE id = ?', id, function (err) {
    if (err) {
      console.error('Error deleting employee:', err.message);
      return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
    }
    res.status(200).send({ message: 'Employee deleted successfully' });
  });
});


// // Update employee by ID endpoint
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, phone, age } = req.body;
  db.run(
    `UPDATE employees SET username = ?, email = ?, phone = ?, age = ? WHERE id = ?`,
    [username, email, phone, age, id],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ message: 'Employee updated' });
    }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
