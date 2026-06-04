import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'

import { env } from './utils/env.js'
import { connectDb } from './utils/db.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import mongoose from 'mongoose'
import { Officer } from './models/Officer.js'

async function main() {
  const app = express()

  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true,
    })
  )

  app.use(helmet())
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    })
  )

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  // Return JSON 503 while DB is not connected to avoid HTML errors and failed DB ops
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Service temporarily unavailable (db disconnected)' })
      }
    }
    return next()
  })

  app.use('/api/auth', authRouter)
  app.use('/api/me', meRouter)

  // Basic error handler
  app.use((err, _req, res, _next) => {
    console.error(err)
    const payload = {
      error: 'Internal Server Error',
    }
    if (env.nodeEnv !== 'production') {
      payload.details = err.message
      if (err.stack) payload.stack = err.stack.split('\n').slice(0, 5)
    }
    res.status(500).json(payload)
  })

  // Start listening immediately so the proxy doesn't fail with ECONNREFUSED
  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`API listening on http://0.0.0.0:${env.port}`)
  })

  await connectDb()

  // Seed Nodal Officer credentials
  try {
    const passwordHash = await bcrypt.hash('admin123', 12)
    const officers = [
      {
        email: 'stateoffice@gmail.com',
        name: 'State Officer',
        role: 'state_officer'
      },
      {
        email: 'centraloffice@gmail.com',
        name: 'Ministry Officer',
        role: 'ministry_officer'
      }
    ]

    for (const off of officers) {
      const existing = await Officer.findOne({ email: off.email })
      if (!existing) {
        await Officer.create({ ...off, passwordHash })
        console.log(`Officer seeded: ${off.email}`)
      }
    }
  } catch (err) {
    console.error('Seeding failed:', err)
  }

  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error', err)
  })

  process.on('SIGTERM', () => {
    server.close(() => {
      mongoose.disconnect()
    })
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
