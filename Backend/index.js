const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); 

// Import Routes
const productRoutes = require('./src/routes/productRoutes');
const enquiryRoutes = require('./src/routes/enquiryRoutes');
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());              
app.use(bodyParser.json());   

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);


// This allows the frontend to access uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple Route for Server Health Check
app.get('/', (req, res) => {
    res.send('GVCC Solutions API is running...');
});


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🔗 Local URL: http://localhost:${PORT}`);
    });
}


module.exports = app;