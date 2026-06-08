import { useState } from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const updates = [
  'Last date to apply for Post Matric Scholarship 2024-25: 31st Dec 2024',
  'NTSE applications open for Class IX students',
  'Pragati Scholarship for Girls: Apply before 15th Jan 2025',
  'Merit-cum-Means Scholarship: Results declared for 2023-24',
  'New scheme announced for Minority students',
]


export default function Home() {
  const [checkAppId, setCheckAppId] = useState('');
  const [checkStatus, setCheckStatus] = useState(null);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!checkAppId) return;
    try {
      const res = await fetch(`/api/auth/scholarship/status/${checkAppId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check status');
      setCheckStatus(data.app.status === 'Approved' ? 'Scholarship Granted' : data.app.status);
    } catch (err) {
      alert(err.message);
      setCheckStatus(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-300 to-green-700 text-white py-3 px-4 text-center text-xs sm:text-sm font-medium">
        Scholarships for Students | Empowering Education | Government of India Initiative
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Latest Updates + Helpdesk */}
        <div className="flex flex-col gap-4">
          <div className="card border-l-4 border-primary">
            <h2 className="section-title">Latest Updates</h2>
            <ul className="space-y-2">
              {updates.map((u, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700">
                  <span className="text-secondary font-bold mt-0.5 flex-shrink-0">▶</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Dates Section */}
          <div className="card border-l-4 border-blue-400">
            <h2 className="section-title" style={{borderColor:'#60a5fa', color:'#2563eb'}}>Important Dates</h2>
            <ul className="text-xs text-gray-700 space-y-2">
              <li><span className="font-semibold text-blue-600">31st Dec 2024:</span> Last date for Post Matric Scholarship applications</li>
              <li><span className="font-semibold text-blue-600">15th Jan 2025:</span> Pragati Scholarship for Girls deadline</li>
              <li><span className="font-semibold text-blue-600">10th Nov 2024:</span> NTSE Application closes</li>
              <li><span className="font-semibold text-blue-600">15th Feb 2025:</span> Central Scholarship Scheme deadline</li>
            </ul>
          </div>

          {/* Quick Status Checker Section */}
          <div className="card border-l-4 border-green-400">
            <h2 className="section-title" style={{borderColor:'#34d399', color:'#059669'}}>Quick Status Checker</h2>
            <form className="flex flex-col gap-2 mt-2" onSubmit={handleCheckStatus}>
              <label htmlFor="appid" className="text-xs font-semibold text-gray-600">Enter Application ID</label>
              <input id="appid" name="appid" className="form-input" placeholder="e.g. NSP2024XXXXXX" required value={checkAppId} onChange={e => setCheckAppId(e.target.value)} />
              <button type="submit" className="btn-primary mt-2">Check Status</button>
            </form>
            {checkStatus && (
              <div className={`mt-3 text-sm font-bold p-2 rounded text-center ${
                checkStatus === 'Scholarship Granted' ? 'bg-green-100 text-green-700' : 
                checkStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                Status: {checkStatus.includes('Pending') ? 'Under Review' : checkStatus}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">Track your scholarship application status instantly.</div>
          </div>
          <div className="card border-l-4 border-secondary">
            <h2 className="section-title" style={{color:'#f97316', borderColor:'#f97316'}}>Helpdesk</h2>
            <p className="text-xs text-gray-600 mb-2">For technical issues or queries:</p>
            <p className="text-xs font-semibold">📞 Toll Free: 1800-XXX-XXXX</p>
            <p className="text-xs font-semibold">✉ helpdesk@nsp.gov.in</p>
            <p className="text-xs text-gray-500 mt-2">Mon–Fri: 9:00 AM – 6:00 PM</p>
          </div>
        </div>

        {/* Center: Portal Description + Schemes */}
        <div className="card">
          <h2 className="section-title">About the Portal</h2>
          <p className="text-sm text-gray-600 mb-4">
            The National Scholarship Portal is a one-stop solution for students to apply for various government scholarships.
            It streamlines the process from application to disbursement, ensuring transparency and efficiency.
          </p>
          <h3 className="font-bold text-sm text-primary mb-3">Available Scholarship Schemes</h3>
          <div className="space-y-3">
            <div className="border rounded-xl p-5 bg-green-50 border-green-200 flex flex-col gap-2 items-start shadow-sm">
              <p className="text-base font-semibold text-gray-800">Post Matric Scholarship (Merit-cum-Means)</p>
              <span className="text-xs text-gray-500">SC/ST/OBC/Minority</span>
              <button
                className="btn-primary mt-2 text-xs px-4 py-1 self-end"
                onClick={() => window.location.href = '/post-matric-scholarship'}
              >
                Know more
              </button>
            </div>
            <div className="border rounded-xl p-5 bg-blue-50 border-blue-200 flex flex-col gap-2 items-start shadow-sm">
              <p className="text-base font-semibold text-gray-800">Pragati Scholarship for Girls</p>
              <span className="text-xs text-gray-500">Girls | Income &lt; ₹8L/yr</span>
              <button
                className="btn-primary mt-2 text-xs px-4 py-1 self-end"
                onClick={() => window.location.href = '/pragati-scholarship'}
              >
                Know more
              </button>
            </div>
            <div className="border rounded-xl p-5 bg-orange-50 border-orange-200 flex flex-col gap-2 items-start shadow-sm">
              <p className="text-base font-semibold text-gray-800">NTSE – National Talent Search</p>
              <span className="text-xs text-gray-500">Merit Based | Class IX</span>
              <button
                className="btn-primary mt-2 text-xs px-4 py-1 self-end"
                onClick={() => window.location.href = '/ntse-scholarship'}
              >
                Know more
              </button>
            </div>
            <div className="border rounded-xl p-5 bg-purple-50 border-purple-200 flex flex-col gap-2 items-start shadow-sm">
              <p className="text-base font-semibold text-gray-800">National Merit Scholarship</p>
              <span className="text-xs text-gray-500">Merit Based</span>
              <button
                className="btn-primary mt-2 text-xs px-4 py-1 self-end"
                onClick={() => window.location.href = '/national-merit-scholarship'}
              >
                Know more
              </button>
            </div>
            <div className="border rounded-xl p-5 bg-yellow-50 border-yellow-200 flex flex-col gap-2 items-start shadow-sm">
              <p className="text-base font-semibold text-gray-800">Central Scholarship Scheme</p>
              <span className="text-xs text-gray-500">Central Govt.</span>
              <button
                className="btn-primary mt-2 text-xs px-4 py-1 self-end"
                onClick={() => window.location.href = '/central-scholarship'}
              >
                Know more
              </button>
            </div>
          </div>
        </div>

        {/* Right: Login Panel */}
        <div className="card border-t-4 border-primary">
          <h2 className="section-title">Login</h2>
          <br/>
          <br/>
          <Login />
        </div>
      </main>


      {/* Numbers Data Section */}
      <section className="max-w-7xl mx-auto w-full px-4 py-10 mb-8 bg-white rounded-xl shadow-lg border-4 border-primary">
        <h2 className="text-lg md:text-2xl font-bold text-primary mb-8 text-center tracking-widest uppercase">Numbers at a glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-primary">2.1M+</span>
            <span className="text-xs text-gray-500 mt-1">Students Registered</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-primary">₹850Cr+</span>
            <span className="text-xs text-gray-500 mt-1">Scholarships Disbursed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-primary">12,000+</span>
            <span className="text-xs text-gray-500 mt-1">Institutes Onboarded</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-primary">35+</span>
            <span className="text-xs text-gray-500 mt-1">Scholarship Schemes</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}