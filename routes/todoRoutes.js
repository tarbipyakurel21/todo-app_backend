const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

//Get all todos

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

// Add a new todo

router.post("/", async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(201).json(newTodo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

//Update a todo

router.put("/:id", async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
        res.json(updatedTodo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

//Delete a todo

router.delete("/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
        res.json({ message: "Deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

module.exports = router;
