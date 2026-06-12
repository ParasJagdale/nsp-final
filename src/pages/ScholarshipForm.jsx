import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { scholarshipSchema } from '../schemas/scholarshipSchema'

const states = ['Maharashtra']
const districts = [
  "Ahmednagar (Ahilyanagar)",
  "Akola",
  "Amravati",
  "Aurangabad (Chhatrapati Sambhajinagar)",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad (Dharashiv)",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal"
]
const blocks = ['Block A','Block B','Block C','Block D']
const religions = ['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other']
const schemes = ['Post Matric Scholarship','Pragati Scholarship','NTSE','National Merit Scholarship','Central Scholarship Scheme']
const courses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'B.Tech', 'B.Arch', 'B.Sc', 'B.Com', 'B.A', 'M.Tech', 'M.Sc', 'M.A', 'MBA', 'MBBS']
const years = Array.from({length: 2026 - 1990 + 1}, (_, i) => 2026 - i);
const boardNames = ['CBSE', 'ICSE', 'Maharashtra State Board'];

const FileUpload = ({ label }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
    <span className="text-xs text-gray-600 uppercase tracking-wide">{label}</span>
    <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
      <input type="file" className="hidden" />
      <span className="border border-gray-400 text-xs px-4 py-1 rounded hover:bg-gray-50 transition-colors block">Upload</span>
    </label>
  </div>
)


export default function ScholarshipForm() {
  const [redirect, setRedirect] = useState(null)
  const { schemeId } = useParams()
  const [form, setForm] = useState({
    aadhar:'', religion:'', community:'', fatherName:'', motherName:'', annualIncome:'',
    instituteName:'', instituteCode:'', presentClass:'', classYear:'', modeOfStudy:'', classStartDate:'',
    prevClass:'', prevPassYear:'', prevClassPercent:'',
    roll10:'', board10:'', year10:'', percent10:'',
    roll12:'', board12:'', year12:'', percent12:'',
    admissionFee:'', tuitionFee:'', otherFee:'',
    isDisabled:'No', disabilityType:'', disabilityPercent:'', maritalStatus:'', parentsProfession:'',
    contactState:'', contactDistrict:'', contactBlock:'', houseNo:'', streetNo:'', pincode:'',
    scheme:'', agree: false
  })
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFieldChange = (field, value, format) => {
    let formattedValue = value;
    if (format === 'digits') formattedValue = value.replace(/\D/g, '');
    if (format === 'uppercase') formattedValue = value.toUpperCase();

    setForm(f => ({ ...f, [field]: formattedValue }));

    const fieldSchema = scholarshipSchema.shape[field];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(formattedValue);
      setErrors(prev => ({
        ...prev,
        [field]: result.success ? '' : result.error.issues[0].message
      }));
    }
  };

  const handleInstituteCodeBlur = async () => {
    if (!form.instituteCode) return;
    try {
      const res = await fetch(`/api/auth/institute/info/${form.instituteCode}`, { credentials: 'include' });
      
      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Invalid server response. Please ensure the backend is running and updated.");
      }

      const data = await res.json();
      
      if (res.ok) {
        set('instituteName', data.name);
      } else {
        set('instituteName', '');
        alert(data.error || 'Institute not found');
      }
    } catch (err) {
      console.error('Failed to fetch institute name', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = scholarshipSchema.safeParse(form);
    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    try {
      const res = await fetch('/api/auth/scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          instituteCode: form.instituteCode,
          formData: form
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      
      alert(`Application Submitted Successfully! Your Application ID is: ${data.appId}`)
      setRedirect('/application-success');
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {redirect && <Navigate to={redirect} replace />}
      <Navbar userType="student" onLogout={null} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-1 uppercase tracking-wide">
            Scholarship Application Form
          </h1>
          <p className="text-center text-xs text-gray-500 mb-6">National Scholarship Portal – Government of India</p>

          <form onSubmit={handleSubmit} className="space-y-8">

            <section>
              <h2 className="section-title">Basic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Aadhar Number *</label>
                  <input
                    className={`form-input ${errors.aadhar ? 'border-red-500' : ''}`}
                    maxLength={12}
                    value={form.aadhar}
                    onChange={e => handleFieldChange('aadhar', e.target.value, 'digits')}
                  />
                  {errors.aadhar && <div className="text-xs text-red-600 mt-1">{errors.aadhar}</div>}
                </div>
                <div>
                  <label className="form-label">Religion *</label>
                  <select className={`form-select ${errors.religion ? 'border-red-500' : ''}`} value={form.religion} onChange={e => handleFieldChange('religion', e.target.value)}>
                    <option value="">-- Select --</option>
                    {religions.map(r => <option key={r}>{r}</option>)}
                  </select>
                  {errors.religion && <div className="text-xs text-red-600 mt-1">{errors.religion}</div>}
                </div>
                <div>
                  <label className="form-label">Community / Category *</label>
                  <input
                    className={`form-input ${errors.community ? 'border-red-500' : ''}`}
                    placeholder="SC / ST / OBC / General"
                    value={form.community}
                    onChange={e => handleFieldChange('community', e.target.value)}
                  />
                  {errors.community && <div className="text-xs text-red-600 mt-1">{errors.community}</div>}
                </div>
                <div>
                  <label className="form-label">Father's Name *</label>
                  <input
                    className={`form-input ${errors.fatherName ? 'border-red-500' : ''}`}
                    maxLength={100}
                    value={form.fatherName}
                    onChange={e => handleFieldChange('fatherName', e.target.value)}
                  />
                  {errors.fatherName && <div className="text-xs text-red-600 mt-1">{errors.fatherName}</div>}
                </div>
                <div>
                  <label className="form-label">Mother's Name *</label>
                  <input
                    className={`form-input ${errors.motherName ? 'border-red-500' : ''}`}
                    maxLength={100}
                    value={form.motherName}
                    onChange={e => handleFieldChange('motherName', e.target.value)}
                  />
                  {errors.motherName && <div className="text-xs text-red-600 mt-1">{errors.motherName}</div>}
                </div>
                <div>
                  <label className="form-label">Family Annual Income (₹) *</label>
                  <input
                    type="number"
                    className={`form-input ${errors.annualIncome ? 'border-red-500' : ''}`}
                    min="0"
                    max="99999999"
                    value={form.annualIncome}
                    onChange={e => e.target.value.length <= 8 && handleFieldChange('annualIncome', e.target.value)}
                  />
                  {errors.annualIncome && <div className="text-xs text-red-600 mt-1">{errors.annualIncome}</div>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="section-title">Academic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Institute Code *</label>
                  <input className={`form-input ${errors.instituteCode ? 'border-red-500' : ''}`} placeholder="e.g. NSP001" value={form.instituteCode} onChange={e => handleFieldChange('instituteCode', e.target.value)} onBlur={handleInstituteCodeBlur} />
                  {errors.instituteCode && <div className="text-xs text-red-600 mt-1">{errors.instituteCode}</div>}
                </div>
                <div>
                  <label className="form-label">Institute Name *</label>
                  <input className={`form-input bg-gray-100 cursor-not-allowed ${errors.instituteName ? 'border-red-500' : ''}`} placeholder="Auto-filled from Code" value={form.instituteName} readOnly />
                  {errors.instituteName && <div className="text-xs text-red-600 mt-1">{errors.instituteName}</div>}
                </div>
                <div>
                  <label className="form-label">Present Class / Course *</label>
                  <select
                    className={`form-select ${errors.presentClass ? 'border-red-500' : ''}`}
                    value={form.presentClass}
                    onChange={e => {
                      const val = e.target.value;
                      handleFieldChange('presentClass', val);
                      // Auto-sync year if a school class (1-12) is selected, otherwise reset
                      if (!isNaN(val) && val !== '') {
                        handleFieldChange('classYear', val);
                      } else {
                        handleFieldChange('classYear', '');
                      }
                    }}
                  >
                    <option value="">-- Select --</option>
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.presentClass && <div className="text-xs text-red-600 mt-1">{errors.presentClass}</div>}
                </div>
                <div>
                  <label className="form-label">Present Class / Course Year *</label>
                  <select className={`form-select ${errors.classYear ? 'border-red-500' : ''}`} value={form.classYear} onChange={e => handleFieldChange('classYear', e.target.value)}>
                    <option value="">-- Select --</option>
                    {form.presentClass && !isNaN(form.presentClass) ? (
                      <option value={form.presentClass}>{form.presentClass}</option>
                    ) : (
                      ['1', '2', '3', '4', '5'].map(y => <option key={y} value={y}>{y}</option>)
                    )}
                  </select>
                  {errors.classYear && <div className="text-xs text-red-600 mt-1">{errors.classYear}</div>}
                </div>
                <div>
                  <label className="form-label">Mode of Study *</label>
                  <select className={`form-select ${errors.modeOfStudy ? 'border-red-500' : ''}`} value={form.modeOfStudy} onChange={e => handleFieldChange('modeOfStudy', e.target.value)}>
                    <option value="">-- Select --</option>
                    <option>Regular</option><option>Distance</option><option>Part-Time</option>
                  </select>
                  {errors.modeOfStudy && <div className="text-xs text-red-600 mt-1">{errors.modeOfStudy}</div>}
                </div>
                <div>
                  <label className="form-label">Class Start Date *</label>
                  <input type="date" className={`form-input ${errors.classStartDate ? 'border-red-500' : ''}`} value={form.classStartDate} onChange={e => handleFieldChange('classStartDate', e.target.value)} />
                  {errors.classStartDate && <div className="text-xs text-red-600 mt-1">{errors.classStartDate}</div>}
                </div>
                <div>
                  <label className="form-label">Previous Class / Course</label>
                  <select className="form-select" value={form.prevClass} onChange={e => handleFieldChange('prevClass', e.target.value)}>
                    <option value="">-- Select --</option>
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Previous Passing Year</label>
                  <select className="form-select" value={form.prevPassYear} onChange={e => handleFieldChange('prevPassYear', e.target.value)}>
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Previous Class %</label>
                  <input type="number" className={`form-input ${errors.prevClassPercent ? 'border-red-500' : ''}`} min="0" max="99" step="0.01" value={form.prevClassPercent} onChange={e => handleFieldChange('prevClassPercent', e.target.value)} />
                  {errors.prevClassPercent && <div className="text-xs text-red-600 mt-1">{errors.prevClassPercent}</div>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="section-title">10th Class Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Roll Number *</label>
                  <input className={`form-input ${errors.roll10 ? 'border-red-500' : ''}`} maxLength={8} value={form.roll10} onChange={e => handleFieldChange('roll10', e.target.value, 'digits')} />
                  {errors.roll10 && <div className="text-xs text-red-600 mt-1">{errors.roll10}</div>}
                </div>
                <div>
                  <label className="form-label">Board Name *</label>
                  <select className={`form-select ${errors.board10 ? 'border-red-500' : ''}`} value={form.board10} onChange={e => handleFieldChange('board10', e.target.value)}>
                    <option value="">-- Select Board --</option>
                    {boardNames.map(b => <option key={b}>{b}</option>)}
                  </select>
                  {errors.board10 && <div className="text-xs text-red-600 mt-1">{errors.board10}</div>}
                </div>
                <div>
                  <label className="form-label">Passing Year *</label>
                  <select className={`form-select ${errors.year10 ? 'border-red-500' : ''}`} value={form.year10} onChange={e => handleFieldChange('year10', e.target.value)}>
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                  {errors.year10 && <div className="text-xs text-red-600 mt-1">{errors.year10}</div>}
                </div>
                <div>
                  <label className="form-label">% Obtained *</label>
                  <input type="number" className={`form-input ${errors.percent10 ? 'border-red-500' : ''}`} min="0" max="99" step="0.01" value={form.percent10} onChange={e => handleFieldChange('percent10', e.target.value)} />
                  {errors.percent10 && <div className="text-xs text-red-600 mt-1">{errors.percent10}</div>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="section-title">12th Class Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Roll Number</label>
                  <input className={`form-input ${errors.roll12 ? 'border-red-500' : ''}`} maxLength={8} value={form.roll12} onChange={e => handleFieldChange('roll12', e.target.value, 'digits')} />
                  {errors.roll12 && <div className="text-xs text-red-600 mt-1">{errors.roll12}</div>}
                </div>
                <div>
                  <label className="form-label">Board Name</label>
                  <select className="form-select" value={form.board12} onChange={e => handleFieldChange('board12', e.target.value)}>
                    <option value="">-- Select Board --</option>
                    {boardNames.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Passing Year</label>
                  <select className="form-select" value={form.year12} onChange={e => handleFieldChange('year12', e.target.value)}>
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">% Obtained</label>
                  <input type="number" className={`form-input ${errors.percent12 ? 'border-red-500' : ''}`} min="0" max="99" step="0.01" value={form.percent12} onChange={e => handleFieldChange('percent12', e.target.value)} />
                  {errors.percent12 && <div className="text-xs text-red-600 mt-1">{errors.percent12}</div>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="section-title">Fee Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Admission Fee (₹) *</label>
                  <input type="number" className={`form-input ${errors.admissionFee ? 'border-red-500' : ''}`} min="0" max="99999" value={form.admissionFee} onChange={e => handleFieldChange('admissionFee', e.target.value)} />
                  {errors.admissionFee && <div className="text-xs text-red-600 mt-1">{errors.admissionFee}</div>}
                </div>
                <div>
                  <label className="form-label">Tuition Fee (₹) *</label>
                  <input type="number" className={`form-input ${errors.tuitionFee ? 'border-red-500' : ''}`} min="0" max="99999" value={form.tuitionFee} onChange={e => handleFieldChange('tuitionFee', e.target.value)} />
                  {errors.tuitionFee && <div className="text-xs text-red-600 mt-1">{errors.tuitionFee}</div>}
                </div>
                <div>
                  <label className="form-label">Other Fee (₹)</label>
                  <input type="number" className={`form-input ${errors.otherFee ? 'border-red-500' : ''}`} min="0" max="99999" value={form.otherFee} onChange={e => handleFieldChange('otherFee', e.target.value)} />
                  {errors.otherFee && <div className="text-xs text-red-600 mt-1">{errors.otherFee}</div>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="section-title">Other Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Is Disabled?</label>
                  <select className="form-select" value={form.isDisabled} onChange={e => handleFieldChange('isDisabled', e.target.value)}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                {form.isDisabled === 'Yes' && <>
                  <div><label className="form-label">Type of Disability</label><input className="form-input" maxLength={100} value={form.disabilityType} onChange={e => handleFieldChange('disabilityType', e.target.value)} /></div>
                  <div><label className="form-label">% of Disability</label><input type="number" className={`form-input ${errors.disabilityPercent ? 'border-red-500' : ''}`} min="0" max="100" step="0.01" value={form.disabilityPercent} onChange={e => handleFieldChange('disabilityPercent', e.target.value)} /></div>
                </>}
                <div>
                  <label className="form-label">Marital Status</label>
                  <select className="form-select" value={form.maritalStatus} onChange={e => handleFieldChange('maritalStatus', e.target.value)}>
                    <option value="">-- Select --</option><option>Single</option><option>Married</option>
                  </select>
                </div>
                <div><label className="form-label">Parents' Profession</label><input className="form-input" maxLength={100} value={form.parentsProfession} onChange={e => handleFieldChange('parentsProfession', e.target.value)} /></div>
              </div>
            </section>

            <section>
              <h2 className="section-title">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">State *</label>
                  <select className={`form-select ${errors.contactState ? 'border-red-500' : ''}`} value={form.contactState} onChange={e => handleFieldChange('contactState', e.target.value)}>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.contactState && <div className="text-xs text-red-600 mt-1">{errors.contactState}</div>}
                </div>
                <div>
                  <label className="form-label">District *</label>
                  <select className={`form-select ${errors.contactDistrict ? 'border-red-500' : ''}`} value={form.contactDistrict} onChange={e => handleFieldChange('contactDistrict', e.target.value)}>
                    <option value="">-- Select --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {errors.contactDistrict && <div className="text-xs text-red-600 mt-1">{errors.contactDistrict}</div>}
                </div>
                <div>
                  <label className="form-label">Block / Taluk</label>
                  <select className="form-select" value={form.contactBlock} onChange={e => handleFieldChange('contactBlock', e.target.value)}>
                    <option value="">-- Select --</option>
                    {blocks.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">House Number</label>
                  <input className={`form-input ${errors.houseNo ? 'border-red-500' : ''}`} maxLength={10} value={form.houseNo} onChange={e => handleFieldChange('houseNo', e.target.value, 'uppercase')} />
                  {errors.houseNo && <div className="text-xs text-red-600 mt-1">{errors.houseNo}</div>}
                </div>
                <div>
                  <label className="form-label">Street Number</label>
                  <input className={`form-input ${errors.streetNo ? 'border-red-500' : ''}`} maxLength={2} value={form.streetNo} onChange={e => handleFieldChange('streetNo', e.target.value, 'digits')} />
                  {errors.streetNo && <div className="text-xs text-red-600 mt-1">{errors.streetNo}</div>}
                </div>
                <div>
                  <label className="form-label">Pincode *</label>
                  <input className={`form-input ${errors.pincode ? 'border-red-500' : ''}`} maxLength={6} value={form.pincode} onChange={e => handleFieldChange('pincode', e.target.value, 'digits')} />
                  {errors.pincode && <div className="text-xs text-red-600 mt-1">{errors.pincode}</div>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="section-title">Scheme Selection</h2>
              <label className="form-label">Choose Scheme Applying For *</label>
              <select className={`form-select ${errors.scheme ? 'border-red-500' : ''}`} value={form.scheme} onChange={e => handleFieldChange('scheme', e.target.value)}>
                <option value="">-- Select Scheme --</option>
                {schemes.map(s => <option key={s}>{s}</option>)}
              </select>
              {errors.scheme && <div className="text-xs text-red-600 mt-1">{errors.scheme}</div>}
            </section>

            <section>
              <h2 className="section-title">Documents Upload Section</h2>
              <div className="bg-gray-50 border rounded p-4 space-y-1">
                {['Domicile Certificate','Student Photograph','Institute ID Card','Caste / Income Certificate',
                  'Previous Year Marksheet','Fee Receipt of Current Year','Bank Passbook (Front Page)',
                  'Aadhar Card','10th Class Marksheet','12th Class Marksheet'].map(doc => (
                  <FileUpload key={doc} label={doc} />
                ))}
              </div>
            </section>

            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0" checked={form.agree} onChange={e => handleFieldChange('agree', e.target.checked)} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the details furnished by me are true to the best of my knowledge. If any mistakes are found then I may be disqualified for scholarship scheme announced by Government of India or my State Government.
              </label>
              {errors.agree && <div className="text-xs text-red-600 mt-1 block w-full">{errors.agree}</div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" className="btn-primary w-full sm:w-auto px-10">Submit</button>
              <button type="button" className="btn-secondary w-full sm:w-auto px-10" onClick={() => setRedirect('/dashboard/student')}>Cancel</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
