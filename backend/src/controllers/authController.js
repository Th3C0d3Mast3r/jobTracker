// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {User} from "../models/user.model.js";

dotenv.config();

const tokenForUser = (user) =>
  jwt.sign(
    { id: user._id, mailId: user.mailId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ------------------- API CONTROLLERS -------------------

// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, mailId, password } = req.body;
    if (!name || !mailId || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existing = await User.findOne({ mailId });
    if (existing)
      return res.status(409).json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, mailId, password: hashed });
    await newUser.save();

    const token = tokenForUser(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: { id: newUser._id, name: newUser.name, mailId: newUser.mailId },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { mailId, password } = req.body;
    if (!mailId || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const user = await User.findOne({ mailId });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = tokenForUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, mailId: user.mailId },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/auth/logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/auth/getCurrentUser
export const getCurrentUser = async (req, res) => {
  try {
    // Prefer cookie token (set on login/signup). Fall back to Authorization header.
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verify error:", err);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Keep response shape consistent with login/signup (returns user.id)
    return res.json({ success: true, user: { id: user._id, name: user.name, mailId: user.mailId } });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
