import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button"; // Correct import
import { Input } from "./ui/input"; // Correct import
import { Label } from "./ui/label"; // Correct import
import { useAuth } from "../contexts/AuthContext";
// Removed API_URL import, will use import.meta.env
import API from "../services/api";
import {
	FaSpinner,
	FaUserCircle,
	FaSave,
	FaWallet,
	FaChalkboardTeacher,
	FaKey,
	FaEdit,
	FaEnvelope,
	FaUser,
	FaCalendarAlt,
	FaCheckCircle,
	FaClock,
	FaTimesCircle,
} from "react-icons/fa";

const ProfilePage = () => {
	const { t } = useTranslation(["translation", "settings"]);
	const { user, setUser } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
	});
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [wallet, setWallet] = useState(null);
	const [loadingWallet, setLoadingWallet] = useState(true);
	const [teacherApplication, setTeacherApplication] = useState(null);
	const [loadingApplication, setLoadingApplication] = useState(true);

	useEffect(() => {
		if (user) {
			setFormData({
				username: user.username || "",
				email: user.email || "",
			});
			if (user.avatar) {
				// --- FIX: Use Vite env variable ---
				setAvatarPreview(`${import.meta.env.VITE_API_URL}/${user.avatar}`);
			} else {
				setAvatarPreview(null);
			}
			fetchWallet();
			fetchTeacherApplication();
		}
	}, [user]);

	const fetchWallet = async () => {
		setLoadingWallet(true);
		try {
			const walletRes = await API.getMyWallet();
			setWallet(walletRes?.data?.data);
		} catch (err) {
			console.error("Failed to fetch wallet:", err);
		} finally {
			setLoadingWallet(false);
		}
	};

	const fetchTeacherApplication = async () => {
		setLoadingApplication(true);
		try {
			const response = await API.getMyTeacherApplication();
			setTeacherApplication(response.data.data);
		} catch (err) {
			console.log("No teacher application found");
		} finally {
			setLoadingApplication(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatarFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		} else {
			setAvatarFile(null);
			// --- FIX: Use Vite env variable ---
			setAvatarPreview(
				user?.avatar ? `${import.meta.env.VITE_API_URL}/${user.avatar}` : null,
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		const data = new FormData();
		data.append("username", formData.username);
		data.append("email", formData.email);

		if (avatarFile) {
			data.append("avatar", avatarFile);
		}

		try {
			const response = await API.updateProfile(data);
			setUser(response.data.data); // Update context
			setSuccess(t("profile.update_success", "Profile updated successfully!"));
			setAvatarFile(null);
			if (response.data.data.avatar) {
				// --- FIX: Use Vite env variable ---
				setAvatarPreview(
					`${import.meta.env.VITE_API_URL}/${response.data.data.avatar}`,
				);
			}
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			console.error("Failed to update profile:", err);
			const errorMsg =
				err.response?.data?.error ||
				t("profile.update_error", "Failed to update profile.");
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	const formatBalance = (balanceValue) => {
		const numBalance = parseFloat(balanceValue);
		if (!isNaN(numBalance)) {
			return numBalance.toFixed(2);
		}
		return "0.00";
	};

	const getTeacherStatusBadge = () => {
		if (user?.role === "teacher") {
			return (
				<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
					<FaCheckCircle className="mr-2" />
					{t("profile.teacher_verified", "Verified Teacher")}
				</div>
			);
		}

		if (!teacherApplication) return null;

		if (teacherApplication.status === "pending") {
			return (
				<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
					<FaClock className="mr-2" />
					{t("profile.teacher_pending", "Application Pending")}
				</div>
			);
		}

		if (teacherApplication.status === "rejected") {
			return (
				<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-300">
					<FaTimesCircle className="mr-2" />
					{t("profile.teacher_rejected", "Application Rejected")}
				</div>
			);
		}

		return null;
	};

	if (!user && loading) {
		// Show loading only if user is not yet available
		return (
			<div className="flex justify-center items-center h-64">
				<FaSpinner className="animate-spin text-indigo-600 mr-3 h-8 w-8" />
				<span>{t("loading")}...</span>
			</div>
		);
	}

	// This case handles if user somehow logs out or auth fails
	if (!user) {
		return (
			<div className="text-center p-4">
				{t("settings.user_info_unavailable", "User information unavailable.")}
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			{/* Page Header */}
			<div className="p-6 md:p-8 bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8">
				<h1 className="text-3xl md:text-4xl font-black text-base-content mb-2">
					{t("profile.title", "My Profile")}
				</h1>
				<p className="text-base-content/70 text-lg">
					{t(
						"profile.subtitle",
						"Manage your account settings and preferences",
					)}
				</p>
			</div>

			{/* Alert Messages */}
			{error && (
				<div className="mb-6 p-4 text-red-700 bg-red-100 border-2 border-red-300 rounded-md">
					{error}
				</div>
			)}
			{success && (
				<div className="mb-6 p-4 text-green-700 bg-green-100 border-2 border-green-300 rounded-md">
					{success}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Profile Card & Wallet */}
				<div className="lg:col-span-1 space-y-6">
					{/* Profile Overview Card */}
					<div className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] overflow-hidden">
						<div className="bg-gradient-to-r from-brand-lavender to-brand-coral h-24"></div>
						<div className="px-6 pb-6">
							<div className="flex flex-col items-center -mt-12">
								{avatarPreview ? (
									<img
										src={avatarPreview}
										alt="Avatar"
										className="h-24 w-24 rounded-full object-cover border-4 border-neutral shadow-lg"
									/>
								) : (
									<div className="h-24 w-24 rounded-full bg-base-200 border-4 border-neutral shadow-lg flex items-center justify-center">
										<FaUserCircle className="h-16 w-16 text-base-content/40" />
									</div>
								)}
								<h2 className="mt-4 text-2xl font-bold text-base-content">
									{user?.username || "User"}
								</h2>
								<p className="text-sm text-base-content/70 flex items-center mt-1">
									<FaEnvelope className="mr-2" />
									{user?.email}
								</p>
								{user?.createdAt && (
									<p className="text-xs text-base-content/60 flex items-center mt-2">
										<FaCalendarAlt className="mr-2" />
										{t("profile.member_since", "Member since")}{" "}
										{new Date(user.createdAt).toLocaleDateString()}
									</p>
								)}
								<div className="mt-4">{getTeacherStatusBadge()}</div>
							</div>
						</div>
					</div>

					{/* Wallet Card */}
					<div className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] p-6">
						<h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
							<FaWallet className="mr-2 text-brand-lavender" />
							{t("profile.wallet", "Wallet")}
						</h3>
						{loadingWallet ? (
							<div className="flex items-center justify-center py-4">
								<FaSpinner className="animate-spin text-brand-lavender mr-2" />
								<span className="text-base-content/70">{t("loading")}...</span>
							</div>
						) : wallet ? (
							<div>
								<div className="bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 rounded-lg p-4 mb-4 border-2 border-brand-lavender/20">
									<p className="text-sm text-base-content/70 mb-1">
										{t("profile.current_balance", "Current Balance")}
									</p>
									<p className="text-3xl font-bold text-brand-lavender">
										{formatBalance(wallet.balance)} {wallet.currency || "MNT"}
									</p>
								</div>
								<Link to="/wallet">
									<Button className="w-full" size="sm" variant="outline">
										<FaWallet className="mr-2" />
										{t("profile.add_funds", "Add Funds")}
									</Button>
								</Link>
							</div>
						) : (
							<p className="text-base-content/70 text-sm">
								{t(
									"profile.wallet_not_found",
									"Wallet information unavailable",
								)}
							</p>
						)}
					</div>

					{/* Teacher Application Card */}
					{user && user.role !== "teacher" && user.role !== "admin" && (
						<div className="bg-gradient-to-br from-brand-lavender to-brand-coral rounded-md border-2 border-brand-coral shadow-[4px_4px_0px_#1A1A1A] p-6 text-white">
							<h3 className="text-xl font-bold mb-3 flex items-center">
								<FaChalkboardTeacher className="mr-2" />
								{t("profile.become_teacher", "Become a Teacher")}
							</h3>
							<p className="text-sm mb-4 text-white/90">
								{t(
									"profile.teacher_description",
									"Share your knowledge and earn by teaching courses on our platform.",
								)}
							</p>
							<Link to="/apply-teacher">
								<Button
									className="w-full bg-white text-brand-lavender hover:bg-base-100 font-bold"
									disabled={teacherApplication?.status === "pending"}
								>
									{teacherApplication?.status === "pending" ? (
										<>
											<FaClock className="mr-2" />
											{t("profile.application_pending", "Application Pending")}
										</>
									) : teacherApplication?.status === "rejected" ? (
										<>
											<FaEdit className="mr-2" />
											{t("profile.reapply", "Reapply Now")}
										</>
									) : (
										<>
											<FaChalkboardTeacher className="mr-2" />
											{t("profile.apply_now", "Apply Now")}
										</>
									)}
								</Button>
							</Link>
						</div>
					)}

					{/* Quick Actions */}
					<div className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] p-6">
						<h3 className="text-lg font-bold text-base-content mb-4">
							{t("profile.quick_actions", "Quick Actions")}
						</h3>
						<div className="space-y-2">
							<Link to="/change-password" className="block">
								<Button
									variant="ghost"
									className="w-full justify-start text-left"
								>
									<FaKey className="mr-3 text-base-content/70" />
									{t("profile.change_password", "Change Password")}
								</Button>
							</Link>
						</div>
					</div>
				</div>

				{/* Right Column - Edit Profile Form */}
				<div className="lg:col-span-2">
					<div className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] p-6 md:p-8">
						<h2 className="text-2xl font-bold text-base-content mb-6 flex items-center">
							<FaEdit className="mr-3 text-brand-lavender" />
							{t("profile.edit_profile", "Edit Profile")}
						</h2>

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Avatar Upload Section */}
							<div className="border-b border-base-content/20 pb-6">
								<Label className="text-sm font-medium text-base-content mb-4 block">
									{t("profile.profile_picture", "Profile Picture")}
								</Label>
								<div className="flex items-center space-x-6">
									{avatarPreview ? (
										<img
											src={avatarPreview}
											alt="Avatar Preview"
											className="h-20 w-20 rounded-full object-cover border-2 border-brand-lavender"
										/>
									) : (
										<FaUserCircle className="h-20 w-20 text-base-content/30" />
									)}
									<div className="flex-1">
										<Label
											htmlFor="avatar"
											className="inline-flex items-center px-4 py-2 bg-brand-lavender/10 text-brand-lavender rounded-lg cursor-pointer hover:bg-brand-lavender/20 transition-colors font-medium"
										>
											<FaEdit className="mr-2" />
											{t("profile.change_avatar", "Change Avatar")}
										</Label>
										<Input
											id="avatar"
											type="file"
											onChange={handleFileChange}
											accept="image/*"
											className="hidden"
											disabled={loading}
										/>
										<p className="text-xs text-base-content/60 mt-2">
											{t(
												"profile.avatar_help",
												"JPG, PNG or GIF. Max size 2MB.",
											)}
										</p>
									</div>
								</div>
							</div>

							{/* Username Field */}
							<div>
								<Label
									htmlFor="username"
									className="text-sm font-medium text-base-content mb-2 block"
								>
									<FaUser className="inline mr-2 text-brand-lavender" />
									{t("settings.username", "Username")}
								</Label>
								<Input
									id="username"
									type="text"
									name="username"
									value={formData.username}
									onChange={handleChange}
									required
									className="w-full"
									disabled={loading}
									placeholder={t(
										"profile.username_placeholder",
										"Enter your username",
									)}
								/>
							</div>

							{/* Email Field */}
							<div>
								<Label
									htmlFor="email"
									className="text-sm font-medium text-base-content mb-2 block"
								>
									<FaEnvelope className="inline mr-2 text-brand-lavender" />
									{t("settings.email", "Email")}
								</Label>
								<Input
									id="email"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full"
									disabled={loading}
									placeholder={t(
										"profile.email_placeholder",
										"Enter your email",
									)}
								/>
							</div>

							{/* Submit Button */}
							<div className="pt-4">
								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-brand-lavender to-brand-coral text-white hover:opacity-90 font-bold"
									disabled={loading}
								>
									{loading ? (
										<>
											<FaSpinner className="animate-spin mr-2" />
											{t("saving", "Saving...")}
										</>
									) : (
										<>
											<FaSave className="mr-2" />
											{t("save_changes", "Save Changes")}
										</>
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
