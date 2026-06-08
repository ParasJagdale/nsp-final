import mongoose from 'mongoose'

// Import database models
import { ScholarshipApplication } from '../models/ScholarshipApplication.js'
import { Institute } from '../models/Institute.js'
import { Officer } from '../models/Officer.js'


// ================= STUDENT =================

// Get all applications submitted by the logged-in student
export const getStudentApplications = async (req, res, next) => {
  try {
    // Find applications using studentId from auth middleware
    const apps = await ScholarshipApplication
      .find({ studentId: req.auth.studentId })
      .sort({ createdAt: -1 }) // newest first

    return res.json({ apps })
  } catch (err) { 
    return next(err) 
  }
}


// Create a new scholarship application
export const createScholarshipApplication = async (req, res, next) => {
  try {
    const { instituteCode, formData } = req.body ?? {}

    // Validate required field
    if (!instituteCode) {
      return res.status(400).json({ error: 'Missing instituteCode' })
    }

    // Check if institute exists using instId (code)
    const inst = await Institute.findOne({ instId: instituteCode })

    if (!inst) {
      return res.status(400).json({ error: 'Invalid institute code' })
    }

    // Ensure institute is approved before applying
    if (inst.status !== 'Approved') {
      return res.status(400).json({ error: 'Institute not approved by state' })
    }

    // Generate unique application ID using timestamp
    const appId = `NSP-APP-${Date.now()}`

    // Create application entry in DB
    const app = await ScholarshipApplication.create({ 
      appId,
      studentId: req.auth.studentId,
      instituteId: inst._id,
      instituteCode,
      data: formData,                 // stores form input
      status: 'InstitutePending'      // initial status
    })

    return res.status(201).json({ ok: true, appId, id: app._id })
  } catch (err) { 
    return next(err) 
  }
}


// ================= INSTITUTE =================

// Get applications for the logged-in institute
export const getInstituteApplications = async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication
      .find({
        instituteId: req.auth.instituteId   // only their applications
      })
      .sort({ createdAt: -1 })              // newest first
      .populate('studentId', '-passwordHash') // include student details without password

    return res.json({ apps })
  } catch (err) { 
    return next(err) 
  }
}


// Institute approves or rejects a scholarship application
export const decideInstituteScholarship = async (req, res, next) => {
  try {
    const { id } = req.params
    const { decision } = req.body ?? {}

    // Allow only two valid decisions
    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ error: 'Invalid decision' })
    }

    const app = await ScholarshipApplication.findById(id)

    if (!app) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Ensure institute can only modify its own applications
    if (String(app.instituteId) !== String(req.auth.instituteId)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Update status based on decision
    app.status = decision === 'approve'
      ? 'StatePending'   // goes to state officer
      : 'Rejected'

    await app.save()

    return res.json({ ok: true, status: app.status })
  } catch (err) { 
    return next(err) 
  }
}


// ================= OFFICER =================

// Get applications for state officer
export const getOfficerScholarshipApplications = async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication
      .find({ status: 'StatePending' }) // ready for state review
      .sort({ createdAt: -1 })
      .populate('studentId', '-passwordHash') // include student data
      .populate('instituteId')                // include institute info

    return res.json({ apps })
  } catch (err) { 
    return next(err) 
  }
}


// Get applications for ministry officer
export const getMinistryScholarshipApplications = async (req, res, next) => {
  try {
    const apps = await ScholarshipApplication
      .find({ status: 'MinistryPending' }) // ready for ministry
      .sort({ createdAt: -1 })
      .populate('studentId', '-passwordHash')
      .populate('instituteId')

    return res.json({ apps })
  } catch (err) { 
    return next(err) 
  }
}


// Officer (state or ministry) makes decision
export const decideOfficerScholarship = async (req, res, next) => {
  try {
    const { id } = req.params
    const { decision } = req.body ?? {}

    // Validate MongoDB object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    // Allow only valid decisions
    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ error: 'Invalid decision' })
    }

    const app = await ScholarshipApplication.findById(id)

    if (!app) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Get officer role from auth or DB
    const auth = req.auth || req.user || {}
    let role = auth.role ||
      (await Officer.findById(auth.officerId || auth.sub || auth.id))?.role

    // Apply decision logic based on role
    if (role === 'state_officer') {
      // State forwards to ministry
      app.status = decision === 'approve'
        ? 'MinistryPending'
        : 'Rejected'

    } else if (role === 'ministry_officer') {
      // Ministry gives final decision
      app.status = decision === 'approve'
        ? 'Approved'
        : 'Rejected'

    } else {
      return res.status(403).json({ error: 'Unauthorized role' })
    }

    // Safety: ensure appId exists
    if (!app.appId) {
      app.appId = `NSP-APP-FIX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }

    await app.save()

    return res.json({ ok: true, status: app.status })
  } catch (err) { 
    return next(err) 
  }
}


// ================= PUBLIC =================

// Check scholarship status by appId
export const getScholarshipStatus = async (req, res, next) => {
  try {
    const { appId } = req.params

    // Allow both full ID and short ID
    const app = await ScholarshipApplication.findOne({
        $or: [
          { appId },                          // full id
          { appId: `NSP-APP-${appId}` }       // short id support
        ]
      })
      .select('status appId updatedAt') // return minimal info

    if (!app) {
      return res.status(404).json({ error: 'Application not found' })
    }

    return res.json({ app })
  } catch (err) { 
    return next(err) 
  }
}
