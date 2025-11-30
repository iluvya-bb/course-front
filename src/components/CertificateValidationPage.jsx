import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import API, { API_URL } from "../services/api";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaTrophy, FaCertificate, FaDownload, FaSpinner, FaEye, FaTimes } from "react-icons/fa";

function CertificateValidationPage() {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [certificates, setCertificates] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [searched, setSearched] = useState(false);
	const [downloadingId, setDownloadingId] = useState(null);
	const [viewingCert, setViewingCert] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSearched(false);
		setCertificates(null);

		try {
			const response = await API.validateCertificates(email);
			setCertificates(response.data.data || []);
			setSearched(true);
		} catch (err) {
			console.error("Failed to validate certificates:", err);
			setError(t("certificates.validation.error_validate"));
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getPdfUrl = (cert) => {
		if (cert?.pdfUrl) {
			return `${API_URL}/${cert.pdfUrl}`;
		}
		return null;
	};

	const handleDownloadPDF = async (certificateId) => {
		setDownloadingId(certificateId);
		try {
			const response = await API.downloadCertificatePDF(certificateId);
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `certificate-${certificateId}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Failed to download certificate PDF:", err);
			if (err.response?.status === 401) {
				setError(t("certificates.view.login_required", { defaultValue: "Please login to download" }));
			} else if (err.response?.status === 403) {
				setError(t("certificates.view.not_authorized", { defaultValue: "You are not authorized to download this certificate" }));
			} else {
				setError(t("certificates.page.download_failed", { defaultValue: "Failed to download certificate" }));
			}
		} finally {
			setDownloadingId(null);
		}
	};

	return (
		<div className="min-h-screen bg-base-100 relative overflow-hidden">
			{/* Grid Background */}
			<div
				className="fixed inset-0 opacity-[0.08] pointer-events-none"
				style={{
					backgroundImage: `
						linear-gradient(to right, #7776bc 1px, transparent 1px),
						linear-gradient(to bottom, #7776bc 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Animated gradient blobs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
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
				<motion.div
					className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl"
					animate={{
						scale: [1, 1.4, 1],
						x: [0, -30, 0],
						y: [0, 40, 0],
					}}
					transition={{
						duration: 30,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8 lg:mb-12"
				>
					<div className="flex items-center gap-4 mb-4">
						<motion.div
							whileHover={{ rotate: [0, -10, 10, -10, 0] }}
							transition={{ duration: 0.5 }}
							className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-brand-lavender to-brand-coral p-3 lg:p-4 shadow-lg"
						>
							<FaCertificate className="w-full h-full text-white" />
						</motion.div>
						<div>
							<h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
								{t("certificates.validation.title")}
							</h1>
							<p className="text-base-content/70 mt-1 text-sm lg:text-base">
								{t("certificates.validation.subtitle")}
							</p>
						</div>
					</div>
				</motion.div>

				{/* Search Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="bg-neutral rounded-3xl p-6 lg:p-8 mb-8 border-2 border-brand-lavender/20 shadow-xl"
				>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-bold text-base-content mb-3">
								{t("certificates.validation.email")}
							</label>
							<div className="flex flex-col sm:flex-row gap-3">
								<motion.input
									whileFocus={{ scale: 1.01 }}
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									placeholder={t("certificates.validation.email_placeholder")}
									className="flex-1 px-5 py-4 bg-base-100 border-2 border-brand-lavender/30 rounded-2xl focus:outline-none focus:border-brand-lavender focus:ring-4 focus:ring-brand-lavender/20 transition-all text-base-content placeholder-base-content/40"
								/>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									type="submit"
									disabled={loading}
									className="px-8 py-4 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
									style={{
										boxShadow: loading ? "none" : "4px 4px 0px #7776bc",
									}}
								>
									{loading ? (
										<>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
											>
												<FaSearch />
											</motion.div>
											{t("certificates.validation.searching")}
										</>
									) : (
										<>
											<FaSearch />
											{t("certificates.validation.search")}
										</>
									)}
								</motion.button>
							</div>
						</div>
					</form>
				</motion.div>

				{/* Error */}
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3"
					>
						<FaTimesCircle className="text-2xl flex-shrink-0" />
						<p className="font-medium">{error}</p>
					</motion.div>
				)}

				{/* Results */}
				{searched && certificates !== null && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="bg-neutral rounded-3xl p-6 lg:p-8 border-2 border-brand-lavender/20 shadow-xl"
					>
						{certificates.length === 0 ? (
							<div className="text-center py-16">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 200, damping: 15 }}
								>
									<FaTrophy className="text-8xl text-brand-lavender/30 mx-auto mb-6" />
								</motion.div>
								<h2 className="text-2xl font-bold text-base-content mb-3">
									{t("certificates.validation.no_certificates")}
								</h2>
								<p className="text-base-content/60 text-lg">
									{t("certificates.validation.no_certificates_for")} <strong className="text-brand-coral">{email}</strong>
								</p>
							</div>
						) : (
							<div>
								{/* Results Header */}
								<div className="mb-8 pb-6 border-b-2 border-brand-lavender/20">
									<h2 className="text-2xl lg:text-3xl font-black text-base-content mb-2">
										{t("certificates.validation.certificates_for")} <span className="text-brand-coral">{email}</span>
									</h2>
									<p className="text-base-content/70 text-base lg:text-lg flex items-center gap-2">
										<FaCheckCircle className="text-brand-lime" />
										{t("certificates.validation.found")} <strong>{certificates.length}</strong> {certificates.length === 1 ? t("certificates.validation.certificate") : t("certificates.validation.certificates")}
									</p>
								</div>

								{/* Certificate Cards */}
								<div className="space-y-6">
									{certificates.map((cert, index) => (
										<motion.div
											key={cert.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											whileHover={{ scale: 1.02, y: -4 }}
											className={`relative p-6 lg:p-8 rounded-3xl border-2 shadow-lg transition-all ${
												cert.valid
													? "border-brand-lime/40 bg-gradient-to-br from-green-50 to-brand-lime/10"
													: "border-red-400/40 bg-gradient-to-br from-red-50 to-red-100/50"
											}`}
											style={{
												boxShadow: cert.valid
													? "6px 6px 0px rgba(199, 236, 238, 0.4)"
													: "6px 6px 0px rgba(239, 68, 68, 0.2)",
											}}
										>
											<div className="flex flex-col lg:flex-row items-start justify-between gap-6">
												<div className="flex-1">
													<div className="flex items-center gap-4 mb-4">
														<motion.div
															animate={{ rotate: cert.valid ? [0, -10, 10, 0] : 0 }}
															transition={{ duration: 0.5 }}
															className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ${
																cert.valid
																	? "bg-gradient-to-br from-brand-lime to-green-500"
																	: "bg-gradient-to-br from-gray-300 to-gray-400"
															}`}
														>
															<FaTrophy className="text-3xl text-white" />
														</motion.div>
														<div>
															<h3 className="text-xl lg:text-2xl font-black text-base-content">
																{cert.courseName}
															</h3>
															<p className="text-base-content/60 font-medium">{cert.testName}</p>
														</div>
													</div>

													<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 bg-base-100/50 rounded-2xl p-4">
														<div className="flex flex-col">
															<span className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
																{t("certificates.page.certificate_id")}
															</span>
															<span className="font-mono text-sm lg:text-base font-bold text-brand-lavender">
																{cert.certificateId}
															</span>
														</div>
														<div className="flex flex-col">
															<span className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
																{t("certificates.page.score")}
															</span>
															<span className="text-base lg:text-lg font-black text-base-content">
																{parseFloat(cert.score).toFixed(1)}%
															</span>
														</div>
														<div className="flex flex-col">
															<span className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
																{t("certificates.page.issued")}
															</span>
															<span className="text-sm lg:text-base font-semibold text-base-content">
																{formatDate(cert.issuedAt)}
															</span>
														</div>
														{cert.expiresAt && (
															<div className="flex flex-col">
																<span className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
																	{t("certificates.page.expires")}
																</span>
																<span className="text-sm lg:text-base font-semibold text-base-content">
																	{formatDate(cert.expiresAt)}
																</span>
															</div>
														)}
													</div>
												</div>

												<div className="flex-shrink-0">
													{cert.valid ? (
														<motion.div
															initial={{ scale: 0 }}
															animate={{ scale: 1 }}
															transition={{ type: "spring", stiffness: 200, damping: 15 }}
															className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-lime to-green-500 text-white rounded-2xl shadow-lg font-bold"
															style={{
																boxShadow: "4px 4px 0px rgba(199, 236, 238, 0.6)",
															}}
														>
															<FaCheckCircle className="text-xl" />
															<span>{t("certificates.validation.valid")}</span>
														</motion.div>
													) : (
														<motion.div
															initial={{ scale: 0 }}
															animate={{ scale: 1 }}
															transition={{ type: "spring", stiffness: 200, damping: 15 }}
															className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-2xl shadow-lg font-bold"
															style={{
																boxShadow: "4px 4px 0px rgba(239, 68, 68, 0.3)",
															}}
														>
															<FaTimesCircle className="text-xl" />
															<span>{t("certificates.validation.invalid")}</span>
														</motion.div>
													)}
												</div>
											</div>

											{cert.revokedAt && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													className="mt-6 p-5 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-2xl"
												>
													<div className="flex items-start gap-3">
														<FaTimesCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
														<div>
															<p className="font-bold text-red-800 mb-2">
																{t("certificates.validation.certificate_revoked")}
															</p>
															<p className="text-sm text-red-700 mb-1">
																<strong>{t("certificates.validation.revoked_on")}:</strong> {formatDate(cert.revokedAt)}
															</p>
															{cert.revokeReason && (
																<p className="text-sm text-red-700">
																	<strong>{t("certificates.page.revoke_reason")}:</strong> {cert.revokeReason}
																</p>
															)}
														</div>
													</div>
												</motion.div>
											)}

											{cert.expiresAt && new Date(cert.expiresAt) < new Date() && !cert.revokedAt && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													className="mt-6 p-5 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-2xl"
												>
													<div className="flex items-start gap-3">
														<FaTimesCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
														<div>
															<p className="font-bold text-yellow-800 mb-2">
																{t("certificates.validation.certificate_expired")}
															</p>
															<p className="text-sm text-yellow-700">
																<strong>{t("certificates.validation.expired_on")}:</strong> {formatDate(cert.expiresAt)}
															</p>
														</div>
													</div>
												</motion.div>
											)}

											{/* View & Download buttons */}
											{cert.valid && (
												<div className="mt-6 flex gap-3">
													{getPdfUrl(cert) && (
														<motion.button
															whileHover={{ scale: 1.02 }}
															whileTap={{ scale: 0.98 }}
															onClick={() => setViewingCert(cert)}
															className="flex-1 py-3 bg-gradient-to-r from-brand-lime to-green-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all"
															style={{
																boxShadow: "3px 3px 0px #22c55e",
															}}
														>
															<FaEye />
															{t("certificates.page.view", { defaultValue: "View" })}
														</motion.button>
													)}
													<motion.button
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														onClick={() => handleDownloadPDF(cert.certificateId)}
														disabled={downloadingId === cert.certificateId}
														className={`${getPdfUrl(cert) ? "flex-1" : "w-full"} py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all`}
														style={{
															boxShadow: "3px 3px 0px #7776bc",
														}}
													>
														{downloadingId === cert.certificateId ? (
															<>
																<FaSpinner className="animate-spin" />
																{t("certificates.page.downloading", { defaultValue: "Downloading..." })}
															</>
														) : (
															<>
																<FaDownload />
																{t("certificates.page.download", { defaultValue: "Download" })}
															</>
														)}
													</motion.button>
												</div>
											)}
										</motion.div>
									))}
								</div>
							</div>
						)}
					</motion.div>
				)}
			</div>

			{/* PDF Viewer Modal */}
			<AnimatePresence>
				{viewingCert && getPdfUrl(viewingCert) && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
						onClick={() => setViewingCert(null)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-brand-lavender to-brand-coral text-white">
								<h3 className="font-bold text-lg truncate pr-4">
									{viewingCert.courseName} - {t("certificates.page.certificate_preview", { defaultValue: "Certificate Preview" })}
								</h3>
								<div className="flex items-center gap-2 flex-shrink-0">
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handleDownloadPDF(viewingCert.certificateId)}
										disabled={downloadingId === viewingCert.certificateId}
										className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
										title={t("certificates.page.download", { defaultValue: "Download" })}
									>
										{downloadingId === viewingCert.certificateId ? (
											<FaSpinner className="animate-spin" />
										) : (
											<FaDownload />
										)}
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setViewingCert(null)}
										className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
									>
										<FaTimes />
									</motion.button>
								</div>
							</div>
							{/* PDF Iframe */}
							<iframe
								src={getPdfUrl(viewingCert)}
								className="w-full h-full pt-14"
								title="Certificate PDF"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default CertificateValidationPage;
