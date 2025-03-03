const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  interests: { type: [String], default: [] }, // Array of interests
});

module.exports = mongoose.model("Profile", profileSchema);
