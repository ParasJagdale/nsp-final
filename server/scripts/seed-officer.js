import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { env } from '../src/utils/env.js'
import { Officer } from '../src/models/Officer.js'

async function main() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 })
  const password = 'admin123'
  const hash = await bcrypt.hash(password, 12)

  const officers = [
    { email: 'StateOffice@gmail.com', name: 'State Nodal Officer', role: 'state_officer' },
    { email: 'CentralOffice@gmail.com', name: 'Central Ministry Officer', role: 'ministry_officer' },
  ]

  for (const item of officers) {
    const email = item.email.toLowerCase()
    const existing = await Officer.findOne({ email })
    if (existing) {
      console.log('Officer already exists:', existing.email)
      continue
    }
    const officer = await Officer.create({ email, passwordHash: hash, name: item.name, role: item.role })
    console.log('Created officer:', officer.email)
  }
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
