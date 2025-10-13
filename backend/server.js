import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import {connectDB} from './src/db/database.js'
import colors from './ansiColoring.js'
import dotenv from 'dotenv'
// import authRoutes from './src/routes/authRoutes.js'
// import jobRoutes from './src/routes/jobRoutes.js'

dotenv.config();
const app=express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// middlewares
app.use(express.json());
app.use(cors());

connectDB();   // this is where the database is connected

const PORT=process.env.PORT || 6500;

app.get("/",(req,res)=>{
    console.log(colors.green("[RUNNING] Base Route Running"));
    res.send("HELLO!");
});

app.get("/trial",(req,res)=>{
    console.log('working trial!');
});

app.get("/dashboard", (req,res)=>{
    res.render("dashboard", {title:"Dashboard"});
});

app.get("/jobs", (req,res)=>{
    res.render("jobs", {title:"Jobs Overview"});
});

app.listen(PORT,()=>{
    console.log(colors.green("[RUNNING]"), `Server running on port ${PORT}`);
});