import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type: String, 
        required:true, 
    },
    mailId:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    jobsAppliedTo:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Jobs",
    }]
}, {timestamps:true});
export const User=mongoose.model("User", userSchema);