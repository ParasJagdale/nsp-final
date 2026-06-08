import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { Officer } from '../models/Officer.js'
import { Institute } from '../models/Institute.js'
import { env } from '../utils/env.js'
import { setAccessCookie } from '../utils/cookies.js'

export const loginOfficer = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Find officer by email
    const officer = await Officer.findOne({
      email: email.toLowerCase(),
    });

    if (!officer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      officer.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        typ: 'officer',
        role: officer.role,
      },
      env.jwtSecret,
      {
        subject: String(officer._id),
        expiresIn: '1h',
      }
    );

    // Set cookie and respond
    setAccessCookie(res, token);

    return res.json({
      ok: true,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

export const getOfficerInstituteApplications = async (req, res, next) => {
  try {
    const apps = await Institute.find({ status: { $in: ['Pending', 'StatePending'] } }).sort({ createdAt: -1 })
    return res.json({ apps })
  } catch (err) { return next(err) }
}

export const forwardInstitute = async (req, res, next) => {  //forward the application to state
  try {
    const { id } = req.params;

    // Find institute
    const institute = await Institute.findById(id);
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    // Check if already approved
    if (institute.status === 'Approved') {
      return res
        .status(400)
        .json({ error: 'Institute already approved' });
    }

    // Update status
    institute.status = 'StatePending';
    await institute.save();

    return res.json({
      ok: true,
      status: institute.status,
    });
  } catch (err) {
    return next(err);
  }
};


export const decideInstitute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision } = req.body ?? {};

    // Validate decision
    const validDecisions = ['approve', 'reject'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ error: 'Invalid decision' });
    }

    // Find institute
    const institute = await Institute.findById(id);
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    // Ensure institute is forwarded first
    if (institute.status !== 'StatePending') {
      return res.status(400).json({
        error: 'Institute must be forwarded to ministry first',
      });
    }

    // Apply decision
    institute.status =
      decision === 'approve' ? 'Approved' : 'Rejected';

    await institute.save();

    return res.json({
      ok: true,
      status: institute.status,
    });
  } catch (err) {
    return next(err);
  }
};

export const getMinistryInstituteApplications = async (req, res, next) => {
  try {
    const apps = await Institute.find({ status: 'StatePending' }).sort({ createdAt: -1 })
    return res.json({ apps })
  } catch (err) { return next(err) }
}