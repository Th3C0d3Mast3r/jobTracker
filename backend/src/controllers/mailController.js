// controllers/mailController.js
import { google } from "googleapis";
import {User} from "../models/user.model.js";
import { encryptObject, decryptObject } from "../utils/crypto.js";
import { runGmailSync } from "../services/gmailSync.js";

const oauth2ClientFactory = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

export const getAuthUrl = (req, res) => {
  const oauth2Client = oauth2ClientFactory();
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid"
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: req.user?._id.toString(),
  });
  return res.json({ url });
};

export const handleOAuthCallback=async(req,res)=>{
  try{
    const { code,state }=req.query; // ✅ state = userId
    if(!code)return res.status(400).send("Missing code");

    // console.log("🔹 Received code:",code," State(userId):",state);

    const oauth2Client=oauth2ClientFactory();
    const { tokens }=await oauth2Client.getToken(code);
    // console.log("✅ Tokens received:",tokens);

    oauth2Client.setCredentials(tokens);

    const gmail=google.gmail({version:"v1",auth:oauth2Client});
    const profile=await gmail.users.getProfile({userId:"me"});
    // console.log("📧 Gmail Profile:",profile.data);

    const email=profile?.data?.emailAddress;
    if(!email)throw new Error("Failed to fetch user email");

    const userId=state; // ✅ restored from state
    const encrypted=encryptObject(tokens);

    const updatedUser=await User.findByIdAndUpdate(
      userId,
      { googleTokenEncrypted:encrypted, googleAuthMail:email, mailLastSync:new Date() },
      { new:true }
    );

    if(!updatedUser){
      console.error("⚠️ User not found for ID:",userId);
      return res.status(404).send("User not found");
    }

    // console.log("✅ Gmail connected successfully for:",updatedUser.mailId);

    return res.redirect("http://localhost:3000/dashboard?gmail=connected");
  }catch(err){
    console.error("❌ OAuth callback error details:",err);
    return res.status(500).send("OAuth callback failed: "+err.message);
  }
};


export const manualSync = async (req, res) => {
  try {
    await runGmailSync();
    return res.json({ message: "✅ Gmail sync completed successfully" });
  } catch (error) {
    console.error("❌ Manual sync error:", error);
    return res.status(500).json({ error: error.message });
  }
};
