import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import API, { API_URL } from "../services/api";
import { FaTrophy, FaDownload, FaCheckCircle, FaSpinner, FaEye, FaTimes } from "react-icons/fa";

function CertificatesPage() {
	const { t } = useTranslation();
	const [certificates, setCertificates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [downloadingId, setDownloadingId] = useState(null);
	const [viewingCert, setViewingCert] = useState(null);

	useEffect(() => {
		fetchCertificates();
	}, []);

	const fetchCertificates = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await API.getMyCertificates();
			setCertificates(response.data.data || []);
		} catch (err) {
			console.error("Failed to fetch certificates:", err);
			setError(t("certificates.page.failed_to_load"));
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
			setError(t("certificates.page.download_failed"));
		} finally {
			setDownloadingId(null);
		}
	};

	const getPdfUrl = (cert) => {
		if (cert?.pdfUrl) {
			return `${API_URL}/${cert.pdfUrl}`;
		}
		return null;
	};

	if (loading) {
		return (
			<div className="max-w-6xl mx-auto p-8">
				<div className="text-center">{t("certificates.page.loading")}</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{t("certificates.page.my_certificates")}</h1>
				<p className="text-gray-600">
					{t("certificates.page.description")}{" "}
					<Link to="/certificates/validate" className="text-indigo-600 hover:underline">
						{t("certificates.page.here")}
					</Link>
					.
				</p>
			</div>

			{error && (
				<div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{certificates.length === 0 ? (
				<div className="bg-white shadow-md rounded-lg p-12 text-center">
					<FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
					<h2 className="text-2xl font-semibold text-gray-700 mb-2">
						{t("certificates.page.no_certificates")}
					</h2>
					<p className="text-gray-500 mb-6">
						{t("certificates.page.no_certificates_description")}
					</p>
					<Link
						to="/courses"
						className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
					>
						{t("certificates.page.browse_courses")}
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{certificates.map((cert) => (
						<div
							key={cert.id}
							className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="flex items-start justify-between mb-4">
								<FaTrophy className="text-4xl text-yellow-600" />
								{!cert.revokedAt && (
									<FaCheckCircle className="text-green-600 text-2xl" title={t("certificates.page.valid")} />
								)}
							</div>

							<h3 className="text-xl font-bold text-gray-900 mb-2">
								{cert.courseName}
							</h3>
							<p className="text-sm text-gray-600 mb-1">{cert.testName}</p>
							<p className="text-sm text-gray-600 mb-4">
								{t("certificates.page.score")}: {parseFloat(cert.score).toFixed(1)}%
							</p>

							<div className="border-t border-yellow-300 pt-4 mb-4">
								<div className="text-xs text-gray-600 mb-1">
									<strong>{t("certificates.page.certificate_id")}:</strong>
									<br />
									<span className="font-mono text-xs">{cert.certificateId}</span>
								</div>
								<div className="text-xs text-gray-600">
									<strong>{t("certificates.page.issued")}:</strong> {formatDate(cert.issuedAt)}
								</div>
								{cert.expiresAt && (
									<div className="text-xs text-gray-600 mt-1">
										<strong>{t("certificates.page.expires")}:</strong> {formatDate(cert.expiresAt)}
									</div>
								)}
							</div>

							{cert.revokedAt ? (
								<div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
									<strong>{t("certificates.page.revoked")}</strong>
									{cert.revokeReason && (
										<p className="mt-1">{cert.revokeReason}</p>
									)}
								</div>
							) : (
								<div className="space-y-2">
									{/* View & Download buttons */}
									<div className="flex gap-2">
										{getPdfUrl(cert) && (
											<button
												onClick={() => setViewingCert(cert)}
												className="flex items-center justify-center flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
											>
												<FaEye className="mr-1" />
												{t("certificates.page.view", { defaultValue: "View" })}
											</button>
										)}
										<button
											onClick={() => handleDownloadPDF(cert.certificateId)}
											disabled={downloadingId === cert.certificateId}
											className={`flex items-center justify-center ${getPdfUrl(cert) ? "flex-1" : "w-full"} px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
										>
											{downloadingId === cert.certificateId ? (
												<>
													<FaSpinner className="animate-spin mr-1" />
													{t("certificates.page.downloading")}
												</>
											) : (
												<>
													<FaDownload className="mr-1" />
													{t("certificates.page.download", { defaultValue: "Download" })}
												</>
											)}
										</button>
									</div>
									<Link
										to={`/certificates/${cert.certificateId}`}
										className="flex items-center justify-center w-full px-4 py-2 bg-white border border-yellow-600 text-yellow-700 rounded-md hover:bg-yellow-50 text-sm"
									>
										{t("certificates.page.view_details")}
									</Link>
								</div>
							)}
						</div>
					))}
				</div>
			)}

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
							<div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
								<h3 className="font-bold text-lg">
									{viewingCert.courseName} - {t("certificates.page.certificate_preview", { defaultValue: "Certificate Preview" })}
								</h3>
								<div className="flex items-center gap-2">
									<button
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
									</button>
									<button
										onClick={() => setViewingCert(null)}
										className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
									>
										<FaTimes />
									</button>
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

export default CertificatesPage;
