require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// MySQL connection setup
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todolist_db'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database!');
});

// READ - Get all tasks
app.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            console.error('❌ Error fetching tasks:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// CREATE - Add a new task
app.post('/tasks', (req, res) => {
    const { title, status } = req.body;

    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required' });
    }

    const sql = 'INSERT INTO tasks (title, status) VALUES (?, ?)';
    connection.query(sql, [title, status], (err, result) => {
        if (err) {
            console.error('❌ Error adding task:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, title, status });
    });
});

// UPDATE - Edit a task
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    let { title, status } = req.body;

    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required' });
    }

    const query = 'UPDATE tasks SET title = ?, status = ? WHERE id = ?';
    connection.query(query, [title, status, taskId], (err, result) => {
        if (err) {
            console.error('❌ Error updating task:', err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// DELETE - Remove a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    const query = 'DELETE FROM tasks WHERE id = ?';
    connection.query(query, [taskId], (err, result) => {
        if (err) {
            console.error('❌ Error deleting task:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
