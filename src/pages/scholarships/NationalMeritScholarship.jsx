import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function NationalMeritScholarship() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      <main className="flex-1 w-full px-0 py-0">
        <div className="bg-white rounded-none md:rounded-2xl shadow-xl border-l-0 md:border-l-8 border-purple-400 p-4 md:p-8 mb-0 md:mb-10 relative overflow-hidden w-full">
          <div className="absolute right-0 top-0 opacity-10 text-[5rem] md:text-[8rem] pointer-events-none select-none font-black text-purple-400 hidden md:block">🎓</div>
          <h1 className="text-xl md:text-2xl font-extrabold text-purple-600 mb-3 text-center drop-shadow">National Merit Scholarship</h1>
          <p className="mb-4 text-gray-700 text-sm md:text-base text-center">The National Merit Scholarship is awarded to students based on their academic excellence. It aims to encourage and support meritorious students in their educational journey.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-base md:text-xl mb-2 text-purple-600 flex items-center gap-2">✨ Key Features</h2>
              <ul className="list-disc pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
                <li>🎓 For meritorious students</li>
                <li>💰 Financial support for higher studies</li>
                <li>📚 Encourages academic excellence</li>
                <li>🏛️ Provided by Central/State Government</li>
                <li>🌐 Transparent selection process</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-base md:text-xl mb-2 text-purple-600 flex items-center gap-2">✅ Eligibility Criteria</h2>
              <ul className="list-disc pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
                <li>✔ Based on academic merit</li>
                <li>✔ Enrolled in recognized institution</li>
                <li>✔ Maintain minimum academic performance</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-base md:text-xl mb-2 text-purple-600 flex items-center gap-2">📄 Documents Required</h2>
              <ul className="list-disc pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
                <li>🪪 Aadhaar Card</li>
                <li>📚 Previous Marksheet</li>
                <li>🏠 Residence Certificate</li>
                <li>🏦 Bank Account Details</li>
                <li>📸 Passport-size Photograph</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-base md:text-xl mb-2 text-purple-600 flex items-center gap-2">📝 How to Apply</h2>
              <ol className="list-decimal pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
                <li>🌐 Visit the official Scholarship Portal</li>
                <li>🆕 Click on “New Registration”</li>
                <li>🧾 Fill in personal details</li>
                <li>🔐 Create Login Credentials</li>
                <li>📥 Login to the portal</li>
                <li>📝 Complete the application form</li>
                <li>📤 Upload required documents</li>
                <li>✅ Submit the application</li>
                <li>📅 Note down Application ID</li>
              </ol>
            </div>
          </div>
          <div className="mb-6 md:mb-8 text-sm md:text-base text-gray-700 text-center bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-100 font-medium shadow-sm">To apply for scholarship, <span className="text-purple-600 font-bold">login as a student</span>.</div>
          <button
            className="btn-primary mx-auto block text-base md:text-lg px-6 md:px-8 py-2 md:py-3 shadow-md hover:scale-105 transition-transform"
            onClick={() => navigate('/login')}
          >
            Go to Student Login
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
