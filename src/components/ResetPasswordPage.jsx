import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const ResetPasswordPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [validatingToken, setValidatingToken] = useState(true);
	const [tokenValid, setTokenValid] = useState(false);

	// Validate token on mount
	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				setError(
					t("reset_password.invalid_token", {
						defaultValue: "Хүчингүй эсвэл хугацаа дууссан холбоос.",
					})
				);
				setValidatingToken(false);
				return;
			}

			try {
				await API.validateResetToken(token);
				setTokenValid(true);
			} catch (err) {
				console.error("Token validation failed:", err);
				setError(
					err.response?.data?.error ||
						t("reset_password.token_expired", {
							defaultValue:
								"Энэ холбоосын хугацаа дууссан байна. Дахин нууц үг сэргээх хүсэлт илгээнэ үү.",
						})
				);
			} finally {
				setValidatingToken(false);
			}
		};

		validateToken();
	}, [token, t]);

	const validatePassword = () => {
		if (password.length < 8) {
			setError(
				t("reset_password.password_too_short", {
					defaultValue: "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.",
				})
			);
			return false;
		}

		if (password !== confirmPassword) {
			setError(
				t("reset_password.passwords_dont_match", {
					defaultValue: "Нууц үг таарахгүй байна.",
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
			await API.resetPassword(token, password);
			setSuccess(true);

			// Redirect to login after 3 seconds
			setTimeout(() => {
				navigate("/account");
			}, 3000);
		} catch (err) {
			console.error("Password reset failed:", err);
			setError(
				err.response?.data?.error ||
					t("reset_password.error", {
						defaultValue:
							"Нууц үг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.",
					})
			);
		} finally {
			setLoading(false);
		}
	};

	// Show loading state while validating token
	if (validatingToken) {
		return (
			<div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
				<div className="text-center space-y-4">
					<FaSpinner className="animate-spin text-5xl text-primary mx-auto" />
					<p className="text-base-content">
						{t("reset_password.validating", {
							defaultValue: "Холбоос шалгаж байна...",
						})}
					</p>
				</div>
			</div>
		);
	}

	// Show error if token is invalid
	if (!tokenValid && !validatingToken) {
		return (
			<div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md text-center"
				>
					<div className="bg-white rounded-lg shadow-xl p-8 border-2 border-red-200">
						<div className="flex justify-center mb-4">
							<div className="rounded-full bg-red-100 p-4">
								<FaExclamationTriangle className="text-4xl text-red-600" />
							</div>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							{t("reset_password.invalid_link", {
								defaultValue: "Хүчингүй холбоос",
							})}
						</h1>
						<p className="text-gray-600 mb-6">{error}</p>
						<Button
							onClick={() => navigate("/account")}
							className="w-full"
						>
							{t("reset_password.back_to_login", {
								defaultValue: "Нэвтрэх хуудас руу буцах",
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
							{t("reset_password.success_title", {
								defaultValue: "Амжилттай шинэчлэгдлээ!",
							})}
						</h1>
						<p className="text-gray-600 mb-6">
							{t("reset_password.success_message", {
								defaultValue:
									"Таны нууц үг амжилттай шинэчлэгдлээ. Та одоо шинэ нууц үгээрээ нэвтэрч болно.",
							})}
						</p>
						<p className="text-sm text-gray-500">
							{t("reset_password.redirecting", {
								defaultValue: "Нэвтрэх хуудас руу шилжиж байна...",
							})}
						</p>
					</div>
				</motion.div>
			</div>
		);
	}

	// Show reset password form
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
						{t("reset_password.title", {
							defaultValue: "Шинэ нууц үг үүсгэх",
						})}
					</h1>
					<p className="text-base-content/80 mt-2">
						{t("reset_password.subtitle", {
							defaultValue: "Шинэ нууц үгээ оруулна уу",
						})}
					</p>
				</div>

				<div className="bg-white p-8 rounded-lg border-2 border-neutral shadow-xl">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* New Password */}
						<div>
							<Label htmlFor="password">
								{t("reset_password.new_password", {
									defaultValue: "Шинэ нууц үг",
								})}
							</Label>
							<div className="relative mt-1">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="pr-10"
									required
									disabled={loading}
									minLength={8}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									disabled={loading}
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							<p className="text-xs text-gray-500 mt-1">
								{t("reset_password.password_requirements", {
									defaultValue: "Хамгийн багадаа 8 тэмдэгт",
								})}
							</p>
						</div>

						{/* Confirm Password */}
						<div>
							<Label htmlFor="confirmPassword">
								{t("reset_password.confirm_password", {
									defaultValue: "Нууц үг давтах",
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
									onClick={() =>
										setShowConfirmPassword(!showConfirmPassword)
									}
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
								? t("reset_password.updating", {
										defaultValue: "Шинэчилж байна...",
								  })
								: t("reset_password.update_password", {
										defaultValue: "Нууц үг шинэчлэх",
								  })}
						</Button>
					</form>

					{/* Back to Login Link */}
					<div className="mt-6 text-center">
						<button
							onClick={() => navigate("/account")}
							className="text-sm text-primary hover:underline"
							disabled={loading}
						>
							{t("reset_password.back_to_login", {
								defaultValue: "Нэвтрэх хуудас руу буцах",
							})}
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default ResetPasswordPage;
