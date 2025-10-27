import mongoose from "mongoose";

const jobsSchema=new mongoose.Schema({
    companyName:{type:String,required:true,},
    jobDescription:{ type:String},
    jobTitle:{type:String, required:true},
    jobID:{type:String, required:true, unique:true},
    jobStatus:{type:String, required:true, default:"APPLIED", enum:["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]},
    // source:{type:String},
    location:{type:String},
    salary:{type: String},
},{timestamps:true});

export const Jobs=mongoose.model("Jobs", jobsSchema);