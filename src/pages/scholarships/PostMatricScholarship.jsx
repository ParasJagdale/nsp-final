import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function PostMatricScholarship() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
			<Navbar />
			<main className="flex-1 w-full px-0 py-0">
				<div className="bg-white rounded-none md:rounded-2xl shadow-xl border-l-0 md:border-l-8 border-primary p-4 md:p-8 mb-0 md:mb-10 relative overflow-hidden w-full">
					<div className="absolute right-0 top-0 opacity-10 text-[5rem] md:text-[8rem] pointer-events-none select-none font-black text-primary hidden md:block">🎓</div>
					<h1 className="text-xl md:text-2xl font-extrabold text-primary mb-3 text-center drop-shadow">Post Matric Scholarship <span className="text-secondary">(Merit‑cum‑Means)</span></h1>
					<p className="mb-4 text-gray-700 text-sm md:text-base text-center">The Post Matric Scholarship (Merit‑cum‑Means) is a financial assistance program designed to support students from economically weaker sections belonging to SC, ST, OBC, and Minority communities. The scholarship aims to promote higher education and reduce dropout rates after Class 10.</p>
					<div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mb-6 md:mb-8 w-full">
						<div className="flex-1 bg-green-50 rounded-xl p-3 md:p-6 flex flex-col items-center border border-green-200">
							<span className="text-lg md:text-2xl font-bold text-primary">₹850Cr+</span>
							<span className="text-xs text-gray-500 mt-1">Scholarships Disbursed</span>
						</div>
						<div className="flex-1 bg-blue-50 rounded-xl p-3 md:p-6 flex flex-col items-center border border-blue-200">
							<span className="text-lg md:text-2xl font-bold text-primary">2.1M+</span>
							<span className="text-xs text-gray-500 mt-1">Students Benefited</span>
						</div>
						<div className="flex-1 bg-yellow-50 rounded-xl p-3 md:p-6 flex flex-col items-center border border-yellow-200">
							<span className="text-lg md:text-2xl font-bold text-primary">12,000+</span>
							<span className="text-xs text-gray-500 mt-1">Institutes Onboarded</span>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
						{/* Key Features Card */}
						<div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
							<h2 className="font-bold text-base md:text-xl mb-2 text-primary flex items-center gap-2">✨ Key Features</h2>
							<ul className="list-disc pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
								<li>🎓 Available for students studying Class 11 to Postgraduate levels</li>
								<li>💰 Covers tuition fees, maintenance allowance, and other academic expenses</li>
								<li>📚 Helps students pursue technical, professional, and general courses</li>
								<li>🧑‍🎓 Encourages meritorious students with financial need</li>
								<li>🏛️ Provided by Central Government / State Governments</li>
								<li>🌐 Online application and transparent process</li>
							</ul>
						</div>
						{/* Eligibility Card */}
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
							<h2 className="font-bold text-base md:text-xl mb-2 text-primary flex items-center gap-2">✅ Eligibility Criteria</h2>
							<ul className="list-disc pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
								<li>✔ Belong to SC / ST / OBC / Minority category</li>
								<li>✔ Have passed Class 10 or equivalent examination</li>
								<li>✔ Be enrolled in a recognized institution</li>
								<li>✔ Annual family income should be:
									<ul className="list-disc pl-4 md:pl-6">
										<li>SC/ST: Up to ₹2.5 lakh</li>
										<li>OBC: Up to ₹1 lakh (may vary)</li>
										<li>Minority: Up to ₹2.5 lakh</li>
									</ul>
								</li>
								<li>✔ Maintain minimum academic performance</li>
								<li>✔ Not availing any other scholarship for the same course</li>
							</ul>
						</div>
						{/* Documents Card */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
							<h2 className="font-bold text-base md:text-xl mb-2 text-primary flex items-center gap-2">📄 Documents Required</h2>
							<ul className="list-disc pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
								<li>🪪 Aadhaar Card</li>
								<li>📚 Previous Marksheet</li>
								<li>🧾 Income Certificate</li>
								<li>🏠 Residence Certificate</li>
								<li>🎯 Caste Certificate (if applicable)</li>
								<li>🏦 Bank Account Details</li>
								<li>📸 Passport-size Photograph</li>
								<li>📄 Admission/Bonafide Certificate</li>
							</ul>
						</div>
						{/* How to Apply Card */}
						<div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
							<h2 className="font-bold text-base md:text-xl mb-2 text-primary flex items-center gap-2">📝 How to Apply</h2>
							<ol className="list-decimal pl-4 md:pl-6 space-y-1 text-gray-700 text-sm md:text-base">
								<li>🌐 Visit the official Scholarship Portal (National or State Portal)</li>
								<li>🆕 Click on “New Registration”</li>
								<li>🧾 Fill in personal details: Name, DOB, Category, Mobile number, Email ID</li>
								<li>🔐 Create Login Credentials (User ID & Password)</li>
								<li>📥 Login to the portal</li>
								<li>📝 Complete the application form: Academic details, Income & category details</li>
								<li>📤 Upload required documents</li>
								<li>✅ Submit the application</li>
								<li>📅 Note down Application ID for tracking</li>
							</ol>
						</div>
					</div>
					<div className="mb-6 md:mb-8 text-sm md:text-base text-gray-700 text-center bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100 font-medium shadow-sm">To apply for scholarship, <span className="text-primary font-bold">login as a student</span>.</div>
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
