import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ApplicationSuccess() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-100">
      <Navbar userType="student" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-8 border-green-500 animate-fade-in">
          <svg
            className="mx-auto mb-4 animate-scaleup"
            width="64" height="64" fill="none" viewBox="0 0 64 64"
            style={{ animation: 'scaleup 0.7s cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <circle cx="32" cy="32" r="32" fill="#22c55e" />
            <path d="M18 34l10 10 18-18" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h1>
          <p className="text-gray-700 mb-6">Your scholarship application has been successfully submitted.<br/>It will be forwarded to your institute for verification.<br/>Thank you for applying!</p>
          <div className="flex flex-col gap-3">
            <button
              className="btn-primary w-full"
              onClick={() => navigate('/dashboard/student')}
            >
              Go to Dashboard
            </button>
            <button
              className="btn-secondary w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
      {/* Animation keyframes for scaleup */}
      <style>{`
        @keyframes scaleup {
          0% { transform: scale(0.2); opacity: 0.2; }
          60% { transform: scale(1.15); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-scaleup {
          animation: scaleup 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
      <Footer />
    </div>
  );
}
