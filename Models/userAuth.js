const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userAuthSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", requred: true },
  userEmail: {
    type: String,
    requied: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("userAuth", userAuthSchema);
