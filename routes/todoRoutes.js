const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const authenticate=require("../middleware/authMiddleware")

//Get all todos only for logged in-user
router.get("/", authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({userId:req.user.id});
        res.json(todos);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

// Add a new todo

router.post("/", authenticate, async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const newTodo = new Todo({ ...req.body, userId: req.user.id });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("Error saving todo:", err);
        res.status(400).json({ error: err.message });
    }
});


//Update a todo

router.put("/:id",authenticate, async (req, res) => {
  try {
        const updatedTodo = await Todo.findOneAndUpdate({_id:req.params.id,userId:req.user.id},req.body, { new: true });
        if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
        res.json(updatedTodo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

//Delete a todo 

router.delete("/:id",authenticate, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({_id:req.params.id,userId:req.user.id});
        if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
        res.json({ message: "Deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

module.exports = router;
