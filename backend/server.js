// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import scraperRoutes from "./src/routes/scraperRoutes.js";

dotenv.config();

const app = express();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};
connectDB();

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());

// CORS setup: allow frontend requests
app.use(
  cors({
    origin: "http://localhost:3000", // Next.js frontend
    credentials: true, // allows cookies
  })
);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// --- Default Route ---
app.get("/", (req, res) => {
  res.send("🚀 Job Tracker Backend is Running Smoothly!");
});

app.use("/api", scraperRoutes);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => console.log(`🌍 Server live on port ${PORT}`));
