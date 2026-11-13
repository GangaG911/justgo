const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 60
    },

    category: {
        type: String,
        required: true,
        enum: [
            "top",
            "bottom",
            "dress",
            "outerwear",
            "shoes",
            "accessory"
        ]
    },

    color: {
        type: String,
        trim: true,
        maxlength: 30,
        default: ""
    },

    occasions: {
        type: [{
            type: String,
            enum: [
                "casual",
                "college",
                "office",
                "party",
                "formal",
                "workout"
            ]
        }],
        default: []
    },

    season: {
        type: String,
        enum: [
            "summer",
            "winter",
            "monsoon",
            "all-season"
        ],
        default: "all-season"
    },

    notes: {
        type: String,
        trim: true,
        maxlength: 300,
        default: ""
    },

    imageUrl: {
        type: String,
        default: ""
    },

    imagePublicId: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

clothingSchema.index({
    user: 1,
    createdAt: -1
});

const ClothingItem = mongoose.model(
    "ClothingItem",
    clothingSchema
);

module.exports = ClothingItem;