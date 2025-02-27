require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const setupSocket = require("./socket");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
setupSocket(server);

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
  
// Import Protected Routes
const protectedRoutes = require("./routes/protectedRoutes");

// Use Protected Routes
app.use("/api", protectedRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
