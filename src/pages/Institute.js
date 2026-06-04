import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function InstituteProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/me/institute', {
          headers: {
            'Accept': 'application/json'
          },
          // Ensure cookies are sent even if there's a slight origin mismatch
          credentials: 'same-origin'
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `Error ${res.status}: Failed to fetch profile`)
        console.log('[Profile] Data received:', data.institute)
        setProfile(data.institute)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Error: {error}</div>
  if (!profile) return <div className="min-h-screen flex items-center justify-center">No profile found. Please login again.</div>

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value || 'Not Provided'}</span>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar userType="institute" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <div className="p-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
                  <span className="text-4xl text-primary">🏫</span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 text-center leading-tight mb-2">{profile.name}</h2>
                <p className="text-sm text-gray-500 font-medium mb-6">Institute ID: {profile.instId}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-3 h-3 rounded-full ${profile.status === 'Approved' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    profile.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {profile.status}
                  </span>
                </div>

                <div className="w-full pt-6 border-t border-gray-100 space-y-3">
                  <DetailRow label="AISHE Code" value={profile.code} />
                  <DetailRow label="Principal" value={profile.principal} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Information */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Info Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                <span className="text-2xl">📋</span>
                <h3 className="text-lg font-bold text-gray-800">Institute Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <DetailRow label="Category" value={profile.category} />
                <DetailRow label="Type" value={profile.type} />
                <DetailRow label="Location" value={profile.location} />
                <DetailRow label="University" value={profile.uniName} />
                <DetailRow label="Admission Year" value={profile.admissionYear} />
                <DetailRow label="DISE Code" value={profile.dise} />
              </div>
            </div>

            {/* Contact & Address Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                <span className="text-2xl">📍</span>
                <h3 className="text-lg font-bold text-gray-800">Contact & Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <DetailRow label="Mobile" value={profile.mobile} />
                <DetailRow label="Telephone" value={profile.telephone} />
                <DetailRow label="District" value={profile.district} />
                <DetailRow label="State" value={profile.state} />
                <div className="md:col-span-2 mt-2 bg-slate-50 p-4 rounded-xl">
                   <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Registered Address</span>
                   <p className="text-sm text-gray-700 leading-relaxed">
                     {profile.address?.addr1}, {profile.address?.addr2}<br/>
                     {profile.address?.city}, {profile.address?.addrState} - {profile.address?.pincode}
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}