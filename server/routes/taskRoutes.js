const express = require("express");
const router = express.Router();
const {
  getTasks,
  getStats,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middleware/protect");

router.get("/", protect, getTasks);
router.get("/stats", protect, getStats);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
