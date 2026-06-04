import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OfficerInstituteApprovals() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchApps = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/officer/institute-applications', { credentials: 'include' })
      const ct = res.headers.get('content-type') || ''
      let data = {}
      if (ct.includes('application/json')) data = await res.json()
      else throw new Error(`Server returned non-JSON response (status ${res.status})`)
      if (!res.ok) throw new Error(data.error || `Failed to load (${res.status})`)
      setApps(data.apps || [])
    } catch (err) {
      setError(err.message || 'Failed to load')
      console.error('Fetch institute apps error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApps() }, [])

  const decide = async (id, decision) => {
    try {
      const res = await fetch(`/api/auth/officer/institute/${id}/decision`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Action failed (${res.status})`)
      // refresh list
      fetchApps()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <h1 className="text-xl font-bold mb-4">State — Institute Registration Approvals</h1>
        {error && <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-800 rounded">{error}</div>}
        {loading && <div>Loading...</div>}
        {!loading && apps.length === 0 && <div className="text-gray-600">No pending institute applications found.</div>}
        <div className="space-y-4 mt-4">
          {apps.map(app => (
            <div key={app._id} className="border rounded p-4 flex flex-col sm:flex-row sm:justify-between gap-4">
              <div>
                <div className="font-semibold">{app.name} <span className="text-sm text-gray-500">({app.instId})</span></div>
                <div className="text-sm text-gray-600">State: {app.state} — District: {app.district} — Code: {app.code}</div>
                <div className="text-sm text-gray-600 mt-2">Principal: {app.principal} — Mobile: {app.mobile}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-primary px-4" onClick={() => decide(app._id, 'approve')}>Approve</button>
                <button className="btn-secondary px-4" onClick={() => decide(app._id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
