const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
    
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});


const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB Limit
    fileFilter: fileFilter 
});


router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
      
        const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'Image uploaded!',
            imageUrl: imageUrl
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;