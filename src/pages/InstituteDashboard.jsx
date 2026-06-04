import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockApplications = [
  { id: 'APP001', name: 'Rahul Sharma', scheme: 'Post Matric Scholarship', aadhar: 'XXXX-XXXX-1234', status: 'Pending' },
  { id: 'APP002', name: 'Priya Patel', scheme: 'Pragati Scholarship', aadhar: 'XXXX-XXXX-5678', status: 'Pending' },
  { id: 'APP003', name: 'Amit Kumar', scheme: 'NTSE', aadhar: 'XXXX-XXXX-9012', status: 'Pending' },
]

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Applications',
      data: [10, 14, 12, 9, 11],
      backgroundColor: 'rgba(34,197,94,0.7)',
      borderRadius: 6,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Monthly Applications' },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 2 } },
  },
};

export default function InstituteDashboard() {
  const [apps, setApps] = useState(mockApplications)
  const [selected, setSelected] = useState(null)
  const [bonafide, setBonafide] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate();

  const handleAction = (id, action) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: action === 'verify' ? 'Forwarded to State' : 'Rejected' } : a))
    setSelected(null)
    alert(action === 'verify' ? 'Application forwarded to State Nodal Officer.' : 'Application rejected.')
  }

  const statusColor = s =>
    s === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
    s === 'Forwarded to State' ? 'bg-green-100 text-green-700' :
    'bg-red-100 text-red-700'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="institute" onLogout={null} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden w-full mb-4 btn-secondary text-xs"
          onClick={() => setSidebarOpen(o => !o)}
        >
          {sidebarOpen ? 'Hide Institute Info ▲' : 'Show Institute Info ▼'}
        </button>

        {/* Summary Cards */}
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-blue-500">
              <span className="text-2xl">📄</span>
              <div className="text-xs text-gray-500 mt-1">Total Applications</div>
              <div className="text-xl font-bold text-blue-700">{apps.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-yellow-400">
              <span className="text-2xl">⏳</span>
              <div className="text-xs text-gray-500 mt-1">Pending Verification</div>
              <div className="text-xl font-bold text-yellow-600">{apps.filter(a => a.status === 'Pending').length}</div>
            </div>
            <div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-green-500">
              <span className="text-2xl">✅</span>
              <div className="text-xs text-gray-500 mt-1">Approved</div>
              <div className="text-xl font-bold text-green-700">{apps.filter(a => a.status === 'Forwarded to State').length}</div>
            </div>
            <div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-red-500">
              <span className="text-2xl">❌</span>
              <div className="text-xs text-gray-500 mt-1">Rejected</div>
              <div className="text-xl font-bold text-red-700">{apps.filter(a => a.status === 'Rejected').length}</div>
            </div>
          </div>
        </div>

        {/* Main grid: Sidebar | Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className={`lg:col-span-3 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="card border-l-4 border-primary mb-6">
              <div className="mb-4">
                <p className="font-bold text-sm text-primary">Government Polytechnic</p>
                <p className="text-xs text-gray-500">Institute Code: INST001</p>
              </div>
              <nav className="space-y-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors"
                  onClick={() => navigate('/dashboard/institute/applications')}
                >
                  View Student Applications
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors"
                  onClick={() => navigate('/dashboard/institute/profile')}
                >
                  Institute Profile
                </button>
                <Link to="/" className="w-full block text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors">Logout</Link>
              </nav>
            </div>
          </div>

          {/* Reports & Analytics - fills remaining area */}
          <div className="lg:col-span-9">
            <div className="card h-full flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-primary mb-6">Reports & Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="font-bold text-sm mb-1">Applications per Scheme</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>Post Matric Scholarship: 12</li>
                    <li>Pragati Scholarship: 8</li>
                    <li>NTSE: 5</li>
                    <li>National Merit Scholarship: 7</li>
                    <li>Central Scholarship Scheme: 4</li>
                  </ul>
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Approval Rate</div>
                  <div className="text-2xl font-bold text-green-600">82%</div>
                  <div className="text-xs text-gray-500">(Current Month)</div>
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Monthly Trends</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>Jan: 10</li>
                    <li>Feb: 14</li>
                    <li>Mar: 12</li>
                    <li>Apr: 9</li>
                    <li>May: 11</li>
                  </ul>
                </div>
              </div>
              {/* Sample Bar Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

}
