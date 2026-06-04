import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    dob: { type: String, required: true }, // ISO date string from UI
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    instituteCode: { type: String, required: true, trim: true },

    // For demos: store as provided. For real systems, avoid storing raw Aadhaar/bank details.
    aadhar: { type: String, required: true, trim: true },
    bankIfsc: { type: String, required: true, trim: true },
    bankAccount: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },

    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

studentSchema.index({ email: 1 }, { unique: true })
studentSchema.index({ mobile: 1 }, { unique: true })

export const Student = mongoose.model('Student', studentSchema)
