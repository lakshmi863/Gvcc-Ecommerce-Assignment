const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "super_secret_gvcc_key"; 

// 1. REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        const userId = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

// 2. LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.name, email: user.email } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { register, login };