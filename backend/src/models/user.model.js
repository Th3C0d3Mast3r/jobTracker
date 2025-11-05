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
    googleTokenEncrypted: {
        type: Object,
        select: false
    },
    mailLastSync: { type: Date },
    googleAuthMail: {
        type: String,
    },
    jobsAppliedTo:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Jobs",
    }]
}, {timestamps:true});
export const User=mongoose.model("User", userSchema);