National Scholarship Portal (NSP) - Digital Transformation System
A robust, full-stack digital platform designed to automate and streamline the lifecycle of scholarship applications, from student registration and institute verification to multi-level government approval.

🚀 System Architecture
The project follows a modern MERN stack architecture:

Frontend: React.js with Tailwind CSS for a responsive, accessible UI.
Backend: Node.js & Express with a RESTful API design.
Database: MongoDB using Mongoose ODM for structured data modeling and validation.
Authentication: Role-based access control (RBAC) for Students, Institutes, and Officers.
🛠️ Tech Stack
Frontend: React, Lucide React (Icons), Tailwind CSS.
Backend: Node.js, Express.js.
Database: MongoDB.
Security: BCryptJS (Hashing), JWT (Stateful/Stateless sessions), Mongoose middleware.
Testing: PowerShell-based end-to-end workflow automation.
📂 Project Structure
server/src/models/
├── Student.js                # Student profiles & sensitive data
├── Institute.js              # Educational institution records
├── Officer.js                # State/Ministry level administrative accounts
├── ScholarshipApplication.js # The core application lifecycle engine
└── PasswordReset.js          # Secure OTP-based recovery system
src/pages/
└── Institute.js              # Dashboard for institutional management
📋 Data Models
1. Scholarship Application
Tracks the journey of a scholarship request through various stages: InstitutePending, StatePending, MinistryPending, Approved, or Rejected.

2. Institute
Stores institutional metadata (AISHE code, DISE code, University affiliation). Institutes must be approved by the Ministry before they can verify student applications.

3. Student
Maintains student demographics and financial details (Aadhaar, Bank IFSC, and Account details) for direct benefit transfers.

4. Officer
Role-based accounts (state_officer, ministry_officer) responsible for different tiers of the verification hierarchy.

⚙️ Key Workflows
Institute Verification Workflow
Registration: Institute signs up (Status: Pending).
State Forwarding: A State Officer reviews the institute and forwards it to the Ministry (Status: StatePending).
Ministry Approval: The Central Officer grants final approval (Status: Approved).
Activation: The Institute can now log in and verify student applications.
Scholarship Application Lifecycle
Student Submission: Student applies for a specific scholarship.
Institute Level: The educational head verifies student credentials.
Government Level: Sequential approval from State and then Ministry departments.
🧪 Automated Testing
The system includes a comprehensive PowerShell test suite (test-workflow.ps1) that validates the entire backend pipeline:

Environment cleanup and fresh backend initialization.
Seed data injection via ephemeral ESM scripts.
State Officer authentication and institute forwarding.
Ministry Officer authentication and final decision making.
Database integrity verification.
To run the test:

./test-workflow.ps1
🛡️ Security Features
Password Hashing: All credentials are secured using bcryptjs with high salt rounds.
TTL Indexes: Password reset tokens automatically expire using MongoDB expireAfterSeconds.
Data Integrity: Unique indexing on AISHE codes, emails, and mobile numbers.
Input Sanitization: Mongoose schemas utilize trim, lowercase, and enum constraints to ensure data quality.
🚦 Getting Started
Prerequisites
Node.js (v16+)
MongoDB Instance
Installation
Clone the repository.
Install dependencies:
cd server && npm install
cd ../ && npm install
Setup Environment Variables: Create a .env in the server directory:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5174
Start the development server:
npm run dev
🔐 Default Credentials (for Testing)
Upon initial startup, the backend automatically seeds the database with the following administrative accounts for testing the multi-stage approval workflow:

Role	Email	Password
State Nodal Officer	stateoffice@gmail.com	admin123
Ministry Officer	centraloffice@gmail.com	admin123
