const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userAuthSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
  },
});
