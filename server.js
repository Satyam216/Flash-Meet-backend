require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app); // Create HTTP Server
setupSocket(server); // Initialize WebSocket Handling

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in .env file!");
  process.exit(1); // Stop execution
}
const mongoURI = process.env.MONGO_URI;
// MongoDB Connection
mongoose
  .connect(mongoURI, 
    { useNewUrlParser: true, 
      useUnifiedTopology: true,
    })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Stop execution if DB fails
  });

// Create a Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// POST Request - Add User
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and Email are required!" });

    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ status: "success", message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET Request - Fetch Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Import and Use Protected Routes
const protectedRoutes = require("./routes/protectedRoutes");
app.use("/api", protectedRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
