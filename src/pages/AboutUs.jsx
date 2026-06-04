import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoBar from '../components/LogoBar';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-extrabold text-primary mb-4">About Us</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <p className="mb-4 text-lg text-gray-700">The National Scholarship Portal (NSP) is a one-stop solution for various scholarship schemes offered by the Government of India. Our mission is to provide a transparent, efficient, and accountable system for the disbursement of scholarships to students across the country.</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Centralized platform for all scholarships</li>
            <li>Easy application and tracking process</li>
            <li>Ensures transparency and accountability</li>
            <li>Empowers students from all backgrounds</li>
          </ul>
          <p className="text-gray-600">NSP is managed by the Ministry of Education, Government of India, and aims to bridge the gap between scholarship providers and students.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
