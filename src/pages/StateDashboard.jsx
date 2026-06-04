import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Badge = ({ status }) => {
  const c = status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            status === 'MinistryPending' || status === 'StatePending' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
  return <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c}`}>{status === 'MinistryPending' ? 'Forwarded to Ministry' : status === 'StatePending' ? 'Pending' : status}</span>
}

export default function StateDashboard() {
  const [tab, setTab] = useState('institutes')
  const [studentApps, setStudentApps] = useState([])
  const [instApps, setInstApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (tab === 'students') {
      setLoading(true);
      fetch('/api/auth/officer/scholarship-applications', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setStudentApps(data.apps || []))
        .finally(() => setLoading(false));
    }
    if (tab === 'institutes') {
      setLoading(true)
      setAuthError(false)
      setError(null)
      fetch('/api/auth/officer/institute-applications', { credentials: 'include' })
        .then(async res => {
          if (res.status === 401) {
            setAuthError(true)
            return { apps: [] }
          }
          const ct = res.headers.get('content-type') || ''
          if (!ct.includes('application/json')) {
            throw new Error(`Invalid server response (status ${res.status})`)
          }
          return res.json()
        })
        .then(data => setInstApps((data.apps || []).map(app => ({
          ...app,
          status: app.status === 'StatePending' ? 'Forwarded to Ministry' : app.status,
        }))))
        .catch(err => {
          console.error('Failed to load institute apps', err)
          setError(err.message || 'Failed to load')
        })
        .finally(() => setLoading(false))
    }
  }, [tab])

  const handleStudentAction = async (id, action) => {
    try {
      const res = await fetch(`/api/auth/officer/scholarship/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision: action === 'forward' ? 'approve' : 'reject' }),
      });
      if (!res.ok) throw new Error('Action failed');
      alert(action === 'forward' ? 'Application forwarded to Ministry.' : 'Application rejected.');
      // Refresh list
      setStudentApps(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInstAction = async (id, action) => {
    try {
      const endpoint = action === 'forward'
        ? `/api/auth/officer/institute/${id}/forward`
        : `/api/auth/officer/institute/${id}/decision`

      const body = action === 'forward' ? {} : { decision: 'reject' }
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Action failed')

      setInstApps(prev => prev.map(a => a._id === id
        ? { ...a, status: action === 'forward' ? 'Forwarded to Ministry' : 'Rejected' }
        : a))
      alert(action === 'forward' ? 'Institute registration forwarded to Ministry.' : 'Registration rejected.')
    } catch (err) {
      alert(err.message || 'Action failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="state" onLogout={null} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="card">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="font-bold text-primary text-lg">State Nodal Officer Dashboard</h1>
              <p className="text-xs text-gray-500">Maharashtra State</p>
            </div>
            <Link to="/" className="btn-secondary text-xs w-full sm:w-auto text-center">Logout</Link>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {['students', 'institutes'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {t === 'students' ? 'Student Applications' : 'Institute Registrations'}
              </button>
            ))}
          </div>

          {tab === 'students' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h2 className="section-title mb-0">Student Applications (Forwarded by Institutes)</h2>
                <button className="btn-primary text-xs px-4 py-1 w-full sm:w-auto">Fetch Forms</button>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {studentApps.map(app => (
                  <div key={app._id} className="border rounded p-3 bg-white">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-sm">{app.studentId?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{app.data?.scheme || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{app.instituteId?.name || app.instituteCode}</p>
                        <p className="text-xs text-gray-400">ID: {app.appId}</p>
                      </div>
                      <Badge status={app.status} />
                    </div>
                    {app.status === 'StatePending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStudentAction(app._id, 'forward')}
                          className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700">Forward</button>
                        <button onClick={() => handleStudentAction(app._id, 'reject')}
                          className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded hover:bg-red-600">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white text-xs">
                      {['App ID','Student Name','Scheme','Institute','Status','Actions'].map(h => (
                        <th key={h} className="px-3 py-2 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentApps.map((app, i) => (
                      <tr key={app._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{app.appId}</td>
                        <td className="px-3 py-2 text-xs font-medium">{app.studentId?.name}</td>
                        <td className="px-3 py-2 text-xs">{app.data?.scheme}</td>
                        <td className="px-3 py-2 text-xs">{app.instituteId?.name || app.instituteCode}</td>
                        <td className="px-3 py-2"><Badge status={app.status} /></td>
                        <td className="px-3 py-2">
                          {app.status === 'StatePending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStudentAction(app._id, 'forward')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Forward</button>
                              <button onClick={() => handleStudentAction(app._id, 'reject')}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'institutes' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h2 className="section-title mb-0">Institute Registration Applications</h2>
                <button className="btn-primary text-xs px-4 py-1 w-full sm:w-auto">Fetch Forms</button>
              </div>
              
              {loading && <p className="text-sm py-4">Loading applications...</p>}
              {authError && (
                <div className="p-3 border rounded bg-yellow-50 text-sm text-yellow-800">
                  You are not signed in as a State Nodal Officer. Please <a href="/login" className="underline">login</a> with your officer account to view pending institute registrations.
                </div>
              )}
              {error && <p className="text-sm py-4 text-red-700">Error: {error}</p>}
              {!loading && !authError && instApps.length === 0 && <p className="text-sm py-4">No pending registrations.</p>}

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {instApps.map(app => (
                  <div key={app._id} className="border rounded p-3 bg-white">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-sm">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.district} · {app.type}</p>
                        <p className="text-xs text-gray-400">ID: {app.instId}</p>
                      </div>
                      <Badge status={app.status} />
                    </div>
                    {app.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleInstAction(app._id, 'forward')}
                          className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700">Forward</button>
                        <button onClick={() => handleInstAction(app._id, 'reject')}
                          className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded hover:bg-red-600">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white text-xs">
                      {['Inst. ID','Institute Name','District','Type','Status','Actions'].map(h => (
                        <th key={h} className="px-3 py-2 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {instApps.map((app, i) => (
                      <tr key={app._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{app.instId}</td>
                        <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                        <td className="px-3 py-2 text-xs">{app.district}</td>
                        <td className="px-3 py-2 text-xs">{app.type}</td>
                        <td className="px-3 py-2"><Badge status={app.status} /></td>
                        <td className="px-3 py-2">
                          {app.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleInstAction(app._id, 'forward')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Forward</button>
                              <button onClick={() => handleInstAction(app._id, 'reject')}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
