import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoBar from '../components/LogoBar';

export default function InstituteProfile() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar userType="institute" onLogout={null} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow">
            <span className="text-4xl">🏫</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary mb-1 tracking-tight">Government Polytechnic</h1>
          <div className="text-gray-500 font-medium">Institute Profile</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Institute Code</div>
                <div className="text-lg font-bold text-blue-900">INST001</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Type</div>
                <div className="text-base text-gray-700">Polytechnic</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">State</div>
                <div className="text-base text-gray-700">Uttar Pradesh</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">District</div>
                <div className="text-base text-gray-700">Lucknow</div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Address</div>
                <div className="text-base text-gray-700">Sector 8, Polytechnic Road, Lucknow</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Contact Email</div>
                <div className="text-base text-gray-700">info@govpolytechnic.edu.in</div>
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase">Contact Phone</div>
                <div className="text-base text-gray-700">0522-1234567</div>
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
