import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const states = ['Maharashtra']
const districts = [
  "Ahmednagar (Ahilyanagar)",
  "Akola",
  "Amravati",
  "Aurangabad (Chhatrapati Sambhajinagar)",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad (Dharashiv)",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal"
]

export default function StudentRegister() {
  const [redirect, setRedirect] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    state: '', district: '', name: '', dob: '', gender: '', mobile: '',
    email: '', instituteCode: '', aadhar: '', bankIfsc: '', bankAccount: '',
    bankName: '', password: '', confirmPassword: '', agree: false
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.agree) return alert('Please accept the declaration')
    if (form.password !== form.confirmPassword) return alert('Passwords do not match')

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          state: form.state,
          district: form.district,
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          mobile: form.mobile,
          email: form.email,
          instituteCode: form.instituteCode,
          aadhar: form.aadhar,
          bankIfsc: form.bankIfsc,
          bankAccount: form.bankAccount,
          bankName: form.bankName,
          password: form.password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return alert(data?.error ?? 'Registration failed')
      }

      alert('Registration successful! Please login to continue.')
      setRedirect(true)
    } catch {
      alert('Registration failed (network error)')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {redirect && <Navigate to="/" replace />}
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-6 uppercase tracking-wide">
            Fresh Student Registration Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">State of Domicile *</label>
                <select className="form-select" value={form.state} onChange={e => set('state', e.target.value)} required>
                  <option value="">-- Select State --</option>
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">District *</label>
                <select className="form-select" value={form.district} onChange={e => set('district', e.target.value)} required>
                  <option value="">-- Select District --</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Name (as in Mark Sheets) *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input type="date" className="form-input" value={form.dob} onChange={e => set('dob', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Gender *</label>
                <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)} required>
                  <option value="">-- Select --</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" maxLength={10} value={form.mobile} onChange={e => set('mobile', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Email ID *</label>
                <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Institute Code *</label>
                <input className="form-input" value={form.instituteCode} onChange={e => set('instituteCode', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Aadhar Number *</label>
                <input className="form-input" maxLength={12} value={form.aadhar} onChange={e => set('aadhar', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Bank IFSC Code *</label>
                <input className="form-input" value={form.bankIfsc} onChange={e => set('bankIfsc', e.target.value)} pattern="^[A-Za-z]{4}0[A-Za-z0-9]{6}$" placeholder="e.g. SBIN0001234" required />
              </div>
              <div>
                <label className="form-label">Bank Account Number *</label>
                <input className="form-input" value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Bank Name *</label>
                <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Set Password *</label>
                <input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Confirm Password *</label>
                <input type="password" className="form-input" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
              </div>
            </div>

            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0" checked={form.agree} onChange={e => set('agree', e.target.checked)} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the above information furnished by me is true to the best of my knowledge.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" className="btn-primary w-full sm:w-auto px-10" disabled={submitting}>
                {submitting ? 'Registering...' : 'Register'}
              </button>
              <button type="reset" className="btn-secondary w-full sm:w-auto px-10"
                onClick={() => setForm({state:'',district:'',name:'',dob:'',gender:'',mobile:'',email:'',instituteCode:'',aadhar:'',bankIfsc:'',bankAccount:'',bankName:'',password:'',confirmPassword:'',agree:false})}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
