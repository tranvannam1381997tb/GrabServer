const mongoose = require("mongoose");

const PolicySchema = mongoose.Schema({
  policy: {
    type: JSON,
    required: true,
  },
  timeFrame: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Policy", PolicySchema, "policy_collection");
