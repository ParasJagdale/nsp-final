import { Router } from 'express'
import { requireStudentAuth, requireInstituteAuth, requireOfficerAuth } from '../middleware/auth.js'

import {
  registerStudent, loginStudent, logout, getStudentMe, 
  forgotPassword, verifyOtp, resetPassword 
} from '../controllers/studentController.js'

import { 
  registerInstitute, loginInstitute, getInstituteNameByCode
} from '../controllers/instituteController.js'

import { 
  loginOfficer, getOfficerInstituteApplications, forwardInstitute, 
  decideInstitute, getMinistryInstituteApplications 
} from '../controllers/officerController.js'

import { 
  getStudentApplications, createScholarshipApplication, getInstituteApplications, 
  decideInstituteScholarship, getOfficerScholarshipApplications, getMinistryScholarshipApplications, 
  decideOfficerScholarship, getScholarshipStatus 
} from '../controllers/scholarshipController.js'

export const authRouter = Router()

authRouter.post('/register', registerStudent)
authRouter.post('/login', loginStudent)
authRouter.post('/logout', logout)
authRouter.get('/me', requireStudentAuth, getStudentMe)
authRouter.post('/register/institute', registerInstitute)
authRouter.get('/officer/institute-applications', requireOfficerAuth, getOfficerInstituteApplications)
authRouter.post('/officer/institute/:id/forward', requireOfficerAuth, forwardInstitute)
authRouter.post('/officer/login', loginOfficer)
authRouter.post('/officer/institute/:id/decision', requireOfficerAuth, decideInstitute)
authRouter.get('/officer/ministry/institute-applications', requireOfficerAuth, getMinistryInstituteApplications)
authRouter.post('/forgot', forgotPassword)
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/institute/login', loginInstitute)
authRouter.get('/institute/info/:code', requireStudentAuth, getInstituteNameByCode)
authRouter.get('/student/applications', requireStudentAuth, getStudentApplications)
authRouter.post('/scholarship', requireStudentAuth, createScholarshipApplication)
authRouter.get('/institute/applications', requireInstituteAuth, getInstituteApplications)
authRouter.post('/institute/applications/:id/decision', requireInstituteAuth, decideInstituteScholarship)
authRouter.get('/officer/scholarship-applications', requireOfficerAuth, getOfficerScholarshipApplications)
authRouter.get('/officer/ministry/scholarship-applications', requireOfficerAuth, getMinistryScholarshipApplications)
authRouter.post('/officer/scholarship/:id/decision', requireOfficerAuth, decideOfficerScholarship)
authRouter.get('/scholarship/status/:appId', getScholarshipStatus)
