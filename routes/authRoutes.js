const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Register User
// router.post takes the route path then the middleware which is a validator
//and finally the main handler function
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      //Extract user input from req body
      const { username, password } = req.body;

      //check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      //Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      //create a new user
      user = new User({ username, email, password: hashedPassword });

      //save the user in the database
      await user.save();

      //send a sucess response
      res.json({ msg: "User registerd successfullu" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// login a user

router.post(
  "/login",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // validate input

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: erros.array() });

    // extract login credentials
    try {
      const { email, password } = req.body;

      //find the user in the database

      const user = await User.findOne({ email });

      if (!user)
        return response.status(400).json({ msg: "Invalid credentials" });

      //compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return response.status(400).json({ msg: "Invalid password" });

      // generate a JWT token
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

      //send the token and user data
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch {}
  }
);

// Protected routes example
router.get("/me",async(req,res)=>{

// Extract token from request header which we provided ones the user login as a response earlier

const token=req.header("Authorization");
if (!token) return res.status(401).json({msg:"Authorization required, token is absent"});

try{
    //decode the token
const decoded=jwt.verify(token,SECRET_KEY);
//find user by ID
const user=await User.findById(decoded.id).select("-password");
res.json(user); //send user data

}

catch(err){
    res.status(401).json({msg:"token is not valide"});
}


});

module.exports=router;