import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoBar from './LogoBar'
import nspLogo from '../assets/nsp-logo.svg'

export default function Navbar({ userType, onLogout }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    if (onLogout) onLogout()
    navigate('/')
  }

  return (
    <>
      <nav className="bg-primary text-white shadow-md text-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <img src={nspLogo} alt="NSP Logo" className="h-10 w-auto object-contain bg-white" />
          <div>
            <div className="font-bold text-2xl leading-tight">National Scholarship Portal</div>
            <div className="text-base text-green-200">Government of India</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
          <Link to="/" className="hover:text-green-200 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-green-200 transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-green-200 transition-colors">Contact Us</Link>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200 transition-colors">New Registration</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white text-primary px-4 py-2 rounded text-base font-bold hover:bg-green-100 transition-colors">
              Logout
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-3 flex flex-col gap-2"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-7 h-1 bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-7 h-1 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-7 h-1 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-green-800 px-6 pb-6 flex flex-col gap-4 text-lg font-semibold">
          <Link to="/" className="pt-3 hover:text-green-200" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-green-200" onClick={() => setOpen(false)}>About Us</Link>
          <Link to="/contact" className="hover:text-green-200" onClick={() => setOpen(false)}>Contact Us</Link>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200" onClick={() => setOpen(false)}>New Registration</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white text-primary px-4 py-2 rounded text-base font-bold w-fit hover:bg-green-100 transition-colors">
              Logout
            </button>
          )}
        </div>
      )}
      </nav>
      <LogoBar />
    </>
  )
}
