const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userAuthSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
    default: () => Date.now() + 30 * 60 * 1000,
  },
  trials: {
    type: Number,
    default: 1,
    max: 3,
  },
  pin: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("UserAuth", userAuthSchema);