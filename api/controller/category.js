const mongoose = require("mongoose");
const Category = require("../models/category");
const Product = require("../models/product");

exports.category_create = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        Code: req.body.Code,
        Name: req.body.Name
    });
    category
        .save()
        .then(result => {
            res.status(201).json({
                message: "Created category successfully",
                category: {
                    name: result.Name,
                    id: result._id,
                    code: result.Code
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.get_all_category = (req, res, next) => {
    Category.find()
        .select("Name _id Code")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                categories: docs.map(doc => {
                    return {
                        id: doc._id,
                        Code: doc.Code,
                        Name: doc.Name
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

exports.delete_category = (req, res, next) => {
    const id = req.params.categoryID;

    Product.countDocuments({
        Category: id
    }, (err, count) => {
        if (count <= 0) {
            Category.findByIdAndRemove({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Deteled category successfully",
                        request: {
                            type: "POST",
                            body: {
                                id: result._id,
                                name: result.Name,
                                code: result.Code
                            }
                        }
                    });
                })
        } else {
            res.status(500).json({
                message: "This category contains the product"
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.update_category = (req, res, next) => {
    const id = req.params.categoryID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Category.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Update Category successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}