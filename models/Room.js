const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, unique: true, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store user IDs
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);
