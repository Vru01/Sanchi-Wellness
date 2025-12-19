const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json()); // Parse JSON bodies

// --- STATIC IMAGES ---
// This allows http://localhost:5000/uploads/image.png to work
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Create folder if it doesn't exist
}
app.use('/uploads', express.static(uploadDir));

// --- DATABASE SETUP (SQLite) ---
const dbPath = path.join(__dirname, 'wellness.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// --- ROUTES ---

// 1. SIGNUP
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        
        db.run(sql, [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                message: "User created successfully", 
                userId: this.lastID 
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during signup" });
    }
});

// 2. LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            // Send back user info (excluding password)
            res.json({ 
                message: "Login successful", 
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email 
                } 
            });
        } else {
            res.status(400).json({ error: "Invalid password" });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});