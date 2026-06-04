import nspLogo from '../assets/nsp-logo.svg'
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-700 via-primary to-green-800 text-white pt-10 pb-6 mt-12 text-base shadow-inner border-t border-green-900/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-stretch gap-8 px-4">
        <div className="flex-1 mb-8 md:mb-0 flex flex-col items-center md:items-start">
          <div className="bg-white rounded-full p-2 mb-2 shadow">
            <img src={nspLogo} alt="NSP Logo" className="h-16 w-16 object-contain" />
          </div>
          <div className="font-extrabold text-xl mb-1 text-center tracking-tight">National Scholarship Portal</div>
          <div className="text-green-200 mb-1 font-medium">Government of India | Ministry of Education</div>
          <div className="text-xs text-green-100 text-center md:text-left">Empowering students through transparent and efficient scholarship management.</div>
        </div>
        <div className="hidden md:block w-px bg-green-900/20 mx-2" />
        <div className="flex-1 mb-8 md:mb-0 flex flex-col items-center md:items-start">
          <div className="font-semibold mb-2 text-lg">Quick Links</div>
          <div className="flex flex-col gap-1 text-sm w-full">
            <Link to="/" className="hover:underline hover:text-green-300 text-green-100 transition-colors">Home</Link>
            <Link to="/about" className="hover:underline hover:text-green-300 text-green-100 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:underline hover:text-green-300 text-green-100 transition-colors">Contact Us</Link>
            <Link to="/register/student" className="hover:underline hover:text-green-300 text-green-100 transition-colors">Student Registration</Link>
            <Link to="/register/institute" className="hover:underline hover:text-green-300 text-green-100 transition-colors">Institute Registration</Link>
          </div>
        </div>
        <div className="hidden md:block w-px bg-green-900/20 mx-2" />
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="font-semibold mb-2 text-lg">Contact</div>
          <div className="text-sm text-green-100 mb-1">helpdesk@nsp.gov.in</div>
          <div className="text-sm text-green-100 mb-1">Toll Free: 1800-XXX-XXXX</div>
          <div className="text-xs text-green-100 text-center md:text-left">NSP Office, Ministry of Education,<br />Shastri Bhawan, New Delhi, India</div>
        </div>
      </div>
      <div className="mt-8 border-t border-green-900/20 pt-4 text-xs text-green-200 text-center">© 2024 National Scholarship Portal. All rights reserved.</div>
    </footer>
  )
}
