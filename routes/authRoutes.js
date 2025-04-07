const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const passport=require("passport");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// initializing passport.js
require("../config/passport");

//Route to initiate google login
router.get("/google",passport.authenticate(
  "google",{scope:["profile","email"]})
);

//Google callback route
router.get("/google/callback", passport.authenticate("google",{session:false}),
(req,res)=>{
const {token,user}=req.user;

res.json({
  message:"Google login successfull",
  token,
  user,
});



});

// 🔹 REGISTER USER (POST /register)
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // ✅ Extract user input from request body
      const { username, email, password } = req.body;

      // ✅ Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      // ✅ Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create and save new user
      user = new User({ username, email, password: hashedPassword });
      await user.save();

      res.json({ msg: "User registered successfully" });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// 🔹 LOGIN USER (POST /login)
router.post(
  "/login",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // ✅ Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // ✅ Extract login credentials
      const { email, password } = req.body;

      // ✅ Find user in database
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      // ✅ Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

      // ✅ Generate JWT token
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

      // ✅ Send token & user data
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// 🔹 PROTECTED ROUTE (GET /me)
router.get("/me", async (req, res) => {
  // ✅ Extract token from request header
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "Authorization required, token is absent" });

  try {
    // ✅ Decode token
    const decoded = jwt.verify(token, SECRET_KEY);

    // ✅ Find user by ID (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
});

module.exports = router;
