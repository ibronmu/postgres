const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.json());

// Database configuration
const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Ibronmu@0770",
    database: "posts"
});

// Connect to PostgreSQL with error handling
con.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch(err => {
        console.error('❌ Failed to connect to PostgreSQL:', err.message);
        process.exit(1); // Exit if DB connection fails
    });

// Middleware for error logging
app.use((err, req, res, next) => {
    console.error('⚠️ Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// POST - Create a new author
app.post('/items', async (req, res) => {
    try {
        const { name, id } = req.body;

        // Input validation
        if (!name || !id) {
            return res.status(400).json({ error: "Name and ID are required!" });
        }

        const insert_query = 'INSERT INTO authors (name, id) VALUES($1, $2) RETURNING *';
        const result = await con.query(insert_query, [name, id]);
        
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("❌ POST Error:", err.message);
        res.status(500).json({ error: "Failed to create author" });
    }
});

// GET - Fetch all authors
app.get('/items', async (req, res) => {
    try {
        const get_query = 'SELECT * FROM authors';
        const result = await con.query(get_query);
        
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("❌ GET Error:", err.message);
        res.status(500).json({ error: "Failed to fetch authors" });
    }
});

// GET - Fetch author by ID
app.get('/items/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM authors WHERE id = $1";
        const result = await con.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("❌ GET by ID Error:", err.message);
        res.status(500).json({ error: "Failed to fetch author" });
    }
});

// PUT - Update author by ID
app.put('/items/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required!" });
        }

        const query = 'UPDATE authors SET name = $1 WHERE id = $2 RETURNING *';
        const result = await con.query(query, [name, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("❌ PUT Error:", err.message);
        res.status(500).json({ error: "Failed to update author" });
    }
});

// DELETE - Remove author by ID
app.delete('/items/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = 'DELETE FROM authors WHERE id = $1 RETURNING *';
        const result = await con.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.status(200).json({ success: true, message: "Author deleted" });
    } catch (err) {
        console.error("❌ DELETE Error:", err.message);
        res.status(500).json({ error: "Failed to delete author" });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
});