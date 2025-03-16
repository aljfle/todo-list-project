const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json()); // Para mabasa ang JSON request body

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'todolist_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// READ - Get all tasks
app.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// UPDATE - Edit a task
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, completed } = req.body;

    const query = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ?';
    connection.query(query, [title, completed, taskId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Task not found' });
            return;
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
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
