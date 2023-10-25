const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TaskScehama = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    priority: {
      type: Number,
      required: true,
    },
    estimatedDate: {
      type: timestamps,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", TaskScehama);
