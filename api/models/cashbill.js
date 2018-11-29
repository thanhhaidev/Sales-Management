const mongoose = require("mongoose");
const Product = require("../models/product");

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

cashBillSchema.post('save', function (doc, next) {
    const array = doc.Products;
    array.forEach(id => {
        Product.findById({
                _id: id
            })
            .exec()
            .then((result) => {
                if (result.Quantity > 0) {
                    Product.findByIdAndUpdate({
                            _id: result._id
                        }, {
                            $set: {
                                Quantity: result.Quantity - 1
                            }
                        })
                        .exec()
                        .then((result) => {})
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
    next();
});

module.exports = mongoose.model("CashBill", cashBillSchema);