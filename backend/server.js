const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // Parse JSON bodies

// --- STATIC IMAGES ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// --- DATABASE SETUP (SQLite) ---
const dbPath = path.join(__dirname, 'wellness.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // USERS TABLE
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            category TEXT,
            img TEXT,
            tag TEXT
        )`, () => {
            // SEED DATA: If table is empty, insert your products
            db.get("SELECT count(*) as count FROM products", (err, row) => {
                if (row.count === 0) {
                    console.log("Seeding products...");
                    const products = [
                        ["Male Might", "Extreme Satisfaction", 899, "Men's Health", "/uploads/Products/P1.jpeg", "Best Seller"],
                        ["Virility Maxx", "Vitality Booster", 749, "Men's Health", "/uploads/Products/P2.jpeg", "Trending"],
                        ["Piyoosh", "Pure Cow Colostrum", 699, "Immunity", "/uploads/Products/P4.jpeg", null],
                        ["Wild Roots", "Anti Hair Fall Shampoo", 349, "Hair Care", "/uploads/Products/P5.jpeg", "Herbal"],
                        ["Aspire Face Wash", "Cucumber & Tea Tree", 249, "Face Care", "/uploads/Products/P9.jpeg", "Daily Use"],
                        ["Aloe Aura", "Soothe & Glow Gel", 199, "Skin Care", "/uploads/Products/P3.jpeg", null],
                        ["Blossom Care", "Intimate Hygiene Wash", 299, "Personal Care", "/uploads/Products/P6.jpeg", null],
                        ["Aspire Saffron Soap", "Sandalwood & Saffron", 129, "Bath & Body", "/uploads/Products/P7.jpeg", "Organic"],
                        ["Aspire Glow Soap", "Cream Soft Soap", 119, "Bath & Body", "/uploads/Products/P8.jpeg", null]
                    ];
                    
                    const insert = db.prepare("INSERT INTO products (name, description, price, category, img, tag) VALUES (?, ?, ?, ?, ?, ?)");
                    products.forEach(p => insert.run(p));
                    insert.finalize();
                }
            });
        });

        // CART TABLE (ADDED)
        db.run(`CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            name TEXT,
            price REAL,
            img TEXT,
            quantity INTEGER DEFAULT 1,
            UNIQUE(user_id, product_id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount REAL,
            status TEXT DEFAULT 'Pending', -- Pending, Paid, Shipped
            payment_method TEXT,
            transaction_id TEXT, -- The UPI Ref No / UTR
            shipping_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 5. ORDER ITEMS TABLE (To know what they bought)
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_name TEXT,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(order_id) REFERENCES orders(id)
        )`);
    }
});

// ---------------- ROUTES ---------------- //

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


// ================= CART ROUTES (ADDED) ================= //

// GET USER CART
app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT * FROM cart_items WHERE user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// ADD TO CART (OR INCREASE QTY)
app.post('/api/cart/add', (req, res) => {
    const { userId, product } = req.body;

    const sql = `
        INSERT INTO cart_items (user_id, product_id, name, price, img, quantity)
        VALUES (?, ?, ?, ?, ?, 1)
        ON CONFLICT(user_id, product_id)
        DO UPDATE SET quantity = quantity + 1
    `;

    db.run(
        sql,
        [userId, product.id, product.name, product.price, product.img],
        err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Added to cart" });
        }
    );
});

// DECREASE QUANTITY
app.post('/api/cart/decrease', (req, res) => {
    const { userId, productId } = req.body;

    const sql = `
        UPDATE cart_items
        SET quantity = quantity - 1
        WHERE user_id = ? AND product_id = ? AND quantity > 1
    `;

    db.run(sql, [userId, productId], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Quantity decreased" });
    });
});

// REMOVE ITEM FROM CART
app.post('/api/cart/remove', (req, res) => {
    const { userId, productId } = req.body;

    db.run(
        `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`,
        [userId, productId],
        err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Item removed" });
        }
    );
});

// --- CHECKOUT ROUTE ---
app.post('/api/checkout', (req, res) => {
    const { userId, totalAmount, transactionId, address, cartItems } = req.body;

    if (!userId || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
    }

    // 1. Insert into Orders Table
    const sqlOrder = `INSERT INTO orders (user_id, total_amount, status, payment_method, transaction_id, shipping_address) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sqlOrder, [userId, totalAmount, 'Pending Verification', 'UPI', transactionId, address], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        const orderId = this.lastID;

        // 2. Insert Items into Order_Items Table
        const sqlItem = `INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)`;
        const stmt = db.prepare(sqlItem);
        
        cartItems.forEach(item => {
            stmt.run(orderId, item.name, item.quantity, item.price);
        });
        stmt.finalize();

        // 3. Clear User's Cart
        db.run(`DELETE FROM cart_items WHERE user_id = ?`, [userId], (err) => {
            if (err) console.error("Error clearing cart:", err);
            
            res.status(201).json({ 
                message: "Order placed successfully!", 
                orderId: orderId 
            });
        });
    });
});

// --- GET USER ORDERS ---
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;

    // We join orders with order_items to get the full details
    const sql = `
        SELECT 
            o.id as order_id, 
            o.total_amount, 
            o.status, 
            o.created_at,
            oi.product_name, 
            oi.quantity, 
            oi.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Group the flat rows into nested order objects
        const ordersMap = {};
        
        rows.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    id: row.order_id,
                    total: row.total_amount,
                    status: row.status,
                    date: row.created_at,
                    items: []
                };
            }
            ordersMap[row.order_id].items.push({
                name: row.product_name,
                qty: row.quantity,
                price: row.price
            });
        });

        res.json(Object.values(ordersMap));
    });
});

// ------------------------------------------------------ //

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
