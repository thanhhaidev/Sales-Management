const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    match: /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
    unique: true
  },
  password: {
    type: String,
    required: true
    //match: /"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"/
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
  avatar: {
    type: String
  },
  fullname: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);