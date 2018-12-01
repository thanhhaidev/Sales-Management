const mongoose = require("mongoose");
const Customer = require("../models/customer");
const InstallmentBill = require("../models/installmentbill");
const Product = require("../models/product");

exports.installmentbill_create = (req, res, next) => {
    const CustomerID = req.body.CustomerID;

    checkQuantity(req.body.ArrayProductID, (valid, invalid) => {
        Customer.findById({
                _id: CustomerID
            })
            .exec()
            .then(result => {
                InstallmentBill.countDocuments({
                        Customer: CustomerID
                    },
                    (err, count) => {
                        if (err) {
                            res.send(err);
                            return;
                        }
                        let str = "" + (count + 1);
                        let pad = "0000";
                        let date = new Date();
                        let currentYear = "" + date.getFullYear();
                        let currentMonth = date.getMonth() + 1;
                        let codeInstallmentBill =
                            "I" +
                            currentYear.substr(2, 4) +
                            currentMonth +
                            pad.substring(0, pad.length - str.length) +
                            str;

                        const installmentBill = new InstallmentBill({
                            _id: new mongoose.Types.ObjectId(),
                            Code: codeInstallmentBill,
                            Customer: req.body.CustomerID,
                            Products: valid,
                            Shipper: req.body.Shipper,
                            Note: req.body.Note,
                            GrandTotal: req.body.GrandTotal,
                            Period: req.body.Period,
                            Method: req.body.Method,
                            Taken: req.body.Taken,
                            Remain: req.body.Remain
                        });
                        installmentBill.save().then(result => {
                            res.status(201).json({
                                message: "Created Installment Bill successfully",
                                installmentbills: {
                                    id: result._id,
                                    Code: result.Code,
                                    Customer: result.CustomerID,
                                    Product: result.Product,
                                    Shipper: result.Shipper,
                                    Note: result.Note,
                                    GrandTotal: result.GrandTotal,
                                    Date: result.Date,
                                    ProductInvalid: invalid,
                                    Period: result.Period,
                                    Method: result.Method,
                                    Taken: result.Taken,
                                    Remain: result.Remain
                                }
                            });
                        });
                    }
                );
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
};

exports.get_all_installmentbill = (req, res, next) => {
    InstallmentBill.find()
        .select("Code _id Customer Product Shipper Note GrandTotal Date Method Taken Period Remain")
        .populate("Customer", "Name Address YearOfBirth PhoneNumber")
        .populate("Product", "Name Code SalePrice")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                cashbills: docs.map(doc => {
                    return {
                        id: doc._id,
                        Code: doc.Code,
                        Customer: doc.Customer,
                        Products: doc.Product,
                        Shipper: doc.Shipper,
                        Note: doc.Note,
                        GrandTotal: doc.GrandTotal,
                        Date: doc.Date,
                        Period: doc.Period,
                        Method: doc.Method,
                        Taken: doc.Taken,
                        Remain: doc.Remain
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_installmentbill = (req, res, next) => {
    const id = req.params.installmentbillID;
    InstallmentBill.findByIdAndRemove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Deteled installment bill successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.update_installmentbill = (req, res, next) => {
    const id = req.params.installmentbillID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    InstallmentBill.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Update installment bill successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

async function checkQuantity(arr, cb) {
    let valid = [];
    let invalid = [];
    for (let i = 0; i < arr.length; i++) {
        var result = await Product.findById({
            _id: arr[i]
        });
        if (result.Quantity > 0) {
            valid.push(arr[i]);
        } else {
            invalid.push(arr[i]);
        }
    }
    cb(valid, invalid);
}