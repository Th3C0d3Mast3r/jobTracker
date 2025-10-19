// routes/authRoutes.js
import express from "express";
import { signup, login, logout, getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

// All API routes (no EJS rendering)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getCurrentUser", getCurrentUser);

export default router;
