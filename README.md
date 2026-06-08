<<<<<<< HEAD
National Scholarship Portal (NSP)
The National Scholarship Portal is a comprehensive, one-stop solution for students across the country to apply for various government scholarships. This platform streamlines the entire scholarship lifecycle, from student application submission to institute verification, state nodal officer review, and final ministry approval and disbursement.

🌟 Features
🎓 For Students
Registration & Authentication: Secure sign-up/login using Aadhar, Email, or Mobile number.
Password Recovery: OTP-based password reset via Email.
Dashboard: View available scholarships, track application status, and manage profile/documents.
Application Submission: Apply for multiple schemes including:
Post Matric Scholarship (Merit-cum-Means)
Pragati Scholarship for Girls
National Talent Search Examination (NTSE)
National Merit Scholarship
Central Scholarship Scheme
Status Tracking: Track multi-stage application progress (Applied ➔ Institute Review ➔ Govt Approval ➔ Disbursed).
🏫 For Institutes
Onboarding: Register with establishment certificates, DISE codes, and university affiliations.
Application Verification: Review, approve, or reject scholarship applications submitted by students in their institute.
🏛️ For Government Officers (State & Ministry)
Institute Approval Workflow: State Nodal Officers verify and forward new institute registrations to Ministry Officers for final approval.
Scholarship Approval Workflow: Multi-tier verification process for scholarship applications (Institute ➔ State Nodal Officer ➔ Ministry).
💻 Tech Stack
Frontend:

React (v18+) with react-router-dom for client-side routing.
Tailwind CSS for responsive, utility-first styling.
Vite as the frontend build tool.
Backend:

Node.js & Express.js for REST API development.
MongoDB (Mongoose) for database modeling and management.
JWT (JSON Web Tokens) & bcryptjs for secure authentication and password hashing.
Nodemailer for sending OTP emails.
Zod for robust request payload validation.
📂 Project Structure
=======
# National Scholarship Portal (NSP)

The **National Scholarship Portal** is a comprehensive, one-stop solution for students across the country to apply for various government scholarships. This platform streamlines the entire scholarship lifecycle, from student application submission to institute verification, state nodal officer review, and final ministry approval and disbursement.

---

## 🌟 Features

### 🎓 For Students
- **Registration & Authentication:** Secure sign-up/login using Aadhar, Email, or Mobile number.
- **Password Recovery:** OTP-based password reset via Email.
- **Dashboard:** View available scholarships, track application status, and manage profile/documents.
- **Application Submission:** Apply for multiple schemes including:
  - Post Matric Scholarship (Merit-cum-Means)
  - Pragati Scholarship for Girls
  - National Talent Search Examination (NTSE)
  - National Merit Scholarship
  - Central Scholarship Scheme
- **Status Tracking:** Track multi-stage application progress (Applied ➔ Institute Review ➔ Govt Approval ➔ Disbursed).

### 🏫 For Institutes
- **Onboarding:** Register with establishment certificates, DISE codes, and university affiliations.
- **Application Verification:** Review, approve, or reject scholarship applications submitted by students in their institute.

### 🏛️ For Government Officers (State & Ministry)
- **Institute Approval Workflow:** State Nodal Officers verify and forward new institute registrations to Ministry Officers for final approval.
- **Scholarship Approval Workflow:** Multi-tier verification process for scholarship applications (Institute ➔ State Nodal Officer ➔ Ministry).

---

## 💻 Tech Stack

**Frontend:**
- **React (v18+)** with `react-router-dom` for client-side routing.
- **Tailwind CSS** for responsive, utility-first styling.
- **Vite** as the frontend build tool.

**Backend:**
- **Node.js & Express.js** for REST API development.
- **MongoDB (Mongoose)** for database modeling and management.
- **JWT (JSON Web Tokens) & bcryptjs** for secure authentication and password hashing.
- **Nodemailer** for sending OTP emails.
- **Zod** for robust request payload validation.

---

## 📂 Project Structure

```text
>>>>>>> c40efee5048517641eabb5ad1cc6f22c78ae1a91
National Scholarship Portal/
├── src/                       # Frontend Source Code
│   ├── components/            # Reusable UI components (Navbar, Footer, etc.)
│   ├── pages/                 # Page components (Home, Dashboards, Forms)
│   └── ...                    # React entrypoints and styles
├── server/                    # Backend Source Code
│   ├── src/
│   │   ├── index.js           # Express app entrypoint
│   │   ├── models/            # Mongoose models (Student, Institute, Officer, etc.)
│   │   ├── routes/            # API routing (auth, applications)
│   │   ├── middleware/        # JWT Authentication middlewares
│   │   └── utils/             # Helpers (Email sending, cookie handling, env parsing)
├── test-workflow.ps1          # E2E PowerShell testing script
└── README.md                  # Project documentation
<<<<<<< HEAD
🚀 Getting Started
Prerequisites
Node.js (v16 or higher)
MongoDB (Local instance or MongoDB Atlas URI)
1. Environment Variables
Create a .env file in the server/ directory and configure the following:

=======
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Environment Variables
Create a `.env` file in the `server/` directory and configure the following:

```env
>>>>>>> c40efee5048517641eabb5ad1cc6f22c78ae1a91
MONGODB_URI=mongodb://localhost:27017/nsp_database
jwtSecret=your_super_secret_jwt_key

# SMTP Configuration for OTPs (Optional for dev)
smtpHost=smtp.example.com
smtpPort=465
smtpUser=your_email@example.com
smtpPass=your_email_password
emailFrom=noreply@nsp.gov.in
<<<<<<< HEAD
Note: If SMTP is not configured, the backend will log the OTP to the console during development.

2. Installation & Running
Terminal 1: Start the Backend server

=======
```
*Note: If SMTP is not configured, the backend will log the OTP to the console during development.*

### 2. Installation & Running

**Terminal 1: Start the Backend server**
```bash
>>>>>>> c40efee5048517641eabb5ad1cc6f22c78ae1a91
cd server
npm install
npm run dev
# The backend usually runs on http://localhost:5174
<<<<<<< HEAD
Terminal 2: Start the Frontend app

npm install
npm run dev
# The frontend usually runs on http://localhost:5173
🧪 Testing
The project includes a robust PowerShell script to test the complete Ministry Approval Workflow end-to-end. It seeds a test institute, simulates officer logins, and checks database state.

State Officer:

Email: stateoffice@gmail.com
Password: admin123
Ministry Officer:

Email: centraloffice@gmail.com
Password: admin123
To run the tests:

.\test-workflow.ps1
=======
```

**Terminal 2: Start the Frontend app**
```bash
npm install
npm run dev
# The frontend usually runs on http://localhost:5173
```

---

## 🧪 Testing

The project includes a robust PowerShell script to test the complete Ministry Approval Workflow end-to-end. It seeds a test institute, simulates officer logins, and checks database state.

**State Officer:**
- Email: `stateoffice@gmail.com`
- Password: `admin123`

**Ministry Officer:**
- Email: `centraloffice@gmail.com`
- Password: `admin123`

---
To run the tests:
```powershell
.\test-workflow.ps1
```
>>>>>>> c40efee5048517641eabb5ad1cc6f22c78ae1a91
