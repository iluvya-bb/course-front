import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button"; // Correct import
import { Input } from "./ui/input"; // Correct import
import { Label } from "./ui/label"; // Correct import
import { useAuth } from "../contexts/AuthContext";
// Removed API_URL import, will use import.meta.env
import API from "../services/api";
import { FaSpinner, FaUserCircle, FaSave } from "react-icons/fa";

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
		}
	}, [user]);

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
		<div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md border border-neutral">
			<h1 className="text-2xl md:text-3xl font-bold text-base-content mb-6">
				{t("profile.title", "My Profile")}
			</h1>

			{error && (
				<div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
					{error}
				</div>
			)}
			{success && (
				<div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-300 rounded-md">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Avatar Preview and Upload */}
				<div className="flex flex-col items-center space-y-2">
					{avatarPreview ? (
						<img
							src={avatarPreview}
							alt="Avatar Preview"
							className="h-24 w-24 rounded-full object-cover border-4 border-neutral shadow-sm"
						/>
					) : (
						<FaUserCircle className="h-24 w-24 text-gray-300" />
					)}
					<Label
						htmlFor="avatar"
						className="text-sm font-medium text-primary hover:underline cursor-pointer"
					>
						{t("profile.change_avatar", "Change Avatar")}
					</Label>
					<Input
						id="avatar"
						type="file"
						onChange={handleFileChange}
						accept="image/*"
						className="hidden" // Visually hide the input
						disabled={loading}
					/>
				</div>

				{/* Username Field */}
				<div>
					<Label htmlFor="username">{t("settings.username")}</Label>
					<Input
						id="username"
						type="text"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
						// --- FIX: Removed conflicting daisyUI classes ---
						className="w-full mt-1"
						disabled={loading}
					/>
				</div>

				{/* Email Field */}
				<div>
					<Label htmlFor="email">{t("settings.email")}</Label>
					<Input
						id="email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						// --- FIX: Removed conflicting daisyUI classes ---
						className="w-full mt-1"
						disabled={loading}
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-2">
					<Button
						type="submit"
						// --- FIX: Removed conflicting daisyUI classes ---
						className="w-full"
						disabled={loading}
					>
						{loading && <FaSpinner className="animate-spin mr-2" />}
						{loading ? (
							t("saving", "Saving...")
						) : (
							<>
								<FaSave className="mr-2" /> {t("save_changes", "Save Changes")}
							</>
						)}
					</Button>
				</div>
			</form>

			{/* Link to change password */}
			<div className="text-center mt-4">
				<Link
					to="/change-password"
					className="text-sm text-primary hover:underline"
				>
					{t("profile.change_password", "Change Password")}
				</Link>
			</div>
		</div>
	);
};

export default ProfilePage;
