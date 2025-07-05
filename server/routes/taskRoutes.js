const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("USER:", req.user);
    const task = await Task.create({ ...req.body, owner: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const userId = req.user.id;

    if (task.owner.toString() === userId) {
      // Owner can update everything
      task.title = req.body.title ?? task.title;
      task.priority = req.body.priority ?? task.priority;
      task.dueDate = req.body.dueDate ?? task.dueDate;
      task.status = req.body.status ?? task.status;
    } else if (task.sharedWith.map(id => id.toString()).includes(userId)) {
      // Shared user can ONLY update status
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res.status(403).json({ error: "Shared users can only update status." });
      }
    } else {
      return res.status(403).json({ error: "Not authorized to update this task." });
    }

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete Task
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔄 Share a task with another user
router.put("/share/:id", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });

    if (!task) return res.status(404).json({ error: "Task not found" });

    const User = require("../models/User");
    const userToShare = await User.findOne({ email });

    if (!userToShare) return res.status(404).json({ error: "User not found" });

    if (!task.sharedWith.includes(userToShare._id)) {
      task.sharedWith.push(userToShare._id);
      await task.save();
    }

    res.json({ message: "Task shared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
