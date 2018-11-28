const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const Cashbill = require("../models/cashbill");

exports.product_create = (req, res, next) => {
    const CategoryID = req.body.CategoryID;
    Category.findById({
            _id: CategoryID
        })
        .exec()
        .then(result => {
            Product.countDocuments({
                    Category: CategoryID
                },
                (err, count) => {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    let str = "" + (count + 1);
                    let pad = "00000";
                    let codeProduct =
                        result.Code + pad.substring(0, pad.length - str.length) + str;

                    const product = new Product({
                        _id: new mongoose.Types.ObjectId(),
                        Code: codeProduct,
                        Name: req.body.Name,
                        SalePrice: req.body.SalePrice,
                        OriginPrice: req.body.OriginPrice,
                        InstallmentPrice: req.body.InstallmentPrice,
                        Quantity: req.body.Quantity,
                        Avatar: req.file.path,
                        Category: req.body.CategoryID
                    });
                    product.save().then(result => {
                        res.status(201).json({
                            message: "Created product successfully",
                            product: {
                                id: result._id,
                                Code: result.Code,
                                Name: result.Name,
                                SalePrice: result.SalePrice,
                                OriginPrice: result.OriginPrice,
                                InstallmentPrice: result.InstallmentPrice,
                                Quantity: result.Quantity,
                                Avatar: "http://localhost:3000/" + result.Avatar,
                                Category: result.Category
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
};

exports.get_all_product = (req, res, next) => {
    Product.find()
        .select(
            "Name Code _id SalePrice OriginPrice InstallmentPrice Quantity Avatar Category"
        )
        .populate("Category", "Name")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        id: doc._id,
                        Code: doc.Code,
                        Name: doc.Name,
                        SalePrice: doc.SalePrice,
                        OriginPrice: doc.OriginPrice,
                        InstallmentPrice: doc.InstallmentPrice,
                        Quantity: doc.Quantity,
                        Avatar: "http://localhost:3000/" + doc.Avatar,
                        Category: doc.Category
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

exports.delete_product = (req, res, next) => {
    const id = req.params.productID;
    Cashbill.findOne({
            Products: id
        },
        (err, found) => {
            if (found === null) {
                Product.findByIdAndRemove({
                        _id: id
                    })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Deteled product successfully",
                            request: {
                                type: "POST",
                                body: {
                                    id: result._id,
                                    Code: result.Code,
                                    Name: result.Name,
                                    SalePrice: result.SalePrice,
                                    OriginPrice: result.OriginPrice,
                                    InstallmentPrice: result.InstallmentPrice,
                                    Quantity: result.Quantity,
                                    Avatar: "http://localhost:3000/" + result.Avatar,
                                    Category: result.Category
                                }
                            }
                        });
                    });
            } else {
                res.status(500).json({
                    message: "This product contains the cash bill"
                });
            }
        }
    ).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.update_product = (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Update product successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};