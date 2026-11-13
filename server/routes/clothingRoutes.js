/* global require, module */
const express = require("express");
const router = express.Router();

const Clothing = require("../models/Clothing");

// ADD CLOTHING
router.post("/", async(req, res) => {
    try {
        const { name, category, color, image } = req.body;

        const clothing = await Clothing.create({
            name,
            category,
            color,
            image,
        });

        res.status(201).json({
            success: true,
            message: "Clothing added successfully!",
            clothing,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// GET ALL CLOTHES
router.get("/", async(req, res) => {
    try {
        const clothes = await Clothing.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: clothes.length,
            clothes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// UPDATE CLOTHING
router.put("/:id", async(req, res) => {
    try {
        const clothing = await Clothing.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Clothing not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Clothing updated successfully!",
            clothing,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// DELETE CLOTHING
router.delete("/:id", async(req, res) => {
    try {
        const clothing = await Clothing.findByIdAndDelete(req.params.id);

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Clothing not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Clothing deleted successfully!",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;