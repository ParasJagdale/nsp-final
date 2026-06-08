import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const states = ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Uttar Pradesh','Gujarat','Rajasthan','West Bengal'];
const districts = ['Mumbai','Pune','Nashik','Nagpur','Aurangabad','Thane','Solapur'];

export default function UpdateProfile() {
  const [form, setForm] = useState({
    state: '',
    district: '',
    name: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    instituteCode: '',
    aadhar: '',
    bankIfsc: '',
    bankAccount: '',
    bankName: '',
    agree: false
  });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
        const s = data?.student;
        if (!cancelled && s) {
          setForm((prev) => ({
            ...prev,
            state: s.state ?? '',
            district: s.district ?? '',
            name: s.name ?? '',
            dob: s.dob ?? '',
            gender: s.gender ?? '',
            mobile: s.mobile ?? '',
            email: s.email ?? '',
            instituteCode: s.instituteCode ?? '',
            aadhar: s.aadhar ?? '',
            bankIfsc: s.bankIfsc ?? '',
            bankAccount: s.bankAccount ?? '',
            bankName: s.bankName ?? '',
            agree: true,
          }));
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) return alert('Please accept the declaration');

    setSubmitting(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          state: form.state,
          district: form.district,
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          mobile: form.mobile,
          email: form.email,
          instituteCode: form.instituteCode,
          aadhar: form.aadhar,
          bankIfsc: form.bankIfsc,
          bankAccount: form.bankAccount,
          bankName: form.bankName,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (!res.ok) {
        return alert(data?.error ?? 'Update failed');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      alert('Update failed (network error)');
    } finally {
      setSubmitting(false);
    }
  };

  if (unauthorized) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="student" />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-purple-700 text-base sm:text-lg mb-6 uppercase tracking-wide">
            Update Profile
          </h1>
          {loading ? (
            <div className="text-sm text-gray-500">Loading profile...</div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">State of Domicile *</label>
                <select className="form-select" value={form.state} onChange={e => set('state', e.target.value)} required>
                  <option value="">-- Select State --</option>
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">District *</label>
                <select className="form-select" value={form.district} onChange={e => set('district', e.target.value)} required>
                  <option value="">-- Select District --</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Name (as in Mark Sheets) *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input type="date" className="form-input" value={form.dob} onChange={e => set('dob', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Gender *</label>
                <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)} required>
                  <option value="">-- Select --</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" maxLength={10} value={form.mobile} onChange={e => set('mobile', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Email ID *</label>
                <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Institute Code *</label>
                <input className="form-input" value={form.instituteCode} onChange={e => set('instituteCode', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Aadhar Number *</label>
                <input className="form-input" maxLength={12} value={form.aadhar} onChange={e => set('aadhar', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Bank IFSC Code *</label>
                <input className="form-input" value={form.bankIfsc} onChange={e => set('bankIfsc', e.target.value)} pattern="^[A-Za-z]{4}0[A-Za-z0-9]{6}$" placeholder="e.g. SBIN0001234" required />
              </div>
              <div>
                <label className="form-label">Bank Account Number *</label>
                <input className="form-input" value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Bank Name *</label>
                <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} required />
              </div>
            </div>
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0" checked={form.agree} onChange={e => set('agree', e.target.checked)} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the above information furnished by me is true to the best of my knowledge.
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" className="btn-primary w-full sm:w-auto px-10" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Profile'}
              </button>
              <button type="reset" className="btn-secondary w-full sm:w-auto px-10"
                onClick={() => setForm({state:'',district:'',name:'',dob:'',gender:'',mobile:'',email:'',instituteCode:'',aadhar:'',bankIfsc:'',bankAccount:'',bankName:'',agree:false})}>
                Reset
              </button>
            </div>
            {success && <div className="text-green-600 font-semibold mt-2 text-center">Profile updated successfully!</div>}
          </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
