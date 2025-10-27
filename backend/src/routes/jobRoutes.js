import express from "express";
import cors from "cors";
import { Jobs } from "../models/jobs.model.js";
import { User } from "../models/user.model.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Enable CORS for frontend (Next.js at port 3000)
router.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ GET: Fetch all jobs for logged-in user
router.get("/getUserJobs", verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ error: "User ID missing in token" });

    // populate user.jobsAppliedTo
    const user = await User.findById(userId).populate("jobsAppliedTo");
    if (!user) return res.status(404).json({ error: "User not found" });

    const jobs = user.jobsAppliedTo.map((job) => ({
      id: job._id,
      company: job.companyName,
      position: job.jobTitle,
      location: job.location,
      salary: job.salary,
      status: job.jobStatus?.toLowerCase()?.replace(" ", "-"),
      appliedDate: job.createdAt?.toISOString()?.split("T")[0],
      lastUpdate: job.updatedAt?.toISOString()?.split("T")[0],
      description: job.jobDescription,
    }));

    res.status(200).json(jobs);
  } catch (err) {
    console.error("[ERROR] Fetching user jobs failed:", err);
    res.status(500).json({ error: "Server Error while fetching user jobs" });
  }
});

// ✅ POST: Add a new job
router.post("/addJob", verifyToken, async(req,res)=>{ 
  try{
    const { companyName, jobDescription, jobTitle, jobID, jobStatus, location, salary } = req.body;
    const userId = req.user?._id;

    if(!companyName||!jobTitle){
      return res.status(400).json({ error:"companyName and jobTitle are required" });
    }

    const newJob = new Jobs({
      companyName,
      jobDescription,
      jobTitle,
      jobID,
      jobStatus,
      location,
      salary,
    });

    const savedJob = await newJob.save();

    if(userId){
      await User.findByIdAndUpdate(userId, { $push: { jobsAppliedTo: savedJob._id } });
    }

    res.status(201).json({ message:"Job added successfully", job: savedJob });
  }catch(err){
    console.error("[ERROR] Adding job failed:",err);
    res.status(500).json({ error:err });
  }
});


// ✅ PUT: Update an existing job by ID
router.put("/updateJob/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, jobDescription, jobTitle, jobID, jobStatus, source, location, salary } = req.body;

    const updatedJob = await Jobs.findByIdAndUpdate(
      id,
      { companyName, jobDescription, jobTitle, jobID, jobStatus, location, salary },
      { new: true }
    );

    if (!updatedJob) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error("[ERROR] Updating job failed:", err);
    res.status(500).json({ error: "Server Error while updating job" });
  }
});

// ✅ DELETE: Remove job by ID
router.delete("/deleteJob/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Delete job from Jobs collection
    const deletedJob = await Jobs.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });

    // Remove job reference from user's jobsAppliedTo
    if (userId) {
      await User.findByIdAndUpdate(userId, { $pull: { jobsAppliedTo: id } });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("[ERROR] Deleting job failed:", err);
    res.status(500).json({ error: "Server Error while deleting job" });
  }
});


export default router;
