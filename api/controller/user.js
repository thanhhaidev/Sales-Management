const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({
      username: req.body.username
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          code: "user-exists",
          message: "This user already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              avatar: req.file.path,
              fullname: req.body.fullname
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created successfully",
                  _id: result._id,
                  username: result.username,
                  isAdmin: result.isAdmin,
                  fullname: result.fullname,
                  avatar: "http://localhost:3000/" + result.avatar
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({
      username: req.body.username
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Username not found, user doesn't exist"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign({
              username: user[0].username,
              userId: user[0]._id
            },
            process.env.JWT_KEY, {
              expiresIn: "1h"
            }
          );
          console.log(result);
          return res.status(200).json({
            message: "Auth successful",
            username: user[0].username,
            userId: user[0]._id,
            fullname: user[0].fullname,
            avatar: "http://localhost:3000/" + user[0].avatar,
            token: token,

          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.get_info_user = (req, res, next) => {
  const id = req.params.userId;
  if (id === req.userData.userId) {
    User.findById(id)
      .select("_id username isAdmin avatar fullname")
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            user: doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/user/info/" + doc._id
            }
          });
        } else {
          res.status(404).json({
            code: "no-user",
            message: "No such user exists"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } else {
    return res.status(401).json({
      message: "Auth failed"
    })
  }

};

exports.get_all_user = (req, res, next) => {
  User.find()
    .select("_id username isAdmin avatar")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            username: doc.username,
            isAdmin: doc.isAdmin,
            fullname: doc.fullname,
            avatar: "http://localhost:3000/" + doc.avatar,
            request: {
              type: "GET",
              url: "http://localhost:3000/user/info/" + doc._id
            }
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

exports.user_delete = (req, res, next) => {
  const id = req.params.userId;
  User.findById(req.userData.userId)
    .exec()
    .then(user => {
      if (user.isAdmin) {
        User.findById(id)
          .exec()
          .then(user => {
            if (user.isAdmin === false) {
              User.findByIdAndRemove({
                  _id: id
                })
                .exec()
                .then(result => {
                  res.status(200).json({
                    message: "Deteled user successfully",
                    request: {
                      type: "POST",
                      url: "http://localhost:3000/user",
                      body: {
                        id: result._id,
                        username: result.username,
                        isAdmin: result.isAdmin,
                        fullname: result.fullname,
                        avatar: "http://localhost:3000/" + result.avatar
                      }
                    }
                  });
                });
            } else {
              res.status(401).json({
                message: "Permission denied."
              });
            }
          });
      } else {
        return res.status(401).json({
          message: "Permission denied."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.update_info_user = (req, res, next) => {
  const id = req.params.userId;
  if (id === req.userData.userId) {
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    User.findByIdAndUpdate({
        _id: id
      }, {
        $set: updateOps
      })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Update Category successfully",
          info: {
            username: result.username,
            isAdmin: result.isAdmin,
            fullname: result.fullname,
            avatar: "http://localhost:3000/" + result.avatar,
            request: {
              type: "GET",
              url: "http://localhost:3000/user/info/" + result._id
            }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } else {
    res.status(401).json({
      message: "Auth failed"
    })
  }

};