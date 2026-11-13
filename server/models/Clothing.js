/* global require, module */
const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
    },

    color: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Clothing", clothingSchema);