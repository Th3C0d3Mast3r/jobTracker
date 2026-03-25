# Job Tracker Web App

A simple yet powerful web application to **track and manage your job applications**. Stay organized by logging applications, monitoring their status, and even collecting information from job postings automatically using web scraping.

---

## Features

- **Add & Manage Applications**  
  Easily add new job applications, edit existing ones, and remove outdated entries. Track details like company name, position, job ID, location, salary, status, and description.

- **Status Tracking & Dashboard**  
  Visualize your applications with intuitive status cards: Applied, Interviewing, Offered, and Rejected. Filter by status or search by company, position, or location.

- **Web Scraping Support** *(Upcoming Versions)*  
  Automatically fetch job information from online job boards and pre-fill application details to save time and ensure accuracy.

- **Responsive Design**  
  Fully responsive interface designed with Tailwind CSS for desktop and mobile users.

- **Secure Authentication**  
  Login and manage your personal job application data securely with JWT-based authentication.

---

## Version History

| Version | Date       | Description                                                                 |
|---------|------------|-----------------------------------------------------------------------------|
| 1.0.0   | 19-10-2025 | Basic CRUD Frontend and Backend Working - Auth not done(auth securing in progress) |
| 1.0.1   | 27-10-2025 | Auth Enabled and proper working |
| 1.0.2   | 27-10-2025 | Proper Web-Scraping Features for Good Companies |
| 1.0.3   | 05-11-2025 | Gmail Sync Direct Job Fetch *(all the jobs on Gmail, are fetched here)* by OAuth of Google *(works for test users for now-during deployment, will shift to proper OAuth)* |
| 1.0.4   | TBA        | Minimal Changes to make more SECURE and almost DEPLOYMENT READY (might add OTP based for Local running) |
| 2.0.0   | TBA        | Web Version of Direct USE |

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, Next.js  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose  
- **Authentication**: JWT  
- **Icons & UI Components**: Heroicons, shadcn/ui  

---

## Getting Started

1. Clone the repository:  
   ```bash
   git clone <repo-url>
   ```

```
# have this as the .env for the backend directory
PORT=6500
MONGO_URI=mongodb://localhost:27017/jobDatabase
JWT_SECRET="0fcae05d1da7a6584cd3cf2dc64e604281a35c2d773962c18680243f06fcfb0f"
# the above JWT secret was generated using the command on powershell:- $node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"



GOOGLE_CLIENT_ID=<put your google studio's client ID here>
GOOGLE_CLIENT_SECRET=<ur client secret>
GOOGLE_REDIRECT_URI=http://localhost:6500/api/mail/callback
ENCRYPTION_KEY=sqt02NT5Unj0KKFqB54hpt+76PsTmBiQjoYxcfCNV9I=

# note, the encryption key was made using the command on powershell:- $openssl rand -base64 32
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in .env (MongoDB URI, JWT secret, etc.)

4. Run the backend:
```bash
npx nodemon server.js
```

5. Start the frontend (Next.js):
```bash
npm run dev
```

6. Open `http://localhost:3000` in your browser.

## CONTRIBUTING
Well, if you feel like contributing to this repo- its open-sourced. Make the changes, and upload them here- I will review and mention the contributors!
