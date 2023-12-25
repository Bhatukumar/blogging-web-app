const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const dbconnection = require("../db");

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    await dbconnection(); // Assuming this function connects to your database
    const body = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create a new user
    const newUser = new User({
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/login',async(req,res) => {
  try{
    const user = await User.findOne({username: req.body.username});
    if(user){
      res.status(400).json({message:"User already Exist"});
      return;
    }
  }
  catch(err){
    console.log(err);
  }
})

// Other authentication-related routes can be added here

module.exports = router;
