const db = require('../config/db');

const create = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(query, [userData.name, userData.email, userData.password], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = { create, findByEmail };