import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
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

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop with blur */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={handleClose}
					/>

					{/* Modal Container */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
						className="relative max-w-md w-full"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Animated background blobs */}
						<div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
							<motion.div
								className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-20"
								style={{
									background: "radial-gradient(circle, #7776bc 0%, transparent 70%)",
									filter: "blur(40px)",
								}}
								animate={{
									scale: [1, 1.2, 1],
									x: [0, 20, 0],
									y: [0, -10, 0],
								}}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
							<motion.div
								className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-20"
								style={{
									background: "radial-gradient(circle, #ff764d 0%, transparent 70%)",
									filter: "blur(40px)",
								}}
								animate={{
									scale: [1, 1.3, 1],
									x: [0, -20, 0],
									y: [0, 10, 0],
								}}
								transition={{
									duration: 10,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</div>

						{/* Glass morphism card */}
						<div
							className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl"
							style={{
								background: "rgba(255, 255, 255, 0.95)",
								boxShadow: "0 25px 50px rgba(119, 118, 188, 0.3)",
							}}
						>
							{/* Gradient overlay */}
							<motion.div
								className="absolute inset-0 opacity-10"
								style={{
									background:
										"linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3))",
								}}
								animate={{
									background: [
										"linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3))",
										"linear-gradient(135deg, rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3), rgba(119, 118, 188, 0.3))",
										"linear-gradient(135deg, rgba(221, 236, 81, 0.3), rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3))",
										"linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3))",
									],
								}}
								transition={{
									duration: 10,
									repeat: Infinity,
									ease: "linear",
								}}
							/>

							{/* Header */}
							<div className="relative flex items-center justify-between p-6 border-b border-white/20">
								<motion.h2
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.4, delay: 0.1 }}
									className="text-2xl font-black flex items-center gap-3"
								>
									<motion.div
										className="p-3 rounded-xl"
										style={{
											background: "linear-gradient(135deg, #7776bc, #ff764d)",
										}}
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ duration: 0.3 }}
									>
										<FaEnvelope className="text-white text-xl" />
									</motion.div>
									<span
										className="text-transparent"
										style={{
											backgroundImage:
												"linear-gradient(110deg, #7776bc 0%, #9b87d4 25%, #ff764d 50%, #9b87d4 75%, #7776bc 100%)",
											backgroundSize: "200% 100%",
											backgroundPosition: "50% 0%",
											WebkitBackgroundClip: "text",
											backgroundClip: "text",
										}}
									>
										{t("forgot_password.title", {
											defaultValue: "Нууц үг сэргээх",
										})}
									</span>
								</motion.h2>
								<motion.button
									onClick={handleClose}
									className="p-2 rounded-full hover:bg-base-content/5 transition-colors"
									disabled={loading}
									whileHover={{ scale: 1.1, rotate: 90 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, rotate: -90 }}
									animate={{ opacity: 1, rotate: 0 }}
									transition={{ duration: 0.4, delay: 0.2 }}
								>
									<FaTimes className="text-xl text-base-content/60" />
								</motion.button>
							</div>

							{/* Content */}
							<div className="relative p-6">
								<AnimatePresence mode="wait">
									{success ? (
										<motion.div
											key="success"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											transition={{ duration: 0.4 }}
											className="text-center space-y-6"
										>
											<motion.div
												className="flex justify-center"
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{
													duration: 0.5,
													delay: 0.2,
													type: "spring",
													stiffness: 200,
													damping: 15,
												}}
											>
												<motion.div
													className="rounded-full p-4"
													style={{
														background:
															"linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))",
														border: "2px solid rgba(34, 197, 94, 0.3)",
													}}
													animate={{
														boxShadow: [
															"0 0 0 0 rgba(34, 197, 94, 0.4)",
															"0 0 0 20px rgba(34, 197, 94, 0)",
														],
													}}
													transition={{
														duration: 2,
														repeat: Infinity,
													}}
												>
													<FaCheckCircle className="text-5xl text-green-600" />
												</motion.div>
											</motion.div>
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.4, delay: 0.3 }}
											>
												<h3 className="text-2xl font-bold text-base-content mb-3">
													{t("forgot_password.success_title", {
														defaultValue: "Имэйл илгээгдлээ!",
													})}
												</h3>
												<p className="text-base-content/70 text-sm leading-relaxed">
													{t("forgot_password.success_message", {
														defaultValue:
															"Нууц үг сэргээх заавар таны имэйл хаяг руу илгээгдлээ. Хэрвээ имэйл ирээгүй бол спам фолдероо шалгана уу.",
													})}
												</p>
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.5 }}
													className="mt-4 p-3 rounded-xl bg-base-content/5"
												>
													<p className="text-base-content/60 text-xs">
														{t("forgot_password.email_sent_to", {
															defaultValue: "Имэйл хаяг:",
														})}
													</p>
													<p className="text-base-content font-bold mt-1">{email}</p>
												</motion.div>
											</motion.div>
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.4, delay: 0.4 }}
											>
												<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
													<Button
														onClick={handleClose}
														className="w-full relative overflow-hidden group"
														style={{
															background: "linear-gradient(135deg, #7776bc, #ff764d)",
														}}
													>
														<span className="relative z-10 text-white font-bold">
															{t("forgot_password.close", { defaultValue: "Хаах" })}
														</span>
													</Button>
												</motion.div>
											</motion.div>
										</motion.div>
									) : (
										<motion.form
											key="form"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.3 }}
											onSubmit={handleSubmit}
											className="space-y-5"
										>
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.4, delay: 0.1 }}
												className="text-base-content/70 text-sm leading-relaxed"
											>
												{t("forgot_password.description", {
													defaultValue:
														"Бүртгэлтэй имэйл хаягаа оруулна уу. Бид танд нууц үг сэргээх заавар илгээх болно.",
												})}
											</motion.p>

											<motion.div
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.4, delay: 0.2 }}
											>
												<Label htmlFor="forgot-email" className="text-base-content font-semibold">
													{t("forgot_password.email_label", {
														defaultValue: "Имэйл хаяг",
													})}
												</Label>
												<motion.div whileFocus={{ scale: 1.01 }} className="mt-2">
													<Input
														id="forgot-email"
														type="email"
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														placeholder={t("forgot_password.email_placeholder", {
															defaultValue: "your@email.com",
														})}
														className="bg-white/50 border-white/40 focus:border-brand-lavender focus:ring-brand-lavender/50 transition-all duration-300"
														required
														disabled={loading}
														autoFocus
													/>
												</motion.div>
											</motion.div>

											{error && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-semibold"
												>
													{error}
												</motion.div>
											)}

											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.4, delay: 0.3 }}
												className="flex gap-3 pt-2"
											>
												<motion.div
													className="flex-1"
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Button
														type="button"
														onClick={handleClose}
														variant="outline"
														className="w-full border-2 border-base-content/20 hover:border-brand-lavender hover:bg-brand-lavender/5 transition-all"
														disabled={loading}
													>
														{t("forgot_password.cancel", { defaultValue: "Цуцлах" })}
													</Button>
												</motion.div>
												<motion.div
													className="flex-1"
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Button
														type="submit"
														className="w-full relative overflow-hidden group"
														disabled={loading}
														style={{
															background: "linear-gradient(135deg, #7776bc, #ff764d)",
														}}
													>
														<motion.div
															className="absolute inset-0 bg-gradient-to-r from-brand-coral via-brand-yellow to-brand-coral opacity-0 group-hover:opacity-100"
															style={{ backgroundSize: "200% 100%" }}
															animate={{
																backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
															}}
															transition={{
																duration: 3,
																repeat: Infinity,
																ease: "linear",
															}}
														/>
														<span className="relative z-10 flex items-center justify-center text-white font-bold">
															{loading && <FaSpinner className="animate-spin mr-2" />}
															{loading
																? t("forgot_password.sending", {
																		defaultValue: "Илгээж байна...",
																  })
																: t("forgot_password.send", {
																		defaultValue: "Илгээх",
																  })}
														</span>
													</Button>
												</motion.div>
											</motion.div>
										</motion.form>
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default ForgotPasswordModal;
