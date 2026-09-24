const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message,
        });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
};
