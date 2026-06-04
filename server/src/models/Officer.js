import mongoose from 'mongoose'

const OfficerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: { type: String, default: 'state_officer' },
  },
  { timestamps: true }
)

export const Officer = mongoose.models.Officer || mongoose.model('Officer', OfficerSchema)
