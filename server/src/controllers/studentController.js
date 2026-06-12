import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { Student } from '../models/Student.js'
import { PasswordReset } from '../models/PasswordReset.js'
import { env } from '../utils/env.js'
import { setAccessCookie, clearAccessCookie } from '../utils/cookies.js'
import { sendOtpEmail } from '../utils/email.js'

const registerSchema = z.object({
  state: z.string().min(1),
  district: z.string().min(1),
  name: z.string().min(1),
  dob: z.string().min(1),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().min(10).max(15),
  email: z.string().email(),
  instituteCode: z.string().min(1),
  aadhar: z.string().min(12).max(12),
  bankIfsc: z.string().regex(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, 'Invalid IFSC Code'),
  bankAccount: z.string().min(6),
  bankName: z.string().min(2),
  password: z.string().min(6),
}).strict()

export const registerStudent = async (req, res, next) => {  //to register a new student
  try {
    const body = registerSchema.parse(req.body)
    const email = body.email.toLowerCase().trim()
    const mobile = body.mobile.trim()
    const existingEmail = await Student.findOne({ email }) 
    const existingMobile = await Student.findOne({ mobile })
    if (existingEmail || existingMobile) { //mobile and email should be unique only
      const reasons = []
      if (existingEmail) reasons.push('email')
      if (existingMobile) reasons.push('mobile')
      return res.status(409).json({ error: `Student already exists with ${reasons.join(' and ')}` })
    }

    const passwordHash = await bcrypt.hash(body.password, 12)

    const student = await Student.create({
      ...body,
      email: body.email.toLowerCase(),
      passwordHash,
    })

    return res.status(201).json({ id: student._id, email: student.email })
  } catch (err) {
    if (err?.name === 'ZodError') return res.status(400).json({ error: 'Invalid input', details: err.errors })
    if (err?.code === 11000) return res.status(409).json({ error: 'Student already exists' })
    return next(err)
  }
}

const loginSchema = z.object({  
  uid: z.string().min(1),
  password: z.string().min(1),
}).strict()

export const loginStudent = async (req, res, next) => {  //student login
  try {
    const body = loginSchema.parse(req.body)
    const uid = body.uid.trim()

    
    const student = await Student.findOne({
      $or: [{ email: uid.toLowerCase() }, { mobile: uid }, { aadhar: uid }],
    })

    if (!student) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(body.password, student.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

      //creates jwt token to set for 1 hour
    const token = jwt.sign({ typ: 'student' }, env.jwtSecret, { subject: String(student._id), expiresIn: '1h' })
    setAccessCookie(res, token)
    return res.json({ ok: true, token })
  } catch (err) {
    if (err?.name === 'ZodError') return res.status(400).json({ error: 'Invalid input' })
    return next(err)
  }
}

export const logout = (req, res) => {
  clearAccessCookie(res)
  res.json({ ok: true })
}

export const getStudentMe = async (req, res, next) => {
  try {
    const student = await Student.findById(req.auth.studentId).select('-passwordHash')
    if (!student) return res.status(401).json({ error: 'Unauthorized' })
    return res.json({ student })
  } catch (err) {
    return next(err)
  }
}

//send otp for the forget password
export const forgotPassword = async (req, res, next) => {
  try {
    const { uid } = req.body ?? {}
    if (!uid) return res.status(400).json({ error: 'Missing uid' })
      
      //find student by his email/mobile/aadhar
    const student = await Student.findOne({ $or: [{ email: uid.toLowerCase() }, { mobile: uid }, { aadhar: uid }] })
    if (!student) return res.status(404).json({ error: 'User not found' })

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const otpHash = await bcrypt.hash(otp, 10)  //otp sent is stored in database in secured hash form
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) //otp expires in 10 min

    await PasswordReset.create({ studentId: student._id, otpHash, expiresAt })

    let emailSent = false
    try {
      await sendOtpEmail(student.email, otp)
      emailSent = true
    } catch (err) {
      console.error('[forgot] Failed to send OTP email', err)
      if (env.nodeEnv === 'production') {
        return res.status(500).json({ error: 'Failed to send email' })
      }
    }

    const response = { ok: true, smtpConfigured: Boolean(env.smtpHost && env.smtpUser && env.smtpPass), emailSent }
    if (env.nodeEnv !== 'production') response.otp = otp
    return res.json(response)
  } catch (err) {
    return next(err)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const { uid, otp } = req.body ?? {}
    if (!uid || !otp) return res.status(400).json({ error: 'Missing fields' })
    const student = await Student.findOne({ $or: [{ email: uid.toLowerCase() }, { mobile: uid }, { aadhar: uid }] })
    if (!student) return res.status(404).json({ error: 'User not found' })

      //check for latest OTP entry
    const pr = await PasswordReset.findOne({ studentId: student._id }).sort({ createdAt: -1 })
    if (!pr || pr.expiresAt < new Date()) return res.status(400).json({ error: 'OTP expired or not found' })

      //compare the entered otp with the stored otp
    const ok = await bcrypt.compare(otp, pr.otpHash)
    if (!ok) return res.status(400).json({ error: 'Invalid OTP' })

      // Generate 15 min short token to give a temporary pass to reset password
    const resetToken = jwt.sign({ typ: 'reset' }, env.jwtSecret, { subject: String(student._id), expiresIn: '15m' })
    return res.json({ resetToken })
  } catch (err) {
    return next(err)
  }
}

  // Reset password using reset token
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body ?? {}
    if (!resetToken || !newPassword) return res.status(400).json({ error: 'Missing fields' })

      // Verify JWT toke
    const payload = jwt.verify(resetToken, env.jwtSecret)

    // Ensure it's a valid reset token
    if (payload?.typ !== 'reset' || !payload?.sub) return res.status(400).json({ error: 'Invalid token' })

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await Student.findByIdAndUpdate(payload.sub, { passwordHash })

    // Remove all OTP records after reset
    await PasswordReset.deleteMany({ studentId: payload.sub })
    return res.json({ ok: true })
  } catch (err) { return next(err) }
}