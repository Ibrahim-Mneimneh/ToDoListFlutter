const Task = require("../Models/taskModel");

const User = require("../Models/userModel");

//get user Tasks (Without order)
const getTasks = async (req, res) => {
  const userId = req.userId;
  try {
    let tasks = await Task.find({ userId });
    if (!tasks) {
      return res.status(404).json({ error: "User has no posts." });
    }
    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }
    let safeTasks = tasks.map((task) => {
      let { userId, ...safeTasks } = task._doc;
      return safeTasks;
    });
    res.status(200).json(safeTasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//create a Task

const createTask = async (req, res) => {
  const userId0 = req.userId;
  let { title, description, status, color, priority, estimatedDate } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "Please add some task credentials." });
  }
  if (!title) {
    title = "New Task";
  }
  if (!description) {
    description = "Task Description";
  }
  if (!status) {
    status = "Unfinished";
  }
  if (!color) {
    color = "ff24a09b";
  }
  if (!priority) {
    priority = "Low";
  }
  if (!estimatedDate) {
    estimatedDate = new Date();
  }
  try {
    const task = await Task.create({
      title,
      description,
      status,
      color,
      priority,
      userId: userId0,
      estimatedDate,
    });
    let { userId, ...safeTask } = task._doc;
    res.status(200).json(safeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById({ _id: id });
    if (!task) {
      return res.status(400).json({ error: "No such task." });
    }
    if (task.userId != req.userId) {
      res.status(400).json({ error: "No such task." });
    }
    await Task.deleteOne({ _id: id });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const userIdentity = req.userId;

  const task = await Task.findById({ _id: id });

  if (task.userId != userIdentity) {
    return res.status(400).json({ error: "UnAuthorized Access!" });
  }

  if (!task) {
    return res.status(400).json({ error: "No such task" });
  }

  const oldTask = await Task.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!oldTask) {
    res.status(400).json({ error: "No such task." });
  }
  const { userId, ...safeOldTask } = oldTask._doc;
  res.status(200).json(safeOldTask);
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};
