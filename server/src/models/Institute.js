import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
  addr1: { type: String },
  addr2: { type: String },
  city: { type: String },
  addrState: { type: String },
  addrDistrict: { type: String },
  pincode: { type: String },
})

const InstituteSchema = new mongoose.Schema(
  {
    instId: { type: String, required: true, unique: true, index: true },
    category: { type: String },
    name: { type: String },
    state: { type: String },
    district: { type: String },
    code: { type: String },
    dise: { type: String },
    location: { type: String },
    type: { type: String },
    uniState: { type: String },
    uniName: { type: String },
    admissionYear: { type: String },
    passwordHash: { type: String },
    address: AddressSchema,
    principal: { type: String },
    mobile: { type: String },
    telephone: { type: String },
    status: { type: String, default: 'Pending', index: true },
  },
  { timestamps: true }
)

export const Institute = mongoose.models.Institute || mongoose.model('Institute', InstituteSchema)
