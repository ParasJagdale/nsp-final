import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { Student } from '../models/Student.js'
import { env } from '../utils/env.js'
import { setAccessCookie, clearAccessCookie } from '../utils/cookies.js'
import { requireStudentAuth, requireInstituteAuth, requireOfficerAuth } from '../middleware/auth.js'
import { PasswordReset } from '../models/PasswordReset.js'
import { sendOtpEmail } from '../utils/email.js'
import { Institute } from '../models/Institute.js'
import { Officer } from '../models/Officer.js'
import { ScholarshipApplication } from '../models/ScholarshipApplication.js'
import mongoose from 'mongoose'

export const authRouter = Router()

const registerSchema = z
  .object({
    state: z.string().min(1),
    district: z.string().min(1),
    name: z.string().min(1),
    dob: z.string().min(1),
    gender: z.enum(['Male', 'Female', 'Other']),
    mobile: z.string().min(10).max(15),
    email: z.string().email(),
    instituteCode: z.string().min(1),
    aadhar: z.string().min(12).max(12),
    bankIfsc: z.string().min(5),
    bankAccount: z.string().min(6),
    bankName: z.string().min(2),
    password: z.string().min(6),
  })
  .strict()

authRouter.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body)
    const email = body.email.toLowerCase().trim()
    const mobile = body.mobile.trim()
    const existingEmail = await Student.findOne({ email })
    const existingMobile = await Student.findOne({ mobile })
    if (existingEmail || existingMobile) {
      const reasons = []
      if (existingEmail) reasons.push('email')
      if (existingMobile) reasons.push('mobile')
      return res.status(409).json({ error: `Student already exists with ${reasons.join(' and ')}` })
    }

    const passwordHash = await bcrypt.hash(body.password, 12)

    const student = await Student.create({
      state: body.state,
      district: body.district,
      name: body.name,
      dob: body.dob,
      gender: body.gender,
      mobile: body.mobile,
      email: body.email.toLowerCase(),
      instituteCode: body.instituteCode,
      aadhar: body.aadhar,
      bankIfsc: body.bankIfsc,
      bankAccount: body.bankAccount,
      bankName: body.bankName,
      passwordHash,
    })

    return res.status(201).json({
      id: student._id,
      email: student.email,
    })
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: err.errors })
    }
    // mongoose duplicate key
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Student already exists' })
    }
    return next(err)
  }
})

const loginSchema = z
  .object({
    uid: z.string().min(1),
    password: z.string().min(1),
  })
  .strict()

authRouter.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body)
    const uid = body.uid.trim()

    const student = await Student.findOne({
      $or: [{ email: uid.toLowerCase() }, { mobile: uid }, { aadhar: uid }],
    })

    if (!student) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(body.password, student.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { typ: 'student' },
      env.jwtSecret,
      { subject: String(student._id), expiresIn: '1h' }
    )

    setAccessCookie(res, token)

    return res.json({ ok: true, token })
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input' })
    }
    return next(err)
  }
})

authRouter.post('/logout', (req, res) => {
  clearAccessCookie(res)
  res.json({ ok: true })
})

authRouter.get('/me', requireStudentAuth, async (req, res, next) => {
  try {
    const student = await Student.findById(req.auth.studentId).select(
      '-passwordHash'
    )
    if (!student) return res.status(401).json({ error: 'Unauthorized' })
    return res.json({ student })
  } catch (err) {
    return next(err)
  }
})
// Institute Registration with Sequential ID Generation (NSP001, NSP002...)
authRouter.post('/register/institute', async (req, res, next) => {
  try {
    const body = req.body
    
    // Generate sequential ID
    const lastInst = await Institute.findOne().sort({ createdAt: -1 })
    let nextNum = 1
    if (lastInst && lastInst.instId) {
      const match = lastInst.instId.match(/NSP(\d+)/)
      if (match) nextNum = parseInt(match[1]) + 1
    }
    const instId = `NSP${String(nextNum).padStart(3, '0')}`

    const passwordHash = await bcrypt.hash(body.password, 12)
    const institute = await Institute.create({
      ...body,
      instId,
      passwordHash,
      address: {
        addr1: body.addr1,
        addr2: body.addr2,
        city: body.city,
        addrState: body.addrState,
        addrDistrict: body.addrDistrict,
        pincode: body.pincode,
      }
    })

    return res.status(201).json({ ok: true, instId: institute.instId })
  } catch (err) {
    return next(err)
  }
})

// Fetch institute applications for State Nodal Officer
authRouter.get('/officer/institute-applications', requireOfficerAuth, async (req, res, next) => {
  try {
    const apps = await Institute.find({ status: { $in: ['Pending', 'StatePending'] } }).sort({ createdAt: -1 })
    return res.json({ apps })
  } catch (err) {
    return next(err)
  }
})

// State officer forwards an institute to ministry
authRouter.post('/officer/institute/:id/forward', requireOfficerAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const inst = await Institute.findById(id)
    if (!inst) return res.status(404).json({ error: 'Institute not found' })
    if (inst.status === 'Approved') return res.status(400).json({ error: 'Institute already approved' })
    inst.status = 'StatePending'
    await inst.save()
    return res.json({ ok: true, status: inst.status })
  } catch (err) {
    return next(err)
  }
})

// Officer login
authRouter.post('/officer/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const officer = await Officer.findOne({ email: email.toLowerCase() })
    if (!officer) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, officer.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ typ: 'officer', role: officer.role }, env.jwtSecret, { subject: String(officer._id), expiresIn: '8h' })
    setAccessCookie(res, token)
    return res.json({ ok: true, token })
  } catch (err) {
    return next(err)
  }
})

// Ministry approves/rejects institute after state forwarding
authRouter.post('/officer/institute/:id/decision', requireOfficerAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { decision } = req.body ?? {}
    if (!['approve', 'reject'].includes(decision)) return res.status(400).json({ error: 'Invalid decision' })
    const inst = await Institute.findById(id)
    if (!inst) return res.status(404).json({ error: 'Institute not found' })
    if (inst.status !== 'StatePending') return res.status(400).json({ error: 'Institute must be forwarded to ministry first' })
    inst.status = decision === 'approve' ? 'Approved' : 'Rejected'
    await inst.save()
    return res.json({ ok: true, status: inst.status })
  } catch (err) {
    return next(err)
  }
})

// Ministry officer view forwarded institute applications
authRouter.get('/officer/ministry/institute-applications', requireOfficerAuth, async (req, res, next) => {
  try {
    const apps = await Institute.find({ status: 'StatePending' }).sort({ createdAt: -1 })
    return res.json({ apps })
  } catch (err) {
    return next(err)
  }
})
// Forgot password: request OTP to email
authRouter.post('/forgot', async (req, res, next) => {
  try {
    console.log('[forgot] endpoint called')
    const { uid } = req.body ?? {}
    if (!uid) return res.status(400).json({ error: 'Missing uid' })

    const student = await Student.findOne({
      $or: [{ email: uid.toLowerCase() }, { mobile: uid }, { aadhar: uid }],
    })

    if (!student) return res.status(404).json({ error: 'User not found' })

    // create OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    console.log(`[forgot] Generated OTP for ${student.email}: ${otp}`)
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    console.log(`[forgot] Saving PasswordReset doc for studentId: ${student._id}`)
    await PasswordReset.create({ studentId: student._id, otpHash, expiresAt })
    console.log(`[forgot] PasswordReset doc saved`)

    // send email
    let emailSent = false
    try {
      console.log(`[forgot] Sending OTP email to ${student.email}`)
      await sendOtpEmail(student.email, otp)
      emailSent = true
      console.log(`[forgot] Email sent successfully`)
    } catch (err) {
      console.error('[forgot] Failed to send OTP email', err)
      // do not expose SMTP details to client
      return res.status(500).json({ error: 'Failed to send email' })
    }

    const response = {
      ok: true,
      smtpConfigured: Boolean(env.smtpHost && env.smtpUser && env.smtpPass),
      emailSent,
    }
    if (env.nodeEnv !== 'production') {
      response.otp = otp // Included for development debugging
    }
    console.log('[forgot] Returning success response')
    return res.json(response)
  } catch (err) {
    console.error('[forgot] Unhandled error:', err.message, err.stack)
    return next(err)
  }
})

// Verify OTP and issue short-lived reset token
authRouter.post('/verify-otp', async (req, res, next) => {
  try {
    const { uid, otp } = req.body ?? {}
    if (!uid || !otp) return res.status(400).json({ error: 'Missing fields' })

    const student = await Student.findOne({
      $or: [{ email: uid.toLowerCase() }, { mobile: uid }, { aadhar: uid }],
    })
    if (!student) return res.status(404).json({ error: 'User not found' })

    const pr = await PasswordReset.findOne({ studentId: student._id }).sort({ createdAt: -1 })
    if (!pr || pr.expiresAt < new Date()) return res.status(400).json({ error: 'OTP expired or not found' })

    const ok = await bcrypt.compare(otp, pr.otpHash)
    if (!ok) return res.status(400).json({ error: 'Invalid OTP' })

    // create short lived reset token
    const resetToken = jwt.sign({ typ: 'reset' }, env.jwtSecret, { subject: String(student._id), expiresIn: '15m' })

    return res.json({ resetToken })
  } catch (err) {
    return next(err)
  }
})

// Reset password using resetToken
authRouter.post('/reset-password', async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body ?? {}
    if (!resetToken || !newPassword) return res.status(400).json({ error: 'Missing fields' })

    let payload
    try {
      payload = jwt.verify(resetToken, env.jwtSecret)
    } catch {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }
    if (payload?.typ !== 'reset' || !payload?.sub) return res.status(400).json({ error: 'Invalid token' })

    const studentId = payload.sub
    const passwordHash = await bcrypt.hash(newPassword, 12)
    const student = await Student.findByIdAndUpdate(studentId, { passwordHash })
    if (!student) return res.status(404).json({ error: 'User not found' })

    // remove any outstanding reset docs
    await PasswordReset.deleteMany({ studentId })

    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
})

// Institute login
authRouter.post('/institute/login', async (req, res, next) => {
  try {
    const { uid, password } = req.body ?? {}
    if (!uid || !password) return res.status(400).json({ error: 'Missing fields' })
    const institute = await Institute.findOne({ $or: [{ instId: uid }, { code: uid }, { mobile: uid }] })
    if (!institute) return res.status(401).json({ error: 'Invalid credentials' })
    // only allow login if the institute is approved by state officer
    if (institute.status !== 'Approved') {
      return res.status(403).json({ error: 'Institute not approved' })
    }

    const ok = await bcrypt.compare(password, institute.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ typ: 'institute' }, env.jwtSecret, { subject: String(institute._id), expiresIn: '8h' })
    setAccessCookie(res, token)
    return res.json({ ok: true, instId: institute.instId, token })
  } catch (err) {
    return next(err)
  }
})

// Student: List their own applications for tracking
authRouter.get('/student/applications', requireStudentAuth, async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication.find({ studentId: req.auth.studentId }).sort({ createdAt: -1 })
    return res.json({ apps })
  } catch (err) {
    return next(err)
  }
})

// Student -> create scholarship application (goes to institute approval)
authRouter.post('/scholarship', requireStudentAuth, async (req, res, next) => {
  try {
    const body = req.body ?? {}
    const { instituteCode, formData } = body
    if (!instituteCode) return res.status(400).json({ error: 'Missing instituteCode' })
    const inst = await Institute.findOne({ instId: instituteCode })
    if (!inst) return res.status(400).json({ error: 'Invalid institute code' })
    if (inst.status !== 'Approved') return res.status(400).json({ error: 'Institute not approved by state' })

    // Generate unique Application ID: e.g., NSP-APP-1715678901234
    const appId = `NSP-APP-${Date.now()}`

    const app = await ScholarshipApplication.create({ 
      appId,
      studentId: req.auth.studentId, 
      instituteId: inst._id, 
      instituteCode, 
      data: formData, 
      status: 'InstitutePending' 
    })
    return res.status(201).json({ ok: true, appId, id: app._id })
  } catch (err) {
    return next(err)
  }
})

// Institute: list scholarship applications pending their approval
authRouter.get('/institute/applications', requireInstituteAuth, async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication.find({ instituteId: req.auth.instituteId, status: 'InstitutePending' }).sort({ createdAt: -1 }).populate('studentId', '-passwordHash')
    return res.json({ apps })
  } catch (err) {
    return next(err)
  }
})

// Institute decide on scholarship application
authRouter.post('/institute/applications/:id/decision', requireInstituteAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { decision } = req.body ?? {}
    if (!['approve', 'reject'].includes(decision)) return res.status(400).json({ error: 'Invalid decision' })
    const app = await ScholarshipApplication.findById(id)
    if (!app) return res.status(404).json({ error: 'Application not found' })
    if (String(app.instituteId) !== String(req.auth.instituteId)) return res.status(403).json({ error: 'Forbidden' })
    app.status = decision === 'approve' ? 'StatePending' : 'Rejected'
    await app.save()
    return res.json({ ok: true, status: app.status })
  } catch (err) {
    return next(err)
  }
})

// Officer: list scholarship applications pending state approval (for State Officer)
authRouter.get('/officer/scholarship-applications', requireOfficerAuth, async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication.find({ status: 'StatePending' }).sort({ createdAt: -1 }).populate('studentId', '-passwordHash').populate('instituteId')
    return res.json({ apps })
  } catch (err) {
    return next(err)
  }
})

// Officer: list scholarship applications pending ministry approval (for Ministry Officer)
authRouter.get('/officer/ministry/scholarship-applications', requireOfficerAuth, async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication.find({ status: 'MinistryPending' }).sort({ createdAt: -1 }).populate('studentId', '-passwordHash').populate('instituteId')
    return res.json({ apps })
  } catch (err) {
    return next(err)
  }
})

// Officer decide on scholarship
authRouter.post('/officer/scholarship/:id/decision', requireOfficerAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { decision } = req.body ?? {}

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Application ID format' })
    }

    if (!['approve', 'reject'].includes(decision)) return res.status(400).json({ error: 'Invalid decision' })

    const app = await ScholarshipApplication.findById(id)
    if (!app) return res.status(404).json({ error: 'Application not found' })

    // Get identity from req.auth or req.user (middleware dependent)
    const auth = req.auth || req.user || {}
    let role = auth.role

    if (!role) {
      const officerId = auth.officerId || auth.sub || auth.id
      const officer = officerId ? await Officer.findById(officerId) : null
      if (!officer) return res.status(403).json({ error: 'Officer role not found' })
      role = officer.role;
    }

    // Decision logic based on role
    if (role === 'state_officer') {
      console.log(`[Decision] State Officer forwarding application ${id} to Ministry`);
      app.status = decision === 'approve' ? 'MinistryPending' : 'Rejected'
    } else if (role === 'ministry_officer') {
      app.status = decision === 'approve' ? 'Approved' : 'Rejected'
    } else {
      return res.status(403).json({ error: 'Unauthorized role' })
    }

    // Recovery: If appId is missing on an old record, populate it to prevent validation failure on save
    if (!app.appId) {
      app.appId = `NSP-APP-FIX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    try {
      await app.save()
      return res.json({ ok: true, status: app.status })
    } catch (saveErr) {
      console.error('[Decision] Save Error:', saveErr.message);
      return res.status(500).json({ error: 'Failed to update application status', details: saveErr.message });
    }
  } catch (err) {
    return next(err)
  }
})

// Public tracking: Get status by Application ID
authRouter.get('/scholarship/status/:appId', async (req, res, next) => {
  try {
    const { appId } = req.params
    const app = await ScholarshipApplication.findOne({ 
      $or: [
        { appId },
        { appId: `NSP-APP-${appId}` }
      ]
    }).select('status appId updatedAt')
    if (!app) return res.status(404).json({ error: 'Application not found' })
    return res.json({ app })
  } catch (err) {
    return next(err)
  }
})
