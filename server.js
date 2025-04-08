require("dotenv").config();
require ("./config/passport");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport=require("passport");
const session = require("express-session");

const app = express();
app.use(express.json());

// Adding session middleware
//required by passport even when not using session

app.use(session({secret:"secret",resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: "https://todo-app-frontend-s3ik.vercel.app", // Allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
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
