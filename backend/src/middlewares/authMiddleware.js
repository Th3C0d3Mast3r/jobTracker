import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Middleware to verify token
export const verifyToken = async (req,res,next)=>{
  try{
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({error:"No token provided, access denied"});
    }

    const decoded=jwt.verify(token, process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id).select("-password");
    next();
  }catch(err){
    console.error("[AUTH ERROR] Invalid or expired token:",err.message);
    return res.status(401).json({error:"Invalid or expired token"});
  }
};
