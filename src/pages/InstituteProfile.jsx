import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoBar from '../components/LogoBar';
import { useState, useEffect } from 'react';

export default function InstituteProfile() {
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me/institute', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setInstitute(data.institute);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  if (!institute) return <div className="min-h-screen flex items-center justify-center">Failed to load profile.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar userType="institute" onLogout={null} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow">
            <span className="text-4xl">🏫</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary mb-1 tracking-tight">{institute.name}</h1>
          <div className="text-gray-500 font-medium">Institute Profile</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Institute Code</div>
                <div className="text-lg font-bold text-blue-900">{institute.instId}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Type</div>
                <div className="text-base text-gray-700">{institute.type || 'N/A'}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">State</div>
                <div className="text-base text-gray-700">{institute.state || 'N/A'}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">District</div>
                <div className="text-base text-gray-700">{institute.district || 'N/A'}</div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Address</div>
                <div className="text-base text-gray-700">
                  {[institute.address?.addr1, institute.address?.addr2, institute.address?.city, institute.address?.addrState, institute.address?.pincode].filter(Boolean).join(', ') || 'N/A'}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Contact Mobile</div>
                <div className="text-base text-gray-700">{institute.mobile || 'N/A'}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Principal</div>
                <div className="text-base text-gray-700">{institute.principal || 'N/A'}</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <button className="px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-dark transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
