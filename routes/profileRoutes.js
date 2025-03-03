const express = require("express");
const Profile = require("../models/Profile"); // Ensure model exists

const router = express.Router();

router.post("/profile", async (req, res) => {
  try {
    const { name, occupation, interests } = req.body;
    if (!name || !occupation || !interests) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const profile = new Profile({ name, occupation, interests });
    await profile.save();

    res.status(201).json({ message: "Profile created successfully!", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profile", async (req, res) => {
    try {
      const profiles = await Profile.find();
      res.status(200).json({ profiles });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Correct export
module.exports = router; 
