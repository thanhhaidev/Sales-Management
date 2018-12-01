const mongoose = require("mongoose");
const Customer = require("../models/customer");
const CashBill = require("../models/cashbill");
const Product = require("../models/product");

exports.cashbill_create = (req, res, next) => {
  const CustomerID = req.body.CustomerID;

  checkQuantity(req.body.ArrayProductID, (valid, invalid) => {
    Customer.findById({
      _id: CustomerID
    })
      .exec()
      .then(result => {
        CashBill.countDocuments(
          {
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
            let codeCashBill =
              "C" +
              currentYear.substr(2, 4) +
              currentMonth +
              pad.substring(0, pad.length - str.length) +
              str;

            const cashbill = new CashBill({
              _id: new mongoose.Types.ObjectId(),
              Code: codeCashBill,
              Customer: req.body.CustomerID,
              Products: valid,
              Shipper: req.body.Shipper,
              Note: req.body.Note,
              GrandTotal: req.body.GrandTotal
            });
            cashbill.save().then(result => {
              res.status(201).json({
                message: "Created Cash Bill successfully",
                cashbill: {
                  id: result._id,
                  Code: result.Code,
                  Customer: result.CustomerID,
                  Product: result.Product,
                  Shipper: result.Shipper,
                  Note: result.Note,
                  GrandTotal: result.GrandTotal,
                  ProductInvalid: invalid
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

exports.get_all_cashbill = (req, res, next) => {
  CashBill.find()
    .select("Code _id Customer Product Shipper Note GrandTotal")
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
            GrandTotal: doc.GrandTotal
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

exports.delete_cashbill = (req, res, next) => {
  const id = req.params.cashbillID;
  CashBill.findByIdAndRemove({
    _id: id
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Deteled cash bill successfully",
        request: {
          type: "POST",
          body: {
            id: result._id,
            Code: result.Code,
            Customer: result.Customer,
            Products: result.Product,
            Shipper: result.Shipper,
            Note: result.Note,
            GrandTotal: result.GrandTotal
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.update_cashbill = (req, res, next) => {
  const id = req.params.cashbillID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  CashBill.findByIdAndUpdate(
    {
      _id: id
    },
    {
      $set: updateOps
    }
  )
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
