const db = require('../config/db');


const create = (enquiryData) => {
    return new Promise((resolve, reject) => {
       
        const query = `
            INSERT INTO enquiries (product_id, name, email, phone, message)
            VALUES (?, ?, ?, ?, ?)
        `;

        const params = [
            enquiryData.product_id,
            enquiryData.name,
            enquiryData.email,
            enquiryData.phone || null, 
            enquiryData.message
        ];

       
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};


const findAll = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT enquiries.*, products.name as product_name, products.image_url 
            FROM enquiries 
            LEFT JOIN products ON enquiries.product_id = products.id 
            ORDER BY enquiries.created_at DESC
        `;

        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Exporting
module.exports = {
    create,
    findAll
};