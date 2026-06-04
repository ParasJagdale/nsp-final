import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import ChildrenBanner from '../assets/ChildrenBanner.jpg';

export default function Login() {
  const [form, setForm] = useState({ uid: '', password: '', type: '' })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.uid || !form.password) return alert('Please fill all fields')

    const routes = { student: '/dashboard/student', institute: '/dashboard/institute', state: '/dashboard/state', ministry: '/dashboard/ministry' }

    setSubmitting(true)
    try {
      const endpoint =
        form.type === 'student'
          ? '/api/auth/login'
          : form.type === 'institute'
            ? '/api/auth/institute/login'
            : form.type === 'state' || form.type === 'ministry'
              ? '/api/auth/officer/login'
              : null

      if (!endpoint) {
        return navigate(routes.ministry)
      }

      const payload =
        form.type === 'student' || form.type === 'institute'
          ? { uid: form.uid, password: form.password }
          : { email: form.uid, password: form.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return alert(data?.error ?? 'Login failed')
      }

      navigate(routes[form.type])
    } catch {
      alert('Login failed (network error)')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      style={{
        backgroundImage: `url(${ChildrenBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <main className="flex-1 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <div className="rounded-2xl shadow-2xl border-t-4 border-primary bg-white/90 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">NSP</span>
              </div>
              <div>
                <h1 className="font-extrabold text-primary text-lg">National Scholarship Portal</h1>
                <p className="text-xs text-gray-500">Government of India</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="form-label">Login As</label>
                <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})} required>
                  <option value="" disabled>Select Role</option>
                  <option value="student">Student</option>
                  <option value="institute">Institute</option>
                  <option value="state">State Nodal Officer</option>
                  <option value="ministry">Ministry</option>
                </select>
              </div>
              <div>
                <label className="form-label">UID / Username</label>
                <input className="form-input" placeholder="Enter UID or Username" value={form.uid} onChange={e => setForm({...form, uid: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="Enter Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <Link to="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
              </div>
              <button type="submit" className="btn-primary w-full shadow" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
          {/* Registration Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <Link to="/register/student" className="btn-orange w-full text-center shadow">New Student - Registration</Link>
            <Link to="/register/institute" className="btn-primary w-full text-center shadow">New Institute Registration</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
