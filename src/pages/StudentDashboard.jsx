import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const schemes = [
	{
		id: "pms",
		name: "Post Matric Scholarship (Merit-cum-Means)",
		eligibility:
			"SC/ST/OBC/Minority | Min 60% in 10th & 12th | Income < ₹2.5L/yr",
		amount: "₹10,000 – ₹20,000 per year",
		deadline: "31 Dec 2024",
		description:
			"Provides scholarship to students from backward categories for technical and undergraduate/postgraduate courses.",
	},
	{
		id: "pragati",
		name: "Pragati Scholarship for Girls",
		eligibility:
			"Girl students | Family income < ₹8L/yr | AICTE approved institution",
		amount: "Tuition Fee up to ₹30,000",
		deadline: "15 Jan 2025",
		description:
			"Encourages girl students to pursue technical education by providing financial assistance.",
	},
	{
		id: "ntse",
		name: "National Talent Search Examination (NTSE)",
		eligibility:
			"Students of Class X | Indian nationality | Studying in India",
		amount: "Up to ₹1,250 per month for 2 years",
		deadline: "31 Aug 2024",
		description:
			"Identifies and nurtures talented students by providing scholarships for higher education.",
	},
	{
		id: "nms",
		name: "National Merit Scholarship",
		eligibility:
			"Meritorious students | Family income < ₹1L/yr | Studying in India",
		amount: "One-time grant of ₹10,000",
		deadline: "30 Sep 2024",
		description:
			"Supports meritorious students from low-income families to continue their education.",
	},
	{
		id: "css",
		name: "Central Scholarship Scheme",
		eligibility:
			"SC/ST/OBC/Minority | Income < ₹6L/yr | Studying in India",
		amount: "Varies, up to ₹20,000 per year",
		deadline: "31 Oct 2024",
		description:
			"Provides financial assistance to students from disadvantaged backgrounds for pursuing higher education.",
	},
	// ...other schemes...
];

export default function StudentDashboard() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [applications, setApplications] = useState([]);

	useEffect(() => {
		fetch('/api/auth/student/applications', { credentials: 'include' })
			.then(res => res.json())
			.then(data => {
				setApplications(data.apps || []);
			});
	}, []);

	const approvedApps = applications.filter(a => a.status === 'Approved');
	const totalAmount = approvedApps.reduce((sum, app) => {
		const admission = Number(app.data?.admissionFee) || 0;
		const tuition = Number(app.data?.tuitionFee) || 0;
		const other = Number(app.data?.otherFee) || 0;
		return sum + admission + tuition + other;
	}, 0);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar userType="student" onLogout={null} />
			{/* Top summary cards - now full width */}
			<div className="max-w-7xl mx-auto w-full px-2 sm:px-4 pt-6">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
					<div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-blue-500">
						<span className="text-2xl">📄</span>
						<div className="text-xs text-gray-500 mt-1">Total Applications</div>
						<div className="text-xl font-bold text-blue-700">{applications.length}</div>
					</div>
					<div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-yellow-400">
						<span className="text-2xl">⏳</span>
						<div className="text-xs text-gray-500 mt-1">Pending Applications</div>
						<div className="text-xl font-bold text-yellow-600">{applications.filter(a => a.status !== 'Approved' && a.status !== 'Rejected').length}</div>
					</div>
					<div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-green-500">
						<span className="text-2xl">✅</span>
						<div className="text-xs text-gray-500 mt-1">Approved Applications</div>
						<div className="text-xl font-bold text-green-700">{approvedApps.length}</div>
					</div>
					<div className="bg-white rounded-lg shadow flex flex-col items-center p-4 border-t-4 border-emerald-500">
						<span className="text-2xl">💰</span>
						<div className="text-xs text-gray-500 mt-1">Total Scholarship Amount</div>
						<div className="text-xl font-bold text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</div>
					</div>
				</div>
			</div>
			{/* Main grid with sidebar and content below summary cards */}
			<main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 pb-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Left Sidebar - smaller font */}
					<aside className="lg:col-span-3 hidden lg:flex flex-col gap-4 min-w-[220px] max-w-xs text-sm">
						<div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
							<div className="font-bold text-primary mb-2">Navigation</div>
							<button
								className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50"
								onClick={() =>
									navigate("/dashboard/student/profile")
								}
							>
								<span role="img" aria-label="profile">
									👤
								</span>{" "}
								My Profile
							</button>
							<button
								className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50"
								onClick={() =>
									navigate("/dashboard/student/check-status")
								}
							>
								<span role="img" aria-label="status">
									📊
								</span>{" "}
								Check Status
							</button>
							<button
								className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50"
								onClick={() =>
									navigate("/dashboard/student/update-profile")
								}
							>
								<span role="img" aria-label="update">
									✏️
								</span>{" "}
								Update Profile
							</button>
							<button
								className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50"
								onClick={() => navigate("/")}
							>
								<span role="img" aria-label="logout">
									🚪
								</span>{" "}
								Logout
							</button>
							<button
								className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50"
								// Placeholder for dark mode toggle logic
							>
								<span role="img" aria-label="dark">
									🌙
								</span>{" "}
								Dark Mode
							</button>
						</div>
					</aside>

					{/* Center Content */}
					<section className="lg:col-span-6 flex flex-col gap-6">
						{/* Available Scholarships Section (all scholarships as cards, 2 in a row) */}
						<div className="mb-8">
							<h2 className="text-lg font-bold text-primary mb-3">
								Available Scholarships
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{schemes.map((sch) => (
									<div
										key={sch.id}
										className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-t-4 border-green-400 relative hover:shadow-lg transition"
									>
										<div className="font-semibold text-primary text-base mb-1">
											{sch.name}
										</div>
										<div className="text-xs text-gray-500 mb-2">
											{sch.eligibility}
										</div>
										<div className="text-green-700 font-bold text-lg mb-2">
											{sch.amount}
										</div>
										<div className="flex gap-2 mt-auto">
											<button
												className="btn-secondary flex-1"
												onClick={() =>
													navigate(`/${
														sch.id === "pms"
															? "post-matric-scholarship"
															: sch.id === "pragati"
															? "pragati-scholarship"
															: sch.id === "ntse"
															? "ntse-scholarship"
															: sch.id === "nms"
															? "national-merit-scholarship"
															: sch.id === "css"
															? "central-scholarship"
															: "#"
													}`)
												}
											>
												Know More
											</button>
											<button
												className="btn-primary flex-1"
												onClick={() =>
													navigate(
														`/dashboard/student/apply/${sch.id}`
													)
												}
											>
												Apply Now
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Application Status Section */}
						<div className="mb-8">
							<h2 className="text-lg font-bold text-primary mb-3">
								Application Status
							</h2>
							<div className="space-y-4">
								{applications.map((app, idx) => {
									const steps = [
										{ label: "Applied", icon: "📝" },
										{ label: "Institute Review", icon: "🏫" },
										{ label: "Govt Approval", icon: "🏛️" },
										{ label: "Disbursed", icon: "💸" },
									];
									
									let currentStep = 0;
									if (app.status === 'InstitutePending') currentStep = 0;
									else if (app.status === 'StatePending') currentStep = 1;
									else if (app.status === 'MinistryPending') currentStep = 2;
									else if (app.status === 'Approved') currentStep = 3;
									else if (app.status === 'Rejected') currentStep = -1;

									return (
										<div key={app._id} className="bg-white rounded-xl shadow p-5">
											<div className="font-semibold text-primary mb-2">
												{app.data?.scheme || 'Scholarship Application'} <span className="text-xs text-gray-400 ml-2">({app.appId})</span>
												{app.status === 'Approved' && <span className="ml-2 text-green-600 font-bold">✨ Scholarship Granted</span>}
											</div>
											{app.status === 'Rejected' ? <div className="text-red-600 text-sm font-bold">Application Rejected</div> : (
											<div className="flex items-center justify-between gap-2 mb-2">
												{steps.map((step, i) => (
													<div
														key={step.label}
														className="flex-1 flex flex-col items-center"
													>
														<div
															className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold border-2 ${
																i <= currentStep
																	? "bg-green-100 border-green-500 text-green-700"
																	: "bg-gray-100 border-gray-300 text-gray-400"
															}`}
														>
															{step.icon}
														</div>
														<span
															className={`text-xs mt-1 ${
																i === currentStep
																	? "text-green-700 font-bold"
																	: "text-gray-400"
															}`}
														>
															{step.label}
														</span>
														{i < steps.length - 1 && (
															<div
																className={`h-1 w-full ${
																	i < currentStep
																		? "bg-green-400"
																		: "bg-gray-200"
																}`}
															></div>
														)}
													</div>
												))}
											</div>)}
											<div className="text-xs text-gray-500">
												Last updated: {new Date(app.updatedAt).toLocaleDateString()}
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Documents Section */}
						<div className="mb-8">
							<h2 className="text-lg font-bold text-primary mb-3">
								Documents
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
								{[
									{ name: "Aadhaar", status: "Uploaded" },
									{ name: "Income Certificate", status: "Pending" },
									{ name: "Marksheet", status: "Verified" },
								].map((doc) => (
									<div
										key={doc.name}
										className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-gray-200"
									>
										<div className="font-semibold text-primary text-base mb-1">
											{doc.name}
										</div>
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 w-max ${
												doc.status === "Uploaded"
													? "bg-blue-100 text-blue-700"
													: doc.status === "Pending"
													? "bg-yellow-100 text-yellow-700"
													: "bg-green-100 text-green-700"
											}`}
										>
											{doc.status}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="grid grid-cols-1 gap-6">
							{/* ...existing main content (scheme cards, status table, etc.)... */}
						</div>
					</section>

					{/* Right Sidebar - moderate width */}
					<aside className="lg:col-span-3 hidden lg:flex flex-col gap-4 min-w-[200px] max-w-sm">
						{/* Guidelines Card */}
						<div className="bg-white rounded-xl shadow p-4">
							<div className="font-bold text-primary mb-2">Guidelines</div>
							<ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
								<li>Read all instructions carefully.</li>
								<li>Upload clear scanned documents.</li>
								<li>Check eligibility before applying.</li>
								<li>Track your application status regularly.</li>
							</ul>
						</div>
						{/* Upcoming Deadlines */}
						<div className="bg-white rounded-xl shadow p-4">
							<div className="font-bold text-red-600 mb-2">
								Upcoming Deadlines
							</div>
							<ul className="text-xs space-y-1">
								<li className="text-orange-500 font-semibold">
									31 May: Pragati Scholarship
								</li>
								<li className="text-yellow-600">15 Jun: NTSE</li>
								<li className="text-green-600">30 Jun: Central Scholarship</li>
							</ul>
						</div>
						{/* Notifications List */}
						<div className="bg-white rounded-xl shadow p-4">
							<div className="font-bold text-primary mb-2">Notifications</div>
							<ul className="text-xs text-gray-700 space-y-1">
								<li>New scheme added: Pragati Scholarship</li>
								<li>Your document verification is pending</li>
								<li>Central Scholarship deadline extended</li>
							</ul>
						</div>
					</aside>
				</div>
			</main>

			<Footer />
		</div>
	);
}