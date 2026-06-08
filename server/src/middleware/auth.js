import jwt from 'jsonwebtoken'
import { env } from '../utils/env.js'


// ================= STUDENT AUTH MIDDLEWARE =================
export function requireStudentAuth(req, res, next) {
  try {
    // 1. Extract JWT token from cookies
    // (token was stored during login using setAccessCookie)
    const token = req.cookies?.access_token

    // If no token → user is not logged in
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Verify the token using secret key
    // This checks:
    // - Token signature (not tampered)
    // - Expiry (not expired)
    // - Decodes payload
    const payload = jwt.verify(token, env.jwtSecret)

    // 3. Validate token type and structure
    // typ ensures correct role (student)
    // sub contains the user ID
    if (payload?.typ !== 'student' || !payload?.sub) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 4. Attach authenticated user info to request object
    // Controllers will use this (e.g., req.auth.studentId)
    req.auth = { studentId: payload.sub }

    // 5. Pass control to next middleware/controller
    return next()

  } catch {
    // If token is invalid/expired → reject request
    return res.status(401).json({ error: 'Unauthorized' })
  }
}



// ================= INSTITUTE AUTH MIDDLEWARE =================
export function requireInstituteAuth(req, res, next) {
  try {
    // 1. Get JWT token from cookies
    const token = req.cookies?.access_token

    // If not present → user is not authenticated
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Verify token validity
    const payload = jwt.verify(token, env.jwtSecret)

    // 3. Ensure this token belongs to an institute
    // Prevents students/officers from accessing institute routes
    if (payload?.typ !== 'institute' || !payload?.sub) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 4. Store institute ID in request for later use
    req.auth = { instituteId: payload.sub }

    // Continue to next handler
    return next()

  } catch {
    // Invalid or expired token
    return res.status(401).json({ error: 'Unauthorized' })
  }
}



// ================= OFFICER AUTH MIDDLEWARE =================
export function requireOfficerAuth(req, res, next) {
  try {
    // 1. Retrieve token from cookies
    const token = req.cookies?.access_token

    // If token missing → not logged in
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Verify token authenticity and decode it
    const payload = jwt.verify(token, env.jwtSecret)

    // 3. Ensure this is an officer token
    // Prevents unauthorized access by other roles
    if (payload?.typ !== 'officer' || !payload?.sub) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 4. Attach officer ID to request
    req.auth = { officerId: payload.sub }

    // Proceed to controller
    return next()

  } catch {
    // Any failure (expired, tampered, invalid)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
