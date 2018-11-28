const mongoose = require("mongoose");

const cashBillSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 15
    },
    Customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    Products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    Date: {
        type: Date,
        default: Date.now
    },
    Shipper: {
        type: String,
        trim: true,
    },
    Note: {
        type: String,
        trim: true
    },
    GrandTotal: {
        type: Number,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model("CashBill", cashBillSchema);