const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.resolve(__dirname, 'gvcc.db');

console.log("--------------------------------------------");
console.log("🔌 SERVER CONNECTING TO DB AT:");
console.log("   " + dbPath);
console.log("--------------------------------------------");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
    } else {
        console.log('✅ Connection Successful.');
        // Enable Foreign Keys
        db.run("PRAGMA foreign_keys = ON;");
    }
});

module.exports = db;