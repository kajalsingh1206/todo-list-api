const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Image Upload API is running!"
    });
});

// Image upload route
app.post("/api/upload", upload.single("image"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "Please upload an image"
        });
    }

    res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: `http://localhost:5002/uploads/${req.file.filename}`
    });
});

const PORT = 5002;

app.listen(PORT, () => {
    console.log(`Image Upload Server running on http://localhost:${PORT}`);
});