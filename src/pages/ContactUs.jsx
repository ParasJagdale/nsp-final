import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoBar from '../components/LogoBar';

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-extrabold text-primary mb-4">Contact Us</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-6">
            <div className="font-bold text-gray-700 mb-1">Email</div>
            <div className="text-gray-900 mb-3">helpdesk@nsp.gov.in</div>
            <div className="font-bold text-gray-700 mb-1">Toll Free</div>
            <div className="text-gray-900 mb-3">1800-XXX-XXXX</div>
            <div className="font-bold text-gray-700 mb-1">Office Address</div>
            <div className="text-gray-900 mb-3">NSP Office, Ministry of Education, Shastri Bhawan, New Delhi, India</div>
          </div>
          <div className="mt-8">
            <div className="font-bold text-gray-700 mb-2">Send us a message</div>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full border rounded px-4 py-2 focus:outline-primary" />
              <input type="email" placeholder="Your Email" className="w-full border rounded px-4 py-2 focus:outline-primary" />
              <textarea placeholder="Your Message" className="w-full border rounded px-4 py-2 focus:outline-primary" rows={4}></textarea>
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
