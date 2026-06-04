import { Router } from 'express'
import { z } from 'zod'

import { requireStudentAuth, requireInstituteAuth } from '../middleware/auth.js'
import { Student } from '../models/Student.js'
import { Institute } from '../models/Institute.js'

export const meRouter = Router()

const patchSchema = z
  .object({
    state: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    dob: z.string().min(1).optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    mobile: z.string().min(10).max(15).optional(),
    email: z.string().email().optional(),
    instituteCode: z.string().min(1).optional(),
    aadhar: z.string().min(12).max(12).optional(),
    bankIfsc: z.string().min(5).optional(),
    bankAccount: z.string().min(6).optional(),
    bankName: z.string().min(2).optional(),
  })
  .strict()

meRouter.get('/institute', requireInstituteAuth, async (req, res, next) => {
  try {
    console.log(`[me] Fetching profile for Institute ID: ${req.auth.instituteId}`)
    const institute = await Institute.findById(req.auth.instituteId).select('-passwordHash')
    if (!institute) return res.status(404).json({ error: 'Institute not found' })
    console.log(`[me] Found institute: ${institute.name} (${institute.instId})`)

    return res.json({ institute })
  } catch (err) {
    return next(err)
  }
})

meRouter.patch('/', requireStudentAuth, async (req, res, next) => {
  try {
    const patch = patchSchema.parse(req.body)

    if (patch.email) patch.email = patch.email.toLowerCase()

    const student = await Student.findByIdAndUpdate(
      req.auth.studentId,
      { $set: patch },
      { new: true, runValidators: true, context: 'query' }
    ).select('-passwordHash')

    if (!student) return res.status(401).json({ error: 'Unauthorized' })

    return res.json({ student })
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: err.errors })
    }
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate field (email/mobile)' })
    }
    return next(err)
  }
})
