import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function CheckStatus() {
  const [appId, setAppId] = useState('');
  const [status, setStatus] = useState(null);
  const handleCheck = async () => {
    if (!appId) return;
    try {
      const res = await fetch(`/api/auth/scholarship/status/${appId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(data.app.status === 'Approved' ? 'Scholarship Granted' : data.app.status);
    } catch (err) {
      alert(err.message);
      setStatus(null);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 to-green-100">
      <Navbar userType="student" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-8 border-yellow-400">
          <h1 className="text-2xl font-bold text-yellow-700 mb-2">Check Application Status</h1>
          <div className="mt-6 flex flex-col gap-4">
            <input
              className="form-input w-full text-center"
              placeholder="Enter Application ID"
              value={appId}
              onChange={e => setAppId(e.target.value)}
            />
            <button className="btn-primary w-full" onClick={handleCheck}>Check Status</button>
            {status && (
              <div className={`mt-4 text-lg font-semibold ${
                status === 'Scholarship Granted' ? 'text-green-600' : 
                status === 'Rejected' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                Status: {status.includes('Pending') ? 'Under Review' : status}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
