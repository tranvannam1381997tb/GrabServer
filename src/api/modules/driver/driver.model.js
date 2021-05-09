const mongoose = require("mongoose");

const DriverSchema = mongoose.Schema({
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
  licensePlateNumber: {
    type: String,
    required: true,
  },
  typeVehicle: {
    type: String,
    required: true,
  },
  typeDriver: {
    type: Number,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Driver", DriverSchema, "drivers_collection");
