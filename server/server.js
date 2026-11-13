/* global require, process */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const wardrobeRoutes = require("./routes/wardrobeRoutes");
const clothingRoutes = require("./routes/clothingRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5175"
        ],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/wardrobe", wardrobeRoutes);
app.use("/api/clothes", clothingRoutes);

// Home route
app.get("/", (req, res) => {
    void req;
    res.status(200).json({
        success: true,
        message: "JustGo Backend is running!"
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`JustGo server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });