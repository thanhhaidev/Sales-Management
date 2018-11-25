const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config()

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    User.findById(req.userData.userId)
      .select("isAdmin")
      .exec()
      .then(doc => {
        if (doc.isAdmin) {
          next();
        } else {
          res.status(401).json({
            message: "Permission denied."
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};