const db = require('../config/db');

// 1. Get All Products
const findAll = (category, search, limit, offset) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM products WHERE 1=1";
        let params = [];

        if (category) {
            query += " AND category = ?";
            params.push(category);
        }
        
        if (search) {
            query += " AND name LIKE ?";
            params.push(`%${search}%`);
        }

        query += " LIMIT ? OFFSET ?";
        params.push(limit, offset);

        // --- DEBUG LOGS ---
        console.log("---------------");
        console.log("📝 EXECUTING QUERY:", query);
        console.log("📎 PARAMETERS:", params);

        db.all(query, params, (err, rows) => {
            if (err) {
                console.error("❌ DB ERROR:", err);
                reject(err);
            } else {
                console.log(`✅ FOUND ${rows.length} PRODUCTS`);
                console.log("---------------");
                resolve(rows);
            }
        });
    });
};

const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM products WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const countAll = (category, search) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT COUNT(*) as count FROM products WHERE 1=1";
        let params = [];
        if (category) { query += " AND category = ?"; params.push(category); }
        if (search) { query += " AND name LIKE ?"; params.push(`%${search}%`); }
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
};

module.exports = { findAll, findById, countAll };