const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    PhoneNumber: {
        type: String,
        trim: true,
        required: true,
        maxLength: 12
    },
    Address: {
        type: String,
        trim: true,
        required: true
    },
    YearOfBirth: {
        type: Number,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model("Customer", customerSchema);