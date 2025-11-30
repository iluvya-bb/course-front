import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import {
	FaLock,
	FaSpinner,
	FaCheckCircle,
	FaExclamationTriangle,
	FaEye,
	FaEyeSlash,
} from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const ChangePasswordPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const validatePassword = () => {
		if (newPassword.length < 8) {
			setError(
				t("change_password.password_too_short", {
					defaultValue: "Шинэ нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.",
				})
			);
			return false;
		}

		if (newPassword !== confirmPassword) {
			setError(
				t("change_password.passwords_dont_match", {
					defaultValue: "Шинэ нууц үг таарахгүй байна.",
				})
			);
			return false;
		}

		if (currentPassword === newPassword) {
			setError(
				t("change_password.same_password", {
					defaultValue: "Шинэ нууц үг одоогийн нууц үгтэй ижил байж болохгүй.",
				})
			);
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!validatePassword()) {
			return;
		}

		setLoading(true);

		try {
			await API.changePassword(currentPassword, newPassword);
			setSuccess(true);

			// Redirect to profile after 3 seconds
			setTimeout(() => {
				navigate("/profile");
			}, 3000);
		} catch (err) {
			console.error("Password change failed:", err);
			setError(
				err.response?.data?.error ||
					t("change_password.error", {
						defaultValue:
							"Нууц үг солиход алдаа гарлаа. Дахин оролдоно уу.",
					})
			);
		} finally {
			setLoading(false);
		}
	};

	// Check if user logged in via OAuth
	if (user?.oauthProvider) {
		return (
			<div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md text-center"
				>
					<div className="bg-white rounded-lg shadow-xl p-8 border-2 border-yellow-200">
						<div className="flex justify-center mb-4">
							<div className="rounded-full bg-yellow-100 p-4">
								<FaExclamationTriangle className="text-4xl text-yellow-600" />
							</div>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							{t("change_password.oauth_user_title", {
								defaultValue: "Нууц үг солих боломжгүй",
							})}
						</h1>
						<p className="text-gray-600 mb-6">
							{t("change_password.oauth_user_message", {
								defaultValue:
									"Та Google-ээр нэвтэрсэн тул нууц үг солих боломжгүй байна.",
							})}
						</p>
						<Button onClick={() => navigate("/profile")} className="w-full">
							{t("change_password.back_to_profile", {
								defaultValue: "Профайл руу буцах",
							})}
						</Button>
					</div>
				</motion.div>
			</div>
		);
	}

	// Show success message
	if (success) {
		return (
			<div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md text-center"
				>
					<div className="bg-white rounded-lg shadow-xl p-8 border-2 border-green-200">
						<div className="flex justify-center mb-4">
							<div className="rounded-full bg-green-100 p-4">
								<FaCheckCircle className="text-5xl text-green-600" />
							</div>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							{t("change_password.success_title", {
								defaultValue: "Амжилттай солигдлоо!",
							})}
						</h1>
						<p className="text-gray-600 mb-6">
							{t("change_password.success_message", {
								defaultValue:
									"Таны нууц үг амжилттай солигдлоо.",
							})}
						</p>
						<p className="text-sm text-gray-500">
							{t("change_password.redirecting", {
								defaultValue: "Профайл хуудас руу шилжиж байна...",
							})}
						</p>
					</div>
				</motion.div>
			</div>
		);
	}

	// Show change password form
	return (
		<div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="rounded-full bg-indigo-100 p-4">
							<FaLock className="text-4xl text-indigo-600" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-base-content">
						{t("change_password.title", {
							defaultValue: "Нууц үг солих",
						})}
					</h1>
					<p className="text-base-content/80 mt-2">
						{t("change_password.subtitle", {
							defaultValue: "Одоогийн болон шинэ нууц үгээ оруулна уу",
						})}
					</p>
				</div>

				<div className="bg-white p-8 rounded-lg border-2 border-neutral shadow-xl">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Current Password */}
						<div>
							<Label htmlFor="currentPassword">
								{t("change_password.current_password", {
									defaultValue: "Одоогийн нууц үг",
								})}
							</Label>
							<div className="relative mt-1">
								<Input
									id="currentPassword"
									type={showCurrentPassword ? "text" : "password"}
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
									placeholder="••••••••"
									className="pr-10"
									required
									disabled={loading}
								/>
								<button
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									disabled={loading}
								>
									{showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						{/* New Password */}
						<div>
							<Label htmlFor="newPassword">
								{t("change_password.new_password", {
									defaultValue: "Шинэ нууц үг",
								})}
							</Label>
							<div className="relative mt-1">
								<Input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="••••••••"
									className="pr-10"
									required
									disabled={loading}
									minLength={8}
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									disabled={loading}
								>
									{showNewPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							<p className="text-xs text-gray-500 mt-1">
								{t("change_password.password_requirements", {
									defaultValue: "Хамгийн багадаа 8 тэмдэгт",
								})}
							</p>
						</div>

						{/* Confirm Password */}
						<div>
							<Label htmlFor="confirmPassword">
								{t("change_password.confirm_password", {
									defaultValue: "Шинэ нууц үг давтах",
								})}
							</Label>
							<div className="relative mt-1">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="••••••••"
									className="pr-10"
									required
									disabled={loading}
									minLength={8}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									disabled={loading}
								>
									{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start gap-2">
								<FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
								<span>{error}</span>
							</div>
						)}

						{/* Submit Button */}
						<Button type="submit" className="w-full" disabled={loading}>
							{loading && <FaSpinner className="animate-spin mr-2" />}
							{loading
								? t("change_password.changing", {
										defaultValue: "Солиж байна...",
								  })
								: t("change_password.change_password", {
										defaultValue: "Нууц үг солих",
								  })}
						</Button>
					</form>

					{/* Back to Profile Link */}
					<div className="mt-6 text-center">
						<button
							onClick={() => navigate("/profile")}
							className="text-sm text-primary hover:underline"
							disabled={loading}
						>
							{t("change_password.back_to_profile", {
								defaultValue: "Профайл руу буцах",
							})}
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default ChangePasswordPage;
