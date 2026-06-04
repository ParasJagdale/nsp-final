import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoBar from '../components/LogoBar';
import { useState, useEffect } from 'react';

export default function InstituteApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/auth/institute/applications', { credentials: 'include' });
      const data = await res.json();
      setApps(data.apps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const statusColor = s =>
    s === 'InstitutePending' ? 'bg-yellow-100 text-yellow-700' :
    s === 'StatePending' ? 'bg-green-100 text-green-700' :
    'bg-red-100 text-red-700';

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/auth/institute/applications/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision: action === 'verify' ? 'approve' : 'reject' }),
      });
      if (!res.ok) throw new Error('Action failed');
      alert(action === 'verify' ? 'Application forwarded to State.' : 'Application rejected.');
      setReviewingId(null);
      fetchApps();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar userType="institute" onLogout={null} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-primary">Student Applications</h1>
        {loading ? <p>Loading applications...</p> : (
          <div className="space-y-3">
          {apps.map(app => (
            <div key={app._id} className="border rounded p-3 transition-all hover:border-primary bg-white">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{app.studentId?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500 truncate">{app.data?.scheme || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Aadhar: {app.studentId?.aadhar || 'N/A'}</p>
                  <p className="text-xs font-bold text-primary">App ID: {app.appId}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${statusColor(app.status)}`}>
                  {app.status === 'InstitutePending' ? 'Pending' : app.status}
                </span>
              </div>
              <button
                className="text-xs text-primary hover:underline mt-1"
                onClick={() => setReviewingId(reviewingId === app._id ? null : app._id)}
              >
                {reviewingId === app._id ? 'Hide Details' : 'View Application'}
              </button>
              {/* Inline review panel below application */}
              {reviewingId === app._id && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div className="font-bold text-sm text-primary mb-2">Student Application</div>
                  {/* Student Details */}
                  <div className="mb-3">
                    <div className="font-semibold">{app.studentId?.name}</div>
                    <div className="text-xs text-gray-500">{app.data?.scheme}</div>
                    <div className="text-xs text-gray-400 mb-2">ID: {app.appId}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div><span className="font-bold">Course:</span> {app.data?.presentClass}</div>
                      <div><span className="font-bold">Year:</span> {app.data?.classYear}</div>
                      <div><span className="font-bold">Category:</span> {app.data?.community}</div>
                      <div><span className="font-bold">Income:</span> ₹{app.data?.annualIncome}</div>
                    </div>
                  </div>
                  {/* Uploaded Documents */}
                  <div className="mb-3">
                    <div className="font-bold text-xs mb-1">Uploaded Documents</div>
                    <ul className="text-xs space-y-1">
                      <li><span className="font-semibold">Aadhaar:</span> <a href="#" className="text-primary underline">Preview</a> | <a href="#" className="text-primary underline">Download</a></li>
                      <li><span className="font-semibold">Income Certificate:</span> <a href="#" className="text-primary underline">Preview</a> | <a href="#" className="text-primary underline">Download</a></li>
                      <li><span className="font-semibold">Marksheet:</span> <a href="#" className="text-primary underline">Preview</a> | <a href="#" className="text-primary underline">Download</a></li>
                    </ul>
                  </div>
                  {/* Scholarship Details */}
                  <div className="mb-3">
                    <div className="font-bold text-xs mb-1">Scholarship Details</div>
                    <div className="text-xs">Scheme: {app.data?.scheme || 'N/A'}</div>
                    <div className="text-xs">Application ID: {app.appId}</div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button className="btn-primary flex-1" onClick={() => handleAction(app._id, 'verify')}>Approve</button>
                    <button className="btn-secondary flex-1" onClick={() => handleAction(app._id, 'reject')}>Reject</button>
                    <button className="border border-yellow-400 text-yellow-700 px-4 py-2 rounded flex-1 text-xs hover:bg-yellow-50 transition-colors" onClick={() => alert('Sent back for correction!')}>Send Back</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}