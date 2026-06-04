import jwt from 'jsonwebtoken'
import { env } from '../utils/env.js'

export function requireStudentAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const payload = jwt.verify(token, env.jwtSecret)
    if (payload?.typ !== 'student' || !payload?.sub) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.auth = { studentId: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function requireInstituteAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const payload = jwt.verify(token, env.jwtSecret)
    if (payload?.typ !== 'institute' || !payload?.sub) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.auth = { instituteId: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function requireOfficerAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const payload = jwt.verify(token, env.jwtSecret)
    if (payload?.typ !== 'officer' || !payload?.sub) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.auth = { officerId: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
