import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.status === 401) {
          if (!cancelled) setUnauthorized(true);
          return;
        }
        const data = await res.json();
        if (!cancelled) setStudent(data?.student ?? null);
      } catch {
        if (!cancelled) setUnauthorized(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const avatarName = useMemo(() => {
    const n = student?.name?.trim();
    return n ? encodeURIComponent(n) : 'Student';
  }, [student]);

  if (unauthorized) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-100">
      <Navbar userType="student" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-8 border-blue-500">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">My Profile</h1>
          <div className="flex flex-col items-center gap-4 mt-6">
            {loading ? (
              <div className="text-sm text-gray-500">Loading profile...</div>
            ) : (
              <>
                <img
                  src={`https://ui-avatars.com/api/?name=${avatarName}&background=22d3ee&color=fff&size=128`}
                  alt="Profile"
                  className="rounded-full w-28 h-28 border-4 border-blue-200 shadow"
                />
                <div className="text-lg font-semibold text-gray-800">{student?.name ?? '-'}</div>
                <div className="text-gray-600">{student?.email ?? '-'}</div>
              </>
            )}
            <div className="grid grid-cols-2 gap-3 w-full mt-4 text-left">
              <div><span className="font-medium">Aadhar:</span> {student?.aadhar ?? '-'}</div>
              <div><span className="font-medium">Gender:</span> {student?.gender ?? '-'}</div>
              <div><span className="font-medium">Institute Code:</span> {student?.instituteCode ?? '-'}</div>
              <div><span className="font-medium">DOB:</span> {student?.dob ?? '-'}</div>
              <div><span className="font-medium">State:</span> {student?.state ?? '-'}</div>
              <div><span className="font-medium">Mobile:</span> {student?.mobile ?? '-'}</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
