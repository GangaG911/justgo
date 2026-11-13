const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const ClothingItem = require("../models/ClothingItem");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadImage, deleteImage } = require("../config/cloudinary");

const router = express.Router();

// Authentication required for all wardrobe routes
router.use(authMiddleware);

// Multer configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and WEBP images are allowed"));
        }
    }
});

// Validate MongoDB ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get user's wardrobe
router.get("/", async(req, res) => {
    try {
        const items = await ClothingItem.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        console.error("Get wardrobe error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch wardrobe"
        });
    }
});

// Add clothing item
router.post("/", async(req, res) => {
    try {
        const {
            name,
            category,
            color,
            occasions,
            season,
            notes
        } = req.body;

        if (!name || !category || !color) {
            return res.status(400).json({
                success: false,
                message: "Name, category and color are required"
            });
        }

        const item = await ClothingItem.create({
            user: req.userId,
            name: name.trim(),
            category,
            color,
            occasions: occasions || [],
            season: season || "",
            notes: notes || "",
            imageUrl: "",
            imagePublicId: ""
        });

        return res.status(201).json({
            success: true,
            message: "Clothing item added successfully",
            item
        });

    } catch (error) {
        console.error("Add clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to add clothing item"
        });
    }
});

// Get single clothing item
router.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid clothing item ID"
            });
        }

        const item = await ClothingItem.findOne({
            _id: id,
            user: req.userId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }

        return res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        console.error("Get clothing item error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch clothing item"
        });
    }
});

// Update clothing item
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid clothing item ID"
            });
        }

        const allowedFields = [
            "name",
            "category",
            "color",
            "occasions",
            "season",
            "notes"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.name !== undefined) {
            updates.name = String(updates.name).trim();

            if (!updates.name) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty"
                });
            }
        }

        const item = await ClothingItem.findOneAndUpdate({
                _id: id,
                user: req.userId
            },
            updates, {
                new: true,
                runValidators: true
            }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Clothing item updated successfully",
            item
        });

    } catch (error) {
        console.error("Update clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update clothing item"
        });
    }
});

// Upload or replace clothing image
router.post("/:id/image", (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next();
    });
}, async(req, res) => {
    let uploadedImage = null;

    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid clothing item ID"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image"
            });
        }

        // Verify actual image file type
        const { fileTypeFromBuffer } = await
        import ("file-type");

        const fileType = await fileTypeFromBuffer(req.file.buffer);

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!fileType || !allowedTypes.includes(fileType.mime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid image file"
            });
        }

        const item = await ClothingItem.findOne({
            _id: id,
            user: req.userId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }

        // Upload new image to Cloudinary
        uploadedImage = await uploadImage(req.file.buffer);

        if (!uploadedImage ||
            !uploadedImage.imageUrl ||
            !uploadedImage.imagePublicId
        ) {
            throw new Error("Cloudinary image upload failed");
        }

        const oldImagePublicId = item.imagePublicId;

        item.imageUrl = uploadedImage.imageUrl;
        item.imagePublicId = uploadedImage.imagePublicId;

        await item.save();

        // Delete old image after successful database update
        if (oldImagePublicId) {
            try {
                await deleteImage(oldImagePublicId);
            } catch (deleteError) {
                console.error("Old image cleanup failed:", deleteError);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            item
        });

    } catch (error) {
        console.error("Image upload error:", error);

        if (uploadedImage && uploadedImage.imagePublicId) {
            try {
                await deleteImage(uploadedImage.imagePublicId);
            } catch (deleteError) {
                console.error("Cloudinary cleanup failed:", deleteError);
            }
        }

        return res.status(500).json({
            success: false,
            message: "Unable to upload image"
        });
    }
});

// Delete clothing image
router.delete("/:id/image", async(req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid clothing item ID"
            });
        }

        const item = await ClothingItem.findOne({
            _id: id,
            user: req.userId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }

        if (!item.imagePublicId) {
            return res.status(400).json({
                success: false,
                message: "No image found for this item"
            });
        }

        const publicId = item.imagePublicId;

        item.imageUrl = "";
        item.imagePublicId = "";

        await item.save();

        try {
            await deleteImage(publicId);
        } catch (deleteError) {
            console.error("Cloudinary image deletion failed:", deleteError);
        }

        return res.status(200).json({
            success: true,
            message: "Clothing image deleted successfully",
            item
        });

    } catch (error) {
        console.error("Delete clothing image error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete clothing image"
        });
    }
});

// Delete clothing item
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid clothing item ID"
            });
        }

        const item = await ClothingItem.findOne({
            _id: id,
            user: req.userId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }

        const imagePublicId = item.imagePublicId;

        await ClothingItem.deleteOne({
            _id: id,
            user: req.userId
        });

        if (imagePublicId) {
            try {
                await deleteImage(imagePublicId);
            } catch (deleteError) {
                console.error("Cloudinary cleanup failed:", deleteError);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Clothing item deleted successfully"
        });

    } catch (error) {
        console.error("Delete clothing error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete clothing item"
        });
    }
});

// eslint-disable-next-line no-undef
module.exports = router;