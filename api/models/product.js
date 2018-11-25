const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    Code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 15
    },
    Name: {
        type: String,
        required: true,
        maxLength: 100,
        trim: true
    },
    SalePrice: {
        type: Number,
        trim: true,
        required: true
    },
    OriginPrice: {
        type: Number,
        trim: true,
        required: true
    },
    InstallmentPrice: {
        type: Number,
        trim: true,
        required: true
    },
    Quantity: {
        type: Number,
        default: 0,
        trim: true
    },
    Avatar: {
        type: String,
        default: "http://localhost:3000/upload/avatars/default.png"
    }
});

module.exports = mongoose.model("Product", productSchema);