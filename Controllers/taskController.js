const Task = require("../Models/taskModel");

const User = require("../Models/userModel");

//get user Tasks (Without order)
const getTasks = async (req, res) => {
  const userId = req.userId;
  const tasks = await Task.findById({ userId });
  if (!tasks) {
    return res.status(404).json({ error: "User has no posts." });
  }
  res.status(200).json(tasks);
};

//get a single Task

const createTask = async (req, res) => {
  const userId = req.userId;
  const { title, description, status, color, priority } = req.body;
  if (!title && !description && !status && !priority) {
    res.status(400).json({ error: "Please add some task credentials." });
  }
  if (!title) {
    title = "New Task";
  }
  if (!description) {
    description = "Task Description";
  }
  if (!status) {
    status: "Up coming";
  }
  if (!color) {
    color: red;
  }
  if (!priority) {
    priority: 0;
  }
  try {
    const task = await Task.create({
      title,
      description,
      status,
      color,
      priority,
      userId,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).sjon({ error: error.message });
  }
};
//delete task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById({ _id: id });

  if (!task) {
    res.status(400).json({ error: "No such task." });
  }
  res.status(200).json(task);
};

// update a task
const updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById({ _id: id });

  if (!task) {
    res.status(400).json({ error: "No such task" });
  }
  const updatedTask = await Task.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!updatedTask) {
    return res.status(400).json({ error: "No such task." });
  }
  res.staus(200).json({ task: updateTask });
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};
