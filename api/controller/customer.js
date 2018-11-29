const mongoose = require("mongoose");
const Customer = require("../models/customer");
const CashBill = require("../models/cashbill");

exports.customer_create = (req, res, next) => {
    const customer = new Customer({
        _id: new mongoose.Types.ObjectId(),
        Code: req.body.Code,
        Name: req.body.Name,
        PhoneNumber: req.body.PhoneNumber,
        Address: req.body.Address,
        YearOfBirth: req.body.YearOfBirth
    });
    customer
        .save()
        .then(result => {
            res.status(201).json({
                message: "Created customer successfully",
                customer: {
                    id: result._id,
                    Code: result.Code,
                    Name: result.Name,
                    PhoneNumber: result.PhoneNumber,
                    Address: result.Address,
                    YearOfBirth: result.YearOfBirth
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.get_all_customer = (req, res, next) => {
    Customer.find()
        .select("Name _id Code Address PhoneNumber YearOfBirth")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                customers: docs.map(doc => {
                    return {
                        id: doc._id,
                        Code: doc.Code,
                        Name: doc.Name,
                        PhoneNumber: doc.PhoneNumber,
                        Address: doc.Address,
                        YearOfBirth: doc.YearOfBirth
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

exports.delete_customer = (req, res, next) => {
    const id = req.params.customerID;
    CashBill.countDocuments({
        Customer: id
    }, (err, count) => {
        if (count <= 0) {
            Customer.findByIdAndRemove({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Deteled customer successfully",
                    });
                })
        } else {
            res.status(500).json({
                message: "This customer contains the cash bill"
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.update_customer = (req, res, next) => {
    const id = req.params.customerID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Customer.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Update Customer successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}