
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
=======
# National-Scholarship-Portal
# National Scholarship Portal (NSP) - Digital Transformation System

A robust, full-stack digital platform designed to automate and streamline the lifecycle of scholarship applications, from student registration and institute verification to multi-level government approval.

## 🚀 System Architecture

The project follows a modern MERN stack architecture:
- **Frontend**: React.js with Tailwind CSS for a responsive, accessible UI.
- **Backend**: Node.js & Express with a RESTful API design.
- **Database**: MongoDB using Mongoose ODM for structured data modeling and validation.
- **Authentication**: Role-based access control (RBAC) for Students, Institutes, and Officers.

## 🛠️ Tech Stack

- **Frontend**: React, Lucide React (Icons), Tailwind CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB.
- **Security**: BCryptJS (Hashing), JWT (Stateful/Stateless sessions), Mongoose middleware.
- **Testing**: PowerShell-based end-to-end workflow automation.
>>>>>>> f7e1863339ac70ef9d167e1e7e24adde8f2b8329

## 📂 Project Structure

```text
<<<<<<< HEAD
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
=======
server/src/models/
├── Student.js                # Student profiles & sensitive data
├── Institute.js              # Educational institution records
├── Officer.js                # State/Ministry level administrative accounts
├── ScholarshipApplication.js # The core application lifecycle engine
└── PasswordReset.js          # Secure OTP-based recovery system
src/pages/
└── Institute.js              # Dashboard for institutional management
```

## 📋 Data Models

### 1. Scholarship Application
Tracks the journey of a scholarship request through various stages: `InstitutePending`, `StatePending`, `MinistryPending`, `Approved`, or `Rejected`.

### 2. Institute
Stores institutional metadata (AISHE code, DISE code, University affiliation). Institutes must be approved by the Ministry before they can verify student applications.

### 3. Student
Maintains student demographics and financial details (Aadhaar, Bank IFSC, and Account details) for direct benefit transfers.

### 4. Officer
Role-based accounts (`state_officer`, `ministry_officer`) responsible for different tiers of the verification hierarchy.

## ⚙️ Key Workflows

### Institute Verification Workflow
1. **Registration**: Institute signs up (Status: `Pending`).
2. **State Forwarding**: A State Officer reviews the institute and forwards it to the Ministry (Status: `StatePending`).
3. **Ministry Approval**: The Central Officer grants final approval (Status: `Approved`).
4. **Activation**: The Institute can now log in and verify student applications.

### Scholarship Application Lifecycle
1. **Student Submission**: Student applies for a specific scholarship.
2. **Institute Level**: The educational head verifies student credentials.
3. **Government Level**: Sequential approval from State and then Ministry departments.

## 🧪 Automated Testing

The system includes a comprehensive PowerShell test suite (`test-workflow.ps1`) that validates the entire backend pipeline:
- Environment cleanup and fresh backend initialization.
- Seed data injection via ephemeral ESM scripts.
- State Officer authentication and institute forwarding.
- Ministry Officer authentication and final decision making.
- Database integrity verification.

To run the test:
```powershell
./test-workflow.ps1
```

## 🛡️ Security Features

- **Password Hashing**: All credentials are secured using `bcryptjs` with high salt rounds.
- **TTL Indexes**: Password reset tokens automatically expire using MongoDB `expireAfterSeconds`.
- **Data Integrity**: Unique indexing on AISHE codes, emails, and mobile numbers.
- **Input Sanitization**: Mongoose schemas utilize `trim`, `lowercase`, and `enum` constraints to ensure data quality.

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Instance

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../ && npm install
   ```
3. Setup Environment Variables:
   Create a `.env` in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   PORT=5174
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Default Credentials (for Testing)

Upon initial startup, the backend automatically seeds the database with the following administrative accounts for testing the multi-stage approval workflow:

| Role | Email | Password |
| :--- | :--- | :--- |
| **State Nodal Officer** | `stateoffice@gmail.com` | `admin123` |
| **Ministry Officer** | `centraloffice@gmail.com` | `admin123` |
>>>>>>> f7e1863339ac70ef9d167e1e7e24adde8f2b8329
