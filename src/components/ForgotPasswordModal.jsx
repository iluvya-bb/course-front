import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { FaTimes, FaEnvelope, FaSpinner, FaCheckCircle } from "react-icons/fa";
import API from "../services/api";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Call forgot password API endpoint
			await API.forgotPassword(email);
			setSuccess(true);
		} catch (err) {
			console.error("Forgot password failed:", err);
			setError(
				err.response?.data?.error ||
					t("forgot_password.error", {
						defaultValue:
							"Нууц үг сэргээхэд алдаа гарлаа. Имэйл хаягаа шалгана уу.",
					})
			);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setEmail("");
		setError(null);
		setSuccess(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.2 }}
				className="bg-white rounded-lg shadow-xl max-w-md w-full"
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
						<FaEnvelope className="text-indigo-600" />
						{t("forgot_password.title", {
							defaultValue: "Нууц үг сэргээх",
						})}
					</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 transition"
						disabled={loading}
					>
						<FaTimes className="text-xl" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{success ? (
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="rounded-full bg-green-100 p-3">
									<FaCheckCircle className="text-4xl text-green-600" />
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{t("forgot_password.success_title", {
										defaultValue: "Имэйл илгээгдлээ!",
									})}
								</h3>
								<p className="text-gray-600 text-sm">
									{t("forgot_password.success_message", {
										defaultValue:
											"Нууц үг сэргээх заавар таны имэйл хаяг руу илгээгдлээ. Хэрвээ имэйл ирээгүй бол спам фолдероо шалгана уу.",
									})}
								</p>
								<p className="text-gray-500 text-xs mt-4">
									{t("forgot_password.email_sent_to", {
										defaultValue: "Имэйл хаяг:",
									})}{" "}
									<strong>{email}</strong>
								</p>
							</div>
							<Button onClick={handleClose} className="w-full">
								{t("forgot_password.close", { defaultValue: "Хаах" })}
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<p className="text-gray-600 text-sm mb-4">
								{t("forgot_password.description", {
									defaultValue:
										"Бүртгэлтэй имэйл хаягаа оруулна уу. Бид танд нууц үг сэргээх заавар илгээх болно.",
								})}
							</p>

							<div>
								<Label htmlFor="forgot-email">
									{t("forgot_password.email_label", {
										defaultValue: "Имэйл хаяг",
									})}
								</Label>
								<Input
									id="forgot-email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={t("forgot_password.email_placeholder", {
										defaultValue: "your@email.com",
									})}
									className="mt-1"
									required
									disabled={loading}
									autoFocus
								/>
							</div>

							{error && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
									{error}
								</div>
							)}

							<div className="flex gap-3 pt-2">
								<Button
									type="button"
									onClick={handleClose}
									variant="outline"
									className="flex-1"
									disabled={loading}
								>
									{t("forgot_password.cancel", { defaultValue: "Цуцлах" })}
								</Button>
								<Button type="submit" className="flex-1" disabled={loading}>
									{loading && <FaSpinner className="animate-spin mr-2" />}
									{loading
										? t("forgot_password.sending", {
												defaultValue: "Илгээж байна...",
										  })
										: t("forgot_password.send", {
												defaultValue: "Илгээх",
										  })}
								</Button>
							</div>
						</form>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default ForgotPasswordModal;
