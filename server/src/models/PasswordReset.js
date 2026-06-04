import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

passwordResetSchema.index({ studentId: 1 })
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)
