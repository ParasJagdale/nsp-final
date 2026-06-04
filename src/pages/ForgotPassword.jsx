import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ForgotPassword() {
  const [stage, setStage] = useState('request') // request, verify, reset
  const [uid, setUid] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

const handleRequest = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    const res = await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    })

    console.log("STATUS:", res.status)   // ✅ ADD THIS

    const data = await res.json().catch(() => ({}))
    console.log("RESPONSE DATA:", data) // ✅ ADD THIS
    console.log("OTP:", data.otp)

    if (!res.ok) return alert(data?.error ?? 'Request failed')

    alert('OTP sent to the registered email')
    setStage('verify')
  } catch (err) {
    console.error("ERROR:", err) // ✅ ADD THIS
    alert('Request failed')
  } finally {
    setLoading(false)
  }
}
  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, otp }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return alert(data?.error ?? 'Verification failed')
      setResetToken(data.resetToken)
      setStage('reset')
    } catch {
      alert('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) return alert('Password too short')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return alert(data?.error ?? 'Reset failed')
      alert('Password reset successful — please login')
      navigate('/login')
    } catch {
      alert('Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-lg mb-6">Forgot Password</h1>

          {stage === 'request' && (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="form-label">Email / Mobile / Aadhar</label>
                <input className="form-input" value={uid} onChange={e => setUid(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
            </form>
          )}

          {stage === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="form-label">Enter OTP</label>
                <input className="form-input" value={otp} onChange={e => setOtp(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            </form>
          )}

          {stage === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </form>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
