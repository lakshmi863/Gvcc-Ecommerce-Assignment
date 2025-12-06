const Product = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const category = req.query.category || null;
        const search = req.query.search || null;
        
        // --- NEW PARAMS ---
        const minPrice = req.query.minPrice || null;
        const maxPrice = req.query.maxPrice || null;
        const sort = req.query.sort || null; 

        const [products, totalCount] = await Promise.all([
            Product.findAll(category, search, limit, offset, minPrice, maxPrice, sort),
            Product.countAll(category, search, minPrice, maxPrice)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            data: products,
            meta: { total: totalCount, page, limit, totalPages }
        });

    } catch (err) {
        console.error("Error in getProducts:", err);
        res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: "Product not found" });
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch details" });
    }
};

module.exports = { getProducts, getProductById };