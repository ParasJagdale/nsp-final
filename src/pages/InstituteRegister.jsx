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
const years = Array.from({length:30}, (_,i) => 2024 - i)

export default function InstituteRegister() {
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [codeError, setCodeError] = useState('')
  const [diseError, setDiseError] = useState('')
  const [pincodeError, setPincodeError] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [form, setForm] = useState({
    category:'', name:'', state:'', district:'', code:'', dise:'', location:'Rural',
    type:'', uniState:'', uniName:'', admissionYear:'', password:'', confirmPassword:'',
    estCert: null, affCert: null,
    addr1:'', addr2:'', city:'', addrState:'', addrDistrict:'', pincode:'',
    principal:'', mobile:'', telephone:'', agree: false
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.agree) return alert('Please accept the declaration')
    if (!/^NSP\d{3}$/.test(form.code)) return alert('Institute Code must be NSP followed by 3 digits (e.g., NSP001)')
    if (form.password !== form.confirmPassword) return alert('Passwords do not match')

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register/institute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      // Safely parse JSON; if response is HTML (e.g. dev server 404 page), show readable error
      let data = {}
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        data = await res.json().catch(() => ({}))
      } else {
        const text = await res.text().catch(() => '')
        // include first 400 chars to avoid huge alerts
        throw new Error(`Server returned non-JSON response (status ${res.status}): ${text.slice(0, 400)}`)
      }
      if (!res.ok) throw new Error(data.error || `Registration failed (status ${res.status})`)

      alert(`Success! Institute ID ${data.instId} generated. It will be reviewed by the State Nodal Officer.`)
      setRedirect(true)
    } catch (err) {
      // show a concise inline error for better UX (and keep console for dev details)
      setError(err.message || 'Registration failed')
      console.error('Institute registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {redirect && <Navigate to="/" replace />}
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-800 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-6 uppercase tracking-wide">
            Institute Registration Request Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* BASIC DETAILS */}
            <section>
              <h2 className="section-title">Basic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Institute Category *</label>
                  <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">-- Select --</option>
                    <option>Government</option>
                    <option>Government Aided</option>
                    <option>Private Unaided</option>
                    <option>Autonomous</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Institute Name *</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">State *</label>
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
                  <label className="form-label">Institute Code *</label>
                  <input
                    className={`form-input ${codeError ? 'border-red-500' : ''}`}
                    maxLength={6}
                    placeholder="e.g. NSP001"
                    value={form.code}
                    onChange={e => {
                      const val = e.target.value.toUpperCase(); // Force uppercase
                      set('code', val);
                      if (val.length > 0 && !/^NSP\d{3}$/.test(val)) {
                        setCodeError('Format: NSP followed by 3 digits (e.g. NSP001)');
                      } else {
                        setCodeError('');
                      }
                    }}
                    required
                  />
                  {codeError && <div className="text-xs text-red-600 mt-1">{codeError}</div>}
                </div>
                <div>
                  <label className="form-label">DISE (District Information System for Education) Code *</label>
                  <input className={`form-input ${diseError ? 'border-red-500' : ''}`} maxLength={11} pattern="\d{11}" value={form.dise} onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    set('dise', val);
                    if (val.length > 0 && val.length !== 11) setDiseError('DISE Code must be exactly 11 digits');
                    else setDiseError('');
                  }} required />
                  {diseError && (
                    <div className="text-xs text-red-600 mt-1">{diseError}</div>
                  )}
                </div>
                <div>
                  <label className="form-label">Location *</label>
                  <div className="flex gap-6 mt-2">
                    {['Rural','Urban'].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="location" value={l} checked={form.location === l} onChange={() => set('location', l)} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Institute Type *</label>
                  <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)} required>
                    <option value="">-- Select --</option>
                    <option>Engineering</option>
                    <option>Medical</option>
                    <option>Arts & Science</option>
                    <option>Polytechnic</option>
                    <option>Management</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Affiliated University State *</label>
                  <select className="form-select" value={form.uniState} onChange={e => set('uniState', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Affiliated University / Board Name *</label>
                  <input className="form-input" placeholder="e.g. University of Mumbai, CBSE etc." value={form.uniName} onChange={e => set('uniName', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Year Admission Started *</label>
                  <select className="form-select" value={form.admissionYear} onChange={e => set('admissionYear', e.target.value)} required>
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
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
            </section>

            {/* PROOF OF EXISTENCE */}
            <section>
              <h2 className="section-title">Proof of Existence of Institute</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 border rounded p-3">
                  <span className="text-xs text-gray-600 uppercase tracking-wide">Institute Establishment / Registration Certificate *</span>
                  <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
                    <input type="file" className="hidden" onChange={e => set('estCert', e.target.files[0])} />
                    <span className="border border-gray-400 text-xs px-4 py-1.5 rounded hover:bg-gray-100 block text-center">
                      {form.estCert ? form.estCert.name : 'Upload'}
                    </span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 border rounded p-3">
                  <span className="text-xs text-gray-600 uppercase tracking-wide">University / Board Affiliation Certificate *</span>
                  <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
                    <input type="file" className="hidden" onChange={e => set('affCert', e.target.files[0])} />
                    <span className="border border-gray-400 text-xs px-4 py-1.5 rounded hover:bg-gray-100 block text-center">
                      {form.affCert ? form.affCert.name : 'Upload'}
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* ADDRESS */}
            <section>
              <h2 className="section-title">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">Line 1 *</label><input className="form-input" value={form.addr1} onChange={e => set('addr1', e.target.value)} required /></div>
                <div><label className="form-label">Line 2</label><input className="form-input" value={form.addr2} onChange={e => set('addr2', e.target.value)} /></div>
                <div><label className="form-label">City *</label><input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} required /></div>
                <div>
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.addrState} onChange={e => set('addrState', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">District *</label>
                  <select className="form-select" value={form.addrDistrict} onChange={e => set('addrDistrict', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Pincode *</label>
                  <input className={`form-input ${pincodeError ? 'border-red-500' : ''}`} maxLength={6} pattern="\d{6}" value={form.pincode} onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    set('pincode', val);
                    if (val.length > 0 && val.length !== 6) setPincodeError('Pincode must be exactly 6 digits');
                    else setPincodeError('');
                  }} required />
                  {pincodeError && <div className="text-xs text-red-600 mt-1">{pincodeError}</div>}
                </div>
              </div>
            </section>

            {/* CONTACT DETAILS */}
            <section>
              <h2 className="section-title">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">Principal Name *</label><input className="form-input" value={form.principal} onChange={e => set('principal', e.target.value)} required /></div>
                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input className={`form-input ${mobileError ? 'border-red-500' : ''}`} maxLength={10} pattern="\d{10}" value={form.mobile} onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    set('mobile', val);
                    if (val.length > 0 && val.length !== 10) setMobileError('Mobile Number must be exactly 10 digits');
                    else setMobileError('');
                  }} required />
                  {mobileError && <div className="text-xs text-red-600 mt-1">{mobileError}</div>}
                </div>
                <div>
                  <label className="form-label">Telephone</label>
                  {/* onChange dynamically prevents entering alphabets/symbols, pattern ensures strictly numerical submission */}
                  <input className="form-input" pattern="\d*" value={form.telephone} onChange={e => set('telephone', e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>
            </section>

            {/* DECLARATION */}
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0" checked={form.agree} onChange={e => set('agree', e.target.checked)} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the details and documents submitted by us are valid and true. If found guilty of submitting invalid documents, we may be held responsible for that act by us.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" className="btn-primary w-full sm:w-auto px-10" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="reset" className="btn-secondary w-full sm:w-auto px-10" disabled={loading}>Reset</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
