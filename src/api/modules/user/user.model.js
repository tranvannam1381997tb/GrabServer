const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema, "users_collection");
