const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route to get a specific user by auth0Id
router.get("/:auth0Id", async (req, res) => {
  try {
    const auth0Id = decodeURIComponent(req.params.auth0Id);
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error in fetching user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route to create/update user during authentication
router.post("/auth", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { auth0Id, name, email, picture, given_name } = req.body;

    if (!auth0Id || !email || !picture) {
      console.error("Validation Error: Missing user data");
      return res.status(400).json({ error: "Missing user data" });
    }

    // Determine the correct name field (for Google vs. Email/Password logins)
    const userName = given_name || name || email.split("@")[0];

    let user = await User.findOne({ auth0Id });

    if (!user) {
      // Check if an account with the same email exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error("User with this email already exists:", email);
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      // Create a new user
      user = new User({ auth0Id, name: userName, email, picture });
      await user.save();
      console.log("✅ New user saved:", user);
    } else {
      console.log("✅ User already exists:", user);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error in /auth route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
