const express = require("express");

const {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProduct);

// CREATE product
router.post("/", createProduct);

// DELETE product
router.delete("/:id", deleteProduct);

module.exports = router;