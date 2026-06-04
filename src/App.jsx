import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import ApplicationSuccess from './pages/ApplicationSuccess'
import PostMatricScholarship from './pages/scholarships/PostMatricScholarship'
import PragatiScholarship from './pages/scholarships/PragatiScholarship'
import NTSEScholarship from './pages/scholarships/NTSEScholarship'
import NationalMeritScholarship from './pages/scholarships/NationalMeritScholarship'
import CentralScholarship from './pages/scholarships/CentralScholarship'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import StudentRegister from './pages/StudentRegister'
import StudentDashboard from './pages/StudentDashboard'
import MyProfile from './pages/MyProfile'
import CheckStatus from './pages/CheckStatus'
import UpdateProfile from './pages/UpdateProfile'
import ScholarshipForm from './pages/ScholarshipForm'
import InstituteRegister from './pages/InstituteRegister'
import OfficerInstituteApprovals from './pages/OfficerInstituteApprovals'
import InstituteDashboard from './pages/InstituteDashboard'
import InstituteApplications from './pages/InstituteApplications'
import InstituteProfile from './pages/InstituteProfile'
import StateDashboard from './pages/StateDashboard'
import MinistryDashboard from './pages/MinistryDashboard'

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/institute" element={<InstituteRegister />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/student/profile" element={<MyProfile />} />
        <Route path="/dashboard/student/check-status" element={<CheckStatus />} />
        <Route path="/dashboard/student/update-profile" element={<UpdateProfile />} />
        <Route path="/dashboard/student/apply/:schemeId" element={<ScholarshipForm />} />
        <Route path="/dashboard/institute" element={<InstituteDashboard />} />
        <Route path="/dashboard/institute/applications" element={<InstituteApplications />} />
        <Route path="/dashboard/institute/profile" element={<InstituteProfile />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route path="/dashboard/state" element={<StateDashboard />} />
        <Route path="/dashboard/state/institute-approvals" element={<OfficerInstituteApprovals />} />
        <Route path="/dashboard/ministry" element={<MinistryDashboard />} />
        <Route path="/post-matric-scholarship" element={<PostMatricScholarship />} />
        <Route path="/pragati-scholarship" element={<PragatiScholarship />} />
        <Route path="/ntse-scholarship" element={<NTSEScholarship />} />
        <Route path="/national-merit-scholarship" element={<NationalMeritScholarship />} />
        <Route path="/central-scholarship" element={<CentralScholarship />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
