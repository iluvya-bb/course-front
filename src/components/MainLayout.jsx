import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import Breadcrumb from "./ui/Breadcrumb";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdown";
import API, { API_URL } from "../services/api";
import {
	FaHome,
	FaBook,
	FaCalendarAlt,
	FaChalkboardTeacher,
	FaCertificate,
	FaUser,
	FaUserCircle,
	FaWallet,
	FaTicketAlt,
	FaBoxOpen,
} from "react-icons/fa";

const MainLayout = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { user, logout } = useAuth();
	const [logo, setLogo] = useState(null);

	// Define navigation links with colors
	const navLinks = [
		{
			path: "/dashboard",
			label: t("nav.dashboard", { defaultValue: "Нүүр" }),
			icon: FaHome,
			gradient: "from-brand-lavender to-purple-600",
			shadowColor: "#7776bc",
		},
		{
			path: "/packages",
			label: t("nav.packages", { defaultValue: "Багцууд" }),
			icon: FaBoxOpen,
			gradient: "from-indigo-500 to-purple-600",
			shadowColor: "#6366f1",
		},
		{
			path: "/book",
			label: t("nav.booking", { defaultValue: "Багшийн сургалтанд суух" }),
			icon: FaCalendarAlt,
			gradient: "from-brand-coral to-pink-600",
			shadowColor: "#ff6b9d",
		},
		{
			path: "/my-bookings",
			label: t("nav.my_bookings", { defaultValue: "Миний захиалгууд" }),
			icon: FaCalendarAlt,
			gradient: "from-brand-yellow to-orange-500",
			shadowColor: "#feca57",
		},
		{
			path: "/certificates/validate",
			label: t("nav.verify_certificates", {
				defaultValue: "Verify Certificates",
			}),
			icon: FaCertificate,
			gradient: "from-brand-lime to-green-500",
			shadowColor: "#c7ecee",
		},
		{
			path: "/wallet",
			label: t("nav.wallet", { defaultValue: "Wallet" }),
			icon: FaWallet,
			gradient: "from-green-500 to-emerald-600",
			shadowColor: "#10b981",
		},
		{
			path: "/promocode",
			label: t("nav.promocode", { defaultValue: "Promo Code" }),
			icon: FaTicketAlt,
			gradient: "from-amber-500 to-orange-600",
			shadowColor: "#f59e0b",
		},
		{
			path: "/profile",
			label: t("nav.profile", { defaultValue: "Profile" }),
			icon: FaUserCircle,
			gradient: "from-pink-500 to-rose-600",
			shadowColor: "#ff6b9d",
		},
	];

	// Add teacher dashboard link if user is a teacher
	if (user && (user.role === "teacher" || user.role === "admin")) {
		navLinks.push({
			path: "/teacher/dashboard",
			label: t("nav.teacher_dashboard", { defaultValue: "Teacher Dashboard" }),
			icon: FaChalkboardTeacher,
			gradient: "from-blue-500 to-indigo-600",
			shadowColor: "#00d2ff",
		});
	}

	// Fetch logo from parameters
	useEffect(() => {
		const fetchLogo = async () => {
			try {
				const response = await API.getParameters();
				const params = response.data.data || [];
				const logoParam = params.find((p) => p.key === "logo");
				if (logoParam && logoParam.value) {
					setLogo(`${API_URL}/${logoParam.value}`);
				}
			} catch (error) {
				console.error("Failed to fetch logo:", error);
			}
		};
		fetchLogo();
	}, []);

	return (
		<div className="flex min-h-screen bg-base-100 text-base-content">
			{/* Quirky Fun Sidebar */}
			<aside className="w-20 lg:w-64 bg-neutral border-r-4 border-brand-lavender/30 flex-shrink-0 relative overflow-hidden">
				{/* Animated gradient blobs in sidebar */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
					<motion.div
						className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-brand-coral blur-2xl"
						animate={{
							scale: [1, 1.3, 1],
							x: [0, 20, 0],
							y: [0, 30, 0],
						}}
						transition={{
							duration: 8,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-brand-yellow blur-2xl"
						animate={{
							scale: [1, 1.5, 1],
							x: [0, -20, 0],
							y: [0, -20, 0],
						}}
						transition={{
							duration: 10,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>

				{/* Sidebar content */}
				<div className="relative z-10 h-full flex flex-col">
					{/* Logo Section */}
					<Link to="/dashboard" className="p-4 lg:p-6 group">
						<motion.div
							whileHover={{ rotate: [0, -5, 5, -5, 0] }}
							transition={{ duration: 0.5 }}
							className="flex items-center justify-center lg:justify-start"
						>
							<div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-brand-lavender to-brand-coral p-2 shadow-lg group-hover:shadow-xl transition-shadow">
								<img
									src={logo || "/logo.svg"}
									alt={t("dashboard.logo_alt")}
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="hidden lg:block ml-3">
								<h1 className="text-xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
									{t("dashboard.heading")}
								</h1>
							</div>
						</motion.div>
					</Link>

					{/* Navigation Links */}
					{user && (
						<nav className="flex-1 px-2 lg:px-4 py-6 space-y-3">
							{navLinks.map((link, index) => {
								const Icon = link.icon;
								const isActive = location.pathname === link.path;
								return (
									<motion.div
										key={link.path}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<Link to={link.path} className="block group">
											<motion.div
												whileHover={{ scale: 1.05, x: 5 }}
												whileTap={{ scale: 0.95 }}
												className={`relative flex items-center lg:gap-3 p-3 lg:p-4 rounded-2xl transition-all ${
													isActive
														? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
														: "bg-base-100 hover:bg-base-200"
												}`}
												style={{
													boxShadow: isActive
														? `4px 4px 0px ${link.shadowColor}`
														: "none",
												}}
											>
												{/* Icon */}
												<motion.div
													animate={
														isActive ? { rotate: [0, -10, 10, -10, 0] } : {}
													}
													transition={{ duration: 0.5 }}
													className="flex-shrink-0"
												>
													<Icon
														className={`text-2xl lg:text-xl ${
															isActive
																? "text-white"
																: "text-brand-lavender group-hover:text-brand-coral"
														}`}
													/>
												</motion.div>

												{/* Label - hidden on mobile */}
												<span
													className={`hidden lg:block font-bold text-sm ${
														isActive ? "text-white" : "text-base-content"
													}`}
												>
													{link.label}
												</span>

												{/* Active indicator dot */}
												{isActive && (
													<motion.div
														layoutId="activeIndicator"
														className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														transition={{
															type: "spring",
															stiffness: 500,
															damping: 30,
														}}
													/>
												)}
											</motion.div>
										</Link>
									</motion.div>
								);
							})}
						</nav>
					)}

					{/* Bottom section - Login button only when not logged in */}
					{!user && (
						<div className="p-2 lg:p-4 space-y-3 border-t-2 border-brand-lavender/20">
							<Link to="/account" className="block">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="bg-gradient-to-r from-brand-lavender to-brand-coral text-white p-3 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow"
								>
									<FaUser className="text-xl mx-auto lg:hidden" />
									<span className="hidden lg:block font-bold text-sm">
										{t("login.login_button")}
									</span>
								</motion.div>
							</Link>
						</div>
					)}
				</div>
			</aside>

			{/* Main Content Area - Takes remaining space */}
			<main className="flex-1 overflow-auto relative">
				{/* Grid Background */}
				<div
					className="fixed inset-0 opacity-[0.08] pointer-events-none"
					style={{
						backgroundImage: `
              linear-gradient(to right, #7776bc 1px, transparent 1px),
              linear-gradient(to bottom, #7776bc 1px, transparent 1px)
            `,
						backgroundSize: "60px 60px",
						left: "5rem", // Start after sidebar on mobile
					}}
				/>

				{/* Animated gradient blobs */}
				<div
					className="fixed inset-0 overflow-hidden pointer-events-none"
					style={{ left: "5rem" }}
				>
					<motion.div
						className="absolute top-20 right-20 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl"
						animate={{
							scale: [1, 1.2, 1],
							x: [0, 50, 0],
							y: [0, 30, 0],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-brand-lavender/10 blur-3xl"
						animate={{
							scale: [1, 1.3, 1],
							x: [0, -50, 0],
							y: [0, -30, 0],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
					{/* Breadcrumb, Language Switcher, and User Dropdown Row */}
					<div className="flex items-center justify-between gap-4 mb-6">
						<Breadcrumb />
						<div className="flex items-center gap-3">
							{/* Language Switcher */}
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="flex-shrink-0"
							>
								<div className="bg-gradient-to-r from-brand-yellow/20 to-brand-coral/20 p-2 lg:p-3 rounded-2xl border-2 border-brand-yellow/30 shadow-md hover:shadow-lg transition-shadow">
									<LanguageSwitcher />
								</div>
							</motion.div>

							{/* User Dropdown - only show when logged in */}
							{user && (
								<motion.div className="flex-shrink-0">
									<div className="bg-gradient-to-r from-brand-lavender/20 to-brand-coral/20 p-2 lg:p-3 rounded-2xl border-2 border-brand-lavender/30 shadow-md hover:shadow-lg transition-shadow">
										<UserDropdown user={user} onLogout={logout} />
									</div>
								</motion.div>
							)}
						</div>
					</div>

					<div>
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
};

export default MainLayout;
