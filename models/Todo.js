const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", require:true},
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Todo", TodoSchema);

