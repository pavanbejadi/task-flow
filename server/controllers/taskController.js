const Task = require("../models/Task");

// GET all tasks for logged in user
const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET dashboard stats
const getStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const pending = await Task.countDocuments({
      user: req.user._id,
      status: "pending",
    });
    const completed = await Task.countDocuments({
      user: req.user._id,
      status: "completed",
    });
    const high = await Task.countDocuments({
      user: req.user._id,
      priority: "high",
    });

    res.json({ total, pending, completed, high });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getStats, createTask, updateTask, deleteTask };
