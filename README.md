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
| 1.0.3   | TBA | Connecting the Job Communities |

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

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in .env (MongoDB URI, JWT secret, etc.)

4. Run the backend:
```bash
npm run dev
```

5. Start the frontend (Next.js):
```bash
npm run dev
```

6. Open `http://localhost:3000` in your browser.
