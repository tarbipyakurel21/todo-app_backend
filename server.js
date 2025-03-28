require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());


app.use(cors({
  origin: "https://todo-app-frontend-wwv4.vercel.app", // Allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.get("/", (req, res) => {
  res.redirect("/todos");
});

//connect routes in server
const authRoutes=require("./routes/authRoutes");
app.use("/auth",authRoutes); //Auth routes

// todo routes
const todoRoutes = require("./routes/todoRoutes");
app.use("/todos", todoRoutes);



//connect with database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected bro"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
