const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Point to the EXACT same file your server uses
const dbPath = path.resolve(__dirname, 'src/config/gvcc.db');

console.log("📂 Checking Database File at:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Could not connect:", err.message);
    } else {
        console.log("✅ Connected. Querying table...");
        
        // 2. Count the products
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
            if (err) {
                console.error("❌ Query Failed:", err.message);
            } else {
                console.log("---------------");
                console.log(`📊 TOTAL PRODUCTS FOUND: ${row.count}`);
                console.log("---------------");
                
                if (row.count > 0) {
                    console.log("🎉 The database HAS data!");
                    console.log("👉 If your API still returns [], restart your server with: node index.js");
                } else {
                    console.log("⚠️ The database is EMPTY.");
                    console.log("👉 You must run: node setupDb.js");
                }
            }
        });
    }
});