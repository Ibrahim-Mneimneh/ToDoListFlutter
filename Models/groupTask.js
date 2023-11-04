const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupTask = new Schema(
  {
    participantsId: {
      type: String,
    },
    participantsUsername: {
      type: String,
    },
    task: [{ type: Schema.Types.ObjectId, ref: "tasks" }],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("groupTasks", groupTask);
