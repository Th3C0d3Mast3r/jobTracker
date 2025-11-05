// routes/mailRoutes.js
import express from "express";
import { getAuthUrl, handleOAuthCallback } from "../controllers/mailController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // if you want auth
import { manualSync } from "../controllers/mailController.js";
import { oauth2ClientFactory, runGmailSync } from "../services/gmailSync.js";

const router = express.Router();
router.get("/auth-url", verifyToken, getAuthUrl); // require login
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // Create a fresh OAuth2 client
    const oauth2Client = oauth2ClientFactory();

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log("✅ Tokens received and set");

    // Save tokens in DB or user model
    // await saveTokensToDB(tokens);

    // Immediately trigger Gmail Sync after OAuth
    console.log("🔁 Running Gmail Sync after OAuth...");
    await runGmailSync();
    console.log("✅ Gmail Sync completed successfully.");

    // Redirect to frontend
    res.redirect("http://localhost:3000/dashboard");
  } catch (err) {
    console.error("❌ OAuth Callback Error:", err);
    res.status(500).send("OAuth failed");
  }
});



router.get("/sync-now", verifyToken, manualSync);

export default router;
