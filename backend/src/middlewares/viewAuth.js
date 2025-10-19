import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

export const attachUserToViews = async (req,res,next)=>{
  const token = req.cookies?.token;
  if(!token){
    res.locals.user = null;
    return next();
  }

  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("jobsAppliedTo");
    if(!user){
      res.locals.user = null;
    }else{
      // expose minimal safe info to views
      res.locals.user = {
        id:user._id,
        name:user.name,
        mailId:user.mailId,
        totalJobs:user.jobsAppliedTo?.length||0
      };
    }
    return next();
  }catch(err){
    res.locals.user = null;
    return next();
  }
};
