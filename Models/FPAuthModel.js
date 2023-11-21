const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userAuthSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userEmail: { type: String, required: true },
  expiresIn: {
    type: Date,
    default: () => Date.now() + 30 * 60 * 1000,
  },
  trials: {
    type: Number,
    default: 1,
  },
  pin: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("FPAuth", userAuthSchema);
