const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config(); //  Load .env first

const app = express();

//  Middlewares
app.use(cors({ origin: "http://localhost:3000" })); // Only allow your React frontend
app.use(express.json());
app.use(passport.initialize());

//  Passport setup
require("./auth/google");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//  Default test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  DB and Server connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

