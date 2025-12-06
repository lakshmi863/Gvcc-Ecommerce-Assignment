const Enquiry = require('../models/enquiryModel');


const createEnquiry = async (req, res) => {
    try {
        const { product_id, name, email, phone, message } = req.body;

        // Basic Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                error: "Name, Email, and Message are required fields." 
            });
        }

        // Validate Email Format (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: "Invalid email format." 
            });
        }

        // Call Model to Save
        const newId = await Enquiry.create({ product_id, name, email, phone, message });

        res.status(201).json({ 
            success: true, 
            message: "Enquiry submitted successfully", 
            enquiryId: newId 
        });

    } catch (err) {
        console.error("Error in createEnquiry:", err);
        res.status(500).json({ success: false, error: "Failed to submit enquiry" });
    }
};

// 2. Get All Enquiries (Admin Feature)
const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll();
        
        res.status(200).json({ 
            success: true, 
            data: enquiries 
        });

    } catch (err) {
        console.error("Error in getEnquiries:", err);
        res.status(500).json({ success: false, error: "Failed to retrieve enquiries" });
    }
};

module.exports = {
    createEnquiry,
    getEnquiries
};