import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'  //creates authentication tokens

import { Institute } from '../models/Institute.js'
import { env } from '../utils/env.js'
import { setAccessCookie } from '../utils/cookies.js'

export const registerInstitute = async (req, res, next) => {
  try {
    const body = req.body
    const lastInst = await Institute.findOne().sort({ createdAt: -1 }) //get the last Institute ID
    let nextNum = 1
    if (lastInst && lastInst.instId) {
      const match = lastInst.instId.match(/NSP(\d+)/)
      if (match) nextNum = parseInt(match[1]) + 1 //Create new Institute ID as Incremented, eg: NSP001, NSP002
    }
    const instId = `NSP${String(nextNum).padStart(3, '0')}`
    const passwordHash = await bcrypt.hash(body.password, 12)

    const institute = await Institute.create({
      ...body,
      instId,
      passwordHash,
      address: {
        addr1: body.addr1, addr2: body.addr2, city: body.city,
        addrState: body.addrState, addrDistrict: body.addrDistrict, pincode: body.pincode,
      }
    })

    return res.status(201).json({ ok: true, instId: institute.instId })
  } catch (err) {
    return next(err)
  }
}

export const loginInstitute = async (req, res, next) => {
  try {
    const { uid, password } = req.body ?? {}  //uid can be phone no. , institute id, or Code
    if (!uid || !password)
         return res.status(400).json({ error: 'Missing fields' })


    const institute = await Institute.findOne({ $or: [{ instId: uid }, { code: uid }, { mobile: uid }] })
    if (!institute) 
        return res.status(401).json({ error: 'Invalid credentials' })
    if (institute.status !== 'Approved') 
        return res.status(403).json({ error: 'Institute not approved' })

    const ok = await bcrypt.compare(password, institute.passwordHash)
    if (!ok) 
        return res.status(401).json({ error: 'Invalid credentials' })
    
    const token = jwt.sign({ typ: 'institute' }, env.jwtSecret, { subject: String(institute._id), expiresIn: '1h' })
    setAccessCookie(res, token)
    return res.json({ ok: true, instId: institute.instId, token })
  } catch (err) { return next(err) }  //cookie based session for 1 hr
}

export const getInstituteNameByCode = async (req, res, next) => {
  try {
    const { code } = req.params
    const institute = await Institute.findOne({ instId: code })
    
    if (!institute) return res.status(404).json({ error: 'Institute not found' })
    if (institute.status !== 'Approved') return res.status(403).json({ error: 'Institute not approved yet' })
    
    return res.json({ name: institute.name })
  } catch (err) { return next(err) }
}