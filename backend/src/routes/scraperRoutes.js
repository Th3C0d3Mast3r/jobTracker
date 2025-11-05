import express from "express";
import { spawn } from "child_process";

const router = express.Router();

// Helper to run Python scraper
const runPythonScraper = (scriptPath, inputData) => {
  return new Promise((resolve, reject) => {
    const pyProcess = spawn("python", [scriptPath]);

    let result = "";
    pyProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    let error = "";
    pyProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        reject(error || `Python script exited with code ${code}`);
      } else {
        try {
          resolve(JSON.parse(result));
        } catch (err) {
          reject(err);
        }
      }
    });

    // Pass input as JSON
    pyProcess.stdin.write(JSON.stringify(inputData));
    pyProcess.stdin.end();
  });
};

// Google jobs
router.post("/google-jobs", async (req, res) => {
  try {
    const data = await runPythonScraper(
      "scraper/webscraperGoogle.py",
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape Google jobs", details: err.toString() });
  }
});

// Netflix jobs
router.post("/netflix-jobs", async (req, res) => {
  try {
    const data = await runPythonScraper(
      "scraper/webscraperNetflix.py",
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape Netflix jobs", details: err.toString() });
  }
});

// Stripe jobs
router.post("/stripe-jobs", async (req, res) => {
  try {
    const data = await runPythonScraper(
      "scraper/webscraperStripe.py",
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape Stripe jobs", details: err.toString() });
  }
});

// Cloudflare jobs
router.post("/cloudflare-jobs", async (req, res) => {
  try {
    const data = await runPythonScraper(
      "scraper/webscraperCloudflare.py",
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape Cloudflare jobs", details: err.toString() });
  }
});

// DeepMind jobs
router.post("/deepmind-jobs", async (req, res) => {
  try {
    const data = await runPythonScraper(
      "scraper/webscraperDeepMind.py",
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape DeepMind jobs", details: err.toString() });
  }
});

export default router;
