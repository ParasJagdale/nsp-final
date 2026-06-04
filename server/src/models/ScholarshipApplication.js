import mongoose from 'mongoose'

const ScholarshipSchema = new mongoose.Schema(
  {
    appId: { type: String, required: true, unique: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    instituteCode: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ['InstitutePending', 'StatePending', 'MinistryPending', 'Approved', 'Rejected'],
      default: 'InstitutePending',
      index: true,
    },
  },
  { timestamps: true }
)

export const ScholarshipApplication = mongoose.models.ScholarshipApplication || mongoose.model('ScholarshipApplication', ScholarshipSchema)
