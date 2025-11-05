import { google } from "googleapis";
import { User } from "../models/user.model.js";
import { decryptObject } from "../utils/crypto.js";
import { Jobs } from "../models/jobs.model.js";
import colors from "../../ansiColoring.js";

const oauth2ClientFactory = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

// Fetch messages with search query
async function listMessages(gmail, q) {
  const res = await gmail.users.messages.list({ userId: "me", q, maxResults: 50 });
  return res.data.messages || [];
}

// Extract body text from Gmail message
async function getMessageBody(gmail, messageId) {
  const res = await gmail.users.messages.get({ userId: "me", id: messageId, format: "full" });

  const getTextFromPayload = (payload) => {
    if (!payload) return "";
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, "base64").toString("utf-8");
    }
    if (payload.parts) {
      return payload.parts.map(getTextFromPayload).join("\n");
    }
    return "";
  };

  return getTextFromPayload(res.data.payload) || res.data.snippet || "";
}

// Detect job-related status
function detectJobStatusFromText(text) {
  text = (text || "").toLowerCase();

  if (/congratulations|offer letter|we are pleased to offer|selected for|you have been selected|we’d like to offer|welcome aboard|joining details/.test(text))
    return "OFFERED";
  if (/unfortunately|we regret to inform|not moving forward|declined|rejected|not selected|we’ve chosen other candidates|did not progress|position has been filled/.test(text))
    return "REJECTED";
  if (/thank you for applying|application received|your application|we have received your application|you have successfully applied|application submitted|applied for/.test(text))
    return "APPLIED";
  if (/interview|schedule an interview|interview invitation|invite you to interview/.test(text))
    return "INTERVIEW";
  return null;
}

// Match job by details
function matchJobForEmail(userJobs, text, subject) {
  const combined = (subject + " " + text).toLowerCase();
  for (const j of userJobs) {
    if (j.jobID && combined.includes(j.jobID.toLowerCase())) return j;
    if (j.company && combined.includes(j.company.toLowerCase())) return j;
    if (j.position && combined.includes(j.position.toLowerCase())) return j;
  }
  return null;
}

// Extract company & position
function extractJobDetails(subject, body) {
  const text = (subject + " " + body).toLowerCase();

  let company = "Unknown Company";
  let position = "Unknown Position";

  // --- Company Extraction ---
  const companyPatterns = [
    /\bat\s+([A-Z][a-zA-Z0-9.&\s]+)/i,             // “at TechNova”
    /\bfrom\s+([A-Z][a-zA-Z0-9.&\s]+)/i,           // “from Google”
    /\bby\s+([A-Z][a-zA-Z0-9.&\s]+)/i,             // “by Meta Careers”
    /the ([A-Z][a-zA-Z0-9.&\s]+) team/i,           // “the Amazon team”
  ];

  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match) {
      company = match[1].trim();
      break;
    }
  }

  // --- Position Extraction ---
  const positionPatterns = [
    /\bfor (?:the )?position of ([a-zA-Z\s]+)/i,    // “for the position of Software Engineer”
    /\bapplying for ([a-zA-Z\s]+)/i,                // “applying for Backend Developer”
    /\bapplication for ([a-zA-Z\s]+)/i,             // “application for Data Analyst”
    /\bas ([a-zA-Z\s]+)/i,                          // “as Software Intern”
    /\brole of ([a-zA-Z\s]+)/i,                     // “role of Product Manager”
  ];

  for (const pattern of positionPatterns) {
    const match = text.match(pattern);
    if (match) {
      position = match[1].trim();
      break;
    }
  }

  // Small cleanup for trailing words
  company = company.replace(/(careers|team)$/i, "").trim();
  position = position.replace(/(at|in|with)$/i, "").trim();

  return { company, position };
}

// MAIN SYNC LOGIC
export const runGmailSync = async () => {
  console.log(colors.highlighted_green("Running Gmail Sync..."));
  const users = await User.find(
    { googleTokenEncrypted: { $exists: true } },
    { googleTokenEncrypted: 1, mailId: 1, googleAuthMail: 1, jobsAppliedTo: 1 }
  ).lean();

  for (const user of users) {
    try {
      const tokenObj = decryptObject(user.googleTokenEncrypted);
      if (!tokenObj) continue;

      const oauth2Client = oauth2ClientFactory();
      oauth2Client.setCredentials(tokenObj);
      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      console.log(colors.highlighted_green(`Syncing Gmail for: ${user.googleAuthMail}`));

      const sinceDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15); // last 15 days
      const q = `newer_than:30d in:anywhere (
        "job application" OR "your application" OR "applied for" OR
        "thank you for applying" OR "we have received your application" OR
        "interview" OR "interview invitation" OR "we regret" OR
        "congratulations" OR "offer letter" OR "not selected" OR
        "rejected" OR "moving forward"
      )`;

      const messages = await listMessages(gmail, q);
      if (!messages.length) {
        console.log("No job-related mails found.");
        continue;
      }

      const userJobs = await Jobs.find({ _id: { $in: user.jobsAppliedTo || [] } }).lean();

      for (const m of messages) {
        const msg = await gmail.users.messages.get({ userId: "me", id: m.id, format: "full" });
        const headers = msg.data.payload?.headers || [];
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const body = await getMessageBody(gmail, m.id);

        const status = detectJobStatusFromText(subject + "\n" + body);
        if (!status) continue;

        const matched = matchJobForEmail(userJobs, body, subject);

        if (matched) {
          // Update existing job
          await Jobs.findByIdAndUpdate(matched._id, { jobStatus: status }, { new: true });
          console.log(colors.highlighted_green(`Updated job: ${matched.company} → ${status}`));
        } else {
          // Create new job
          const { company, position } = extractJobDetails(subject, body);

          // Create a unique jobID
          const jobID = `${company.replace(/\s+/g,"_")}_${Date.now()}`;

          const jobData = {
            companyName: company || "Unknown Company",
            jobTitle: position || "Unknown Position",
            jobID: jobID,
            jobStatus: status,
            jobDescription: `Detected from Gmail: "${subject}"`,
            location: "Unknown",
            salary: "N/A"
          };

          console.log("Job to be saved:", jobData);

          const newJob = await Jobs.create(jobData);
          await User.findByIdAndUpdate(user._id, { $push: { jobsAppliedTo: newJob._id } });
          console.log(`New job added: ${company} - ${position} (${status})`);
        }
      }

      // Update last sync time
      await User.findByIdAndUpdate(user._id, { mailLastSync: new Date() });
      console.log(`[COMPLETED] Gmail sync for ${user.email}`);
    } catch (err) {
      console.error(`[GMAIL SYNC] user ${user.email} error:`, err?.message || err);
    }
  }

  console.log(colors.highlighted_green("[FINISHED] Gmail sync"));
};
export { oauth2ClientFactory };