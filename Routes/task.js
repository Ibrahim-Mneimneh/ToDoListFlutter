const express = require("express");
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../Controllers/taskController");
const verifyUser = require("../Middleware/UserAuth");
const router = express.Router();
//midddleware to Authenticate users
router.use(verifyUser);

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);

module.exports = router;
