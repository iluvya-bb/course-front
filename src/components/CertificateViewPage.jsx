import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import API, { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
	FaCheckCircle,
	FaTimesCircle,
	FaTrophy,
	FaCertificate,
	FaDownload,
	FaSpinner,
	FaSignInAlt,
	FaEye,
	FaTimes,
} from "react-icons/fa";

function CertificateViewPage() {
	const { certificateId } = useParams();
	const { t } = useTranslation();
	const { user } = useAuth();
	const [certificate, setCertificate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [downloading, setDownloading] = useState(false);
	const [downloadError, setDownloadError] = useState("");
	const [showPdfViewer, setShowPdfViewer] = useState(false);

	useEffect(() => {
		fetchCertificate();
	}, [certificateId]);

	const fetchCertificate = async () => {
		setLoading(true);
		setError("");

		try {
			const response = await API.getCertificate(certificateId);
			setCertificate(response.data.data);
		} catch (err) {
			console.error("Failed to fetch certificate:", err);
			if (err.response?.status === 404) {
				setError(t("certificates.view.not_found", { defaultValue: "Certificate not found" }));
			} else {
				setError(t("certificates.view.error", { defaultValue: "Failed to load certificate" }));
			}
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async () => {
		setDownloading(true);
		setDownloadError("");
		try {
			const response = await API.downloadCertificatePDF(certificateId);
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `certificate-${certificateId}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			console.error("Failed to download certificate:", err);
			if (err.response?.status === 401) {
				setDownloadError(t("certificates.view.login_required", { defaultValue: "Please login to download" }));
			} else if (err.response?.status === 403) {
				setDownloadError(t("certificates.view.not_authorized", { defaultValue: "You are not authorized to download this certificate" }));
			} else {
				setDownloadError(t("certificates.view.download_failed", { defaultValue: "Failed to download certificate" }));
			}
		} finally {
			setDownloading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("mn-MN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const isValid = certificate && !certificate.revokedAt &&
		(!certificate.expiresAt || new Date(certificate.expiresAt) > new Date());

	const getPdfUrl = () => {
		if (certificate?.pdfUrl) {
			return `${API_URL}/${certificate.pdfUrl}`;
		}
		return null;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-base-100 flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				>
					<FaSpinner className="text-5xl text-brand-lavender" />
				</motion.div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-base-100 flex items-center justify-center">
				<div className="text-center">
					<FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-base-content mb-2">{error}</h1>
					<p className="text-base-content/60">
						{t("certificates.view.check_id", { defaultValue: "Please check the certificate ID and try again." })}
					</p>
				</div>
			</div>
		);
	}

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
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-8"
				>
					<motion.div
						whileHover={{ rotate: [0, -10, 10, -10, 0] }}
						transition={{ duration: 0.5 }}
						className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-lavender to-brand-coral p-4 shadow-lg mb-4"
					>
						<FaCertificate className="w-full h-full text-white" />
					</motion.div>
					<h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
						{t("certificates.view.title", { defaultValue: "Certificate Verification" })}
					</h1>
				</motion.div>

				{/* Certificate Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className={`relative p-8 lg:p-10 rounded-3xl border-2 shadow-xl ${
						isValid
							? "border-brand-lime/40 bg-gradient-to-br from-green-50 to-brand-lime/10"
							: "border-red-400/40 bg-gradient-to-br from-red-50 to-red-100/50"
					}`}
					style={{
						boxShadow: isValid
							? "8px 8px 0px rgba(199, 236, 238, 0.4)"
							: "8px 8px 0px rgba(239, 68, 68, 0.2)",
					}}
				>
					{/* Status Badge */}
					<div className="absolute top-6 right-6">
						{isValid ? (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 200, damping: 15 }}
								className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-lime to-green-500 text-white rounded-2xl shadow-lg font-bold"
							>
								<FaCheckCircle className="text-xl" />
								<span>{t("certificates.validation.valid", { defaultValue: "Valid" })}</span>
							</motion.div>
						) : (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 200, damping: 15 }}
								className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-2xl shadow-lg font-bold"
							>
								<FaTimesCircle className="text-xl" />
								<span>{t("certificates.validation.invalid", { defaultValue: "Invalid" })}</span>
							</motion.div>
						)}
					</div>

					{/* Certificate Content */}
					<div className="flex items-start gap-6 mb-8">
						<motion.div
							animate={{ rotate: isValid ? [0, -10, 10, 0] : 0 }}
							transition={{ duration: 0.5 }}
							className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
								isValid
									? "bg-gradient-to-br from-brand-lime to-green-500"
									: "bg-gradient-to-br from-gray-300 to-gray-400"
							}`}
						>
							<FaTrophy className="text-4xl text-white" />
						</motion.div>
						<div>
							<h2 className="text-2xl lg:text-3xl font-black text-base-content mb-2">
								{certificate.courseName}
							</h2>
							<p className="text-lg text-base-content/70 font-medium">
								{certificate.testName}
							</p>
						</div>
					</div>

					{/* Recipient */}
					<div className="mb-8 p-6 bg-base-100/60 rounded-2xl">
						<p className="text-sm font-bold text-base-content/50 uppercase tracking-wide mb-2">
							{t("certificates.view.awarded_to", { defaultValue: "Awarded To" })}
						</p>
						<p className="text-2xl font-black text-brand-lavender">
							{certificate.userName}
						</p>
					</div>

					{/* Details Grid */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<div className="p-4 bg-base-100/60 rounded-xl">
							<p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
								{t("certificates.page.certificate_id", { defaultValue: "Certificate ID" })}
							</p>
							<p className="font-mono text-sm font-bold text-brand-coral break-all">
								{certificate.certificateId}
							</p>
						</div>
						<div className="p-4 bg-base-100/60 rounded-xl">
							<p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
								{t("certificates.page.score", { defaultValue: "Score" })}
							</p>
							<p className="text-xl font-black text-base-content">
								{parseFloat(certificate.score).toFixed(1)}%
							</p>
						</div>
						<div className="p-4 bg-base-100/60 rounded-xl">
							<p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
								{t("certificates.page.issued", { defaultValue: "Issued" })}
							</p>
							<p className="font-semibold text-base-content">
								{formatDate(certificate.issuedAt)}
							</p>
						</div>
						{certificate.expiresAt && (
							<div className="p-4 bg-base-100/60 rounded-xl">
								<p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
									{t("certificates.page.expires", { defaultValue: "Expires" })}
								</p>
								<p className="font-semibold text-base-content">
									{formatDate(certificate.expiresAt)}
								</p>
							</div>
						)}
					</div>

					{/* Revoked Warning */}
					{certificate.revokedAt && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							className="mb-6 p-5 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-2xl"
						>
							<div className="flex items-start gap-3">
								<FaTimesCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-bold text-red-800 mb-2">
										{t("certificates.validation.certificate_revoked", { defaultValue: "This certificate has been revoked" })}
									</p>
									<p className="text-sm text-red-700 mb-1">
										<strong>{t("certificates.validation.revoked_on", { defaultValue: "Revoked on" })}:</strong> {formatDate(certificate.revokedAt)}
									</p>
									{certificate.revokeReason && (
										<p className="text-sm text-red-700">
											<strong>{t("certificates.page.revoke_reason", { defaultValue: "Reason" })}:</strong> {certificate.revokeReason}
										</p>
									)}
								</div>
							</div>
						</motion.div>
					)}

					{/* Expired Warning */}
					{certificate.expiresAt && new Date(certificate.expiresAt) < new Date() && !certificate.revokedAt && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							className="mb-6 p-5 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-2xl"
						>
							<div className="flex items-start gap-3">
								<FaTimesCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-bold text-yellow-800 mb-2">
										{t("certificates.validation.certificate_expired", { defaultValue: "This certificate has expired" })}
									</p>
									<p className="text-sm text-yellow-700">
										<strong>{t("certificates.validation.expired_on", { defaultValue: "Expired on" })}:</strong> {formatDate(certificate.expiresAt)}
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{/* View & Download Section */}
					{isValid && (
						<div className="space-y-3">
							{downloadError && (
								<div className="p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-2xl text-center font-medium">
									{downloadError}
								</div>
							)}

							{user ? (
								<div className="flex gap-3">
									{/* View PDF Button */}
									{getPdfUrl() && (
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setShowPdfViewer(true)}
											className="flex-1 py-4 bg-gradient-to-r from-brand-lime to-green-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all"
											style={{
												boxShadow: "4px 4px 0px #22c55e",
											}}
										>
											<FaEye className="text-xl" />
											{t("certificates.page.view", { defaultValue: "View Certificate" })}
										</motion.button>
									)}
									{/* Download Button */}
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleDownload}
										disabled={downloading}
										className={`${getPdfUrl() ? "flex-1" : "w-full"} py-4 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all`}
										style={{
											boxShadow: "4px 4px 0px #7776bc",
										}}
									>
										{downloading ? (
											<>
												<motion.div
													animate={{ rotate: 360 }}
													transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
												>
													<FaSpinner />
												</motion.div>
												{t("certificates.page.downloading", { defaultValue: "Downloading..." })}
											</>
										) : (
											<>
												<FaDownload className="text-xl" />
												{t("certificates.page.download", { defaultValue: "Download Certificate" })}
											</>
										)}
									</motion.button>
								</div>
							) : (
								<Link to="/login" className="block">
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full py-4 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all"
										style={{
											boxShadow: "4px 4px 0px #7776bc",
										}}
									>
										<FaSignInAlt className="text-xl" />
										{t("certificates.view.login_to_download", { defaultValue: "Login to Download Certificate" })}
									</motion.div>
								</Link>
							)}
						</div>
					)}
				</motion.div>
			</div>

			{/* PDF Viewer Modal */}
			<AnimatePresence>
				{showPdfViewer && getPdfUrl() && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
						onClick={() => setShowPdfViewer(false)}
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
								<h3 className="font-bold text-lg">
									{t("certificates.page.certificate_preview", { defaultValue: "Certificate Preview" })}
								</h3>
								<div className="flex items-center gap-2">
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={handleDownload}
										disabled={downloading}
										className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
										title={t("certificates.page.download", { defaultValue: "Download Certificate" })}
									>
										{downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setShowPdfViewer(false)}
										className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
									>
										<FaTimes />
									</motion.button>
								</div>
							</div>
							{/* PDF Iframe */}
							<iframe
								src={getPdfUrl()}
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

export default CertificateViewPage;
