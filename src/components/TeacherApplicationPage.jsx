import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUpload } from "react-icons/fa";

function TeacherApplicationPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { t } = useTranslation();

	const [application, setApplication] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [formData, setFormData] = useState({
		bankAccountNumber: "",
		phoneNumber: "",
		idNum: "",
		teachingField: "",
	});

	const [files, setFiles] = useState({
		idFront: null,
		idBack: null,
		proof: null,
	});

	useEffect(() => {
		// Check if user is already a teacher
		if (user && user.role === "teacher") {
			navigate("/teacher/dashboard");
			return;
		}
		fetchApplication();
	}, [user]);

	const fetchApplication = async () => {
		setLoading(true);
		try {
			const response = await API.getMyTeacherApplication();
			setApplication(response.data.data);
		} catch (err) {
			// No application found is okay
			console.log("No existing application");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e, fileType) => {
		const file = e.target.files[0];
		if (file) {
			setFiles((prev) => ({
				...prev,
				[fileType]: file,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError("");
		setSuccess("");

		try {
			// Validate files
			if (!files.idFront || !files.idBack || !files.proof) {
				throw new Error(t("teacher_application.upload_all_files"));
			}

			// Validate ID front image
			if (!files.idFront.type.startsWith("image/")) {
				throw new Error(t("teacher_application.id_front_image_error"));
			}

			// Validate ID back image
			if (!files.idBack.type.startsWith("image/")) {
				throw new Error(t("teacher_application.id_back_image_error"));
			}

			// Validate proof document (PDF)
			if (files.proof.type !== "application/pdf") {
				throw new Error(t("teacher_application.proof_pdf_error"));
			}

			// Upload files to server
			const uploadFormData = new FormData();
			uploadFormData.append("idFront", files.idFront);
			uploadFormData.append("idBack", files.idBack);
			uploadFormData.append("proof", files.proof);

			const uploadResponse = await API.uploadTeacherApplicationDocuments(uploadFormData);
			const uploadedFiles = uploadResponse.data.data;

			// Submit application with uploaded file URLs
			const data = {
				...formData,
				idNumFrontImage: uploadedFiles.idNumFrontImage,
				idNumBackImage: uploadedFiles.idNumBackImage,
				proofDocument: uploadedFiles.proofDocument,
			};

			await API.submitTeacherApplication(data);

			setSuccess(t("teacher_application.success"));
			fetchApplication();
		} catch (err) {
			console.error("Failed to submit application:", err);
			setError(err.message || err.response?.data?.error || t("teacher_application.failed_to_submit"));
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto">
				<div className="text-center p-8 bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A]">
					{t("teacher_application.loading")}
				</div>
			</div>
		);
	}

	// Show existing application status if exists
	if (application) {
		return (
			<div className="max-w-4xl mx-auto">
				<div className="p-6 md:p-8 bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8">
					<h1 className="text-3xl font-black text-base-content">{t("teacher_application.status_title")}</h1>
				</div>

				<div className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] p-8">
					<div className="text-center mb-8">
						{application.status === "pending" && (
							<div>
								<FaClock className="text-6xl text-brand-coral mx-auto mb-4" />
								<h2 className="text-2xl font-bold text-brand-coral mb-2">{t("teacher_application.pending_title")}</h2>
								<p className="text-base-content/80">
									{t("teacher_application.pending_description")}
								</p>
							</div>
						)}
						{application.status === "approved" && (
							<div>
								<FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
								<h2 className="text-2xl font-bold text-green-600 mb-2">{t("teacher_application.approved_title")}</h2>
								<p className="text-base-content/80 mb-4">
									{t("teacher_application.approved_description")}
								</p>
								<button
									onClick={() => navigate("/teacher/dashboard")}
									className="px-6 py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-md hover:opacity-90 font-bold"
								>
									{t("teacher_application.go_to_dashboard")}
								</button>
							</div>
						)}
						{application.status === "rejected" && (
							<div>
								<FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
								<h2 className="text-2xl font-bold text-red-600 mb-2">{t("teacher_application.rejected_title")}</h2>
								<p className="text-base-content/80 mb-4">
									{t("teacher_application.rejected_description")}
								</p>
								{application.rejectionReason && (
									<div className="bg-red-50 border-2 border-red-200 rounded-md p-4 mb-4 text-left">
										<p className="text-sm font-medium text-red-800 mb-1">{t("teacher_application.reason")}:</p>
										<p className="text-sm text-red-700">{application.rejectionReason}</p>
									</div>
								)}
								<p className="text-sm text-base-content/70 mb-4">
									{t("teacher_application.resubmit_message")}
								</p>
							</div>
						)}
					</div>

					<div className="border-t border-base-content/20 pt-6">
						<h3 className="text-lg font-semibold text-base-content mb-4">{t("teacher_application.application_details")}</h3>
						<div className="grid grid-cols-2 gap-4 text-sm text-base-content/80">
							<div>
								<span className="font-medium text-brand-lavender">{t("teacher_application.teaching_field")}:</span> {application.teachingField}
							</div>
							<div>
								<span className="font-medium text-brand-lavender">{t("teacher_application.phone")}:</span> {application.phoneNumber}
							</div>
							<div>
								<span className="font-medium text-brand-lavender">{t("teacher_application.id_number")}:</span> {application.idNum}
							</div>
							<div>
								<span className="font-medium text-brand-lavender">{t("teacher_application.submitted")}:</span>{" "}
								{new Date(application.createdAt).toLocaleDateString()}
							</div>
						</div>
					</div>

					{application.status === "rejected" && (
						<div className="mt-6 text-center">
							<button
								onClick={() => {
									setApplication(null);
									setFormData({
										bankAccountNumber: "",
										phoneNumber: "",
										idNum: "",
										teachingField: "",
									});
									setFiles({
										idFront: null,
										idBack: null,
										proof: null,
									});
								}}
								className="px-6 py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-md hover:opacity-90 font-bold"
							>
								{t("teacher_application.submit_new")}
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Show application form
	return (
		<div className="max-w-4xl mx-auto">
			<div className="p-6 md:p-8 bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8">
				<h1 className="text-3xl font-black text-base-content mb-2">{t("teacher_application.title")}</h1>
				<p className="text-base-content/80 text-lg">
					{t("teacher_application.description")}
				</p>
			</div>

			{error && (
				<div className="mb-6 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-md">
					{error}
				</div>
			)}

			{success && (
				<div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-md">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] p-6 space-y-6">
				{/* Teaching Field */}
				<div>
					<label className="block text-sm font-medium text-base-content mb-2">
						{t("teacher_application.teaching_field_label")}
					</label>
					<input
						type="text"
						name="teachingField"
						value={formData.teachingField}
						onChange={handleChange}
						required
						placeholder={t("teacher_application.teaching_field_placeholder")}
						className="w-full px-3 py-2 border-2 border-base-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-lavender bg-neutral text-base-content"
					/>
					<p className="text-xs text-base-content/60 mt-1">
						{t("teacher_application.teaching_field_help")}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					{/* Phone Number */}
					<div>
						<label className="block text-sm font-medium text-base-content mb-2">
							{t("teacher_application.phone_label")}
						</label>
						<input
							type="tel"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							required
							placeholder={t("teacher_application.phone_placeholder")}
							className="w-full px-3 py-2 border-2 border-base-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-lavender bg-neutral text-base-content"
						/>
					</div>

					{/* ID Number */}
					<div>
						<label className="block text-sm font-medium text-base-content mb-2">
							{t("teacher_application.id_number_label")}
						</label>
						<input
							type="text"
							name="idNum"
							value={formData.idNum}
							onChange={handleChange}
							required
							placeholder={t("teacher_application.id_number_placeholder")}
							className="w-full px-3 py-2 border-2 border-base-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-lavender bg-neutral text-base-content"
						/>
					</div>
				</div>

				{/* Bank Account Number */}
				<div>
					<label className="block text-sm font-medium text-base-content mb-2">
						{t("teacher_application.bank_account_label")}
					</label>
					<input
						type="text"
						name="bankAccountNumber"
						value={formData.bankAccountNumber}
						onChange={handleChange}
						required
						placeholder={t("teacher_application.bank_account_placeholder")}
						className="w-full px-3 py-2 border-2 border-base-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-lavender bg-neutral text-base-content"
					/>
					<p className="text-xs text-base-content/60 mt-1">
						{t("teacher_application.bank_account_help")}
					</p>
				</div>

				{/* ID Front Image */}
				<div>
					<label className="block text-sm font-medium text-base-content mb-2">
						{t("teacher_application.id_front_label")}
					</label>
					<div className="flex items-center space-x-4">
						<label className="flex items-center px-4 py-2 bg-brand-lavender/10 border-2 border-brand-lavender/20 text-brand-lavender rounded-md cursor-pointer hover:bg-brand-lavender/20 font-medium">
							<FaUpload className="mr-2" />
							<span className="text-sm">{t("teacher_application.choose_file")}</span>
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleFileChange(e, "idFront")}
								required
								className="hidden"
							/>
						</label>
						{files.idFront && (
							<span className="text-sm text-base-content/80">{files.idFront.name}</span>
						)}
					</div>
				</div>

				{/* ID Back Image */}
				<div>
					<label className="block text-sm font-medium text-base-content mb-2">
						{t("teacher_application.id_back_label")}
					</label>
					<div className="flex items-center space-x-4">
						<label className="flex items-center px-4 py-2 bg-brand-lavender/10 border-2 border-brand-lavender/20 text-brand-lavender rounded-md cursor-pointer hover:bg-brand-lavender/20 font-medium">
							<FaUpload className="mr-2" />
							<span className="text-sm">{t("teacher_application.choose_file")}</span>
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleFileChange(e, "idBack")}
								required
								className="hidden"
							/>
						</label>
						{files.idBack && (
							<span className="text-sm text-base-content/80">{files.idBack.name}</span>
						)}
					</div>
				</div>

				{/* Proof Document */}
				<div>
					<label className="block text-sm font-medium text-base-content mb-2">
						{t("teacher_application.proof_document_label")}
					</label>
					<div className="flex items-center space-x-4">
						<label className="flex items-center px-4 py-2 bg-brand-lavender/10 border-2 border-brand-lavender/20 text-brand-lavender rounded-md cursor-pointer hover:bg-brand-lavender/20 font-medium">
							<FaUpload className="mr-2" />
							<span className="text-sm">{t("teacher_application.choose_pdf")}</span>
							<input
								type="file"
								accept="application/pdf"
								onChange={(e) => handleFileChange(e, "proof")}
								required
								className="hidden"
							/>
						</label>
						{files.proof && (
							<span className="text-sm text-base-content/80">{files.proof.name}</span>
						)}
					</div>
					<p className="text-xs text-base-content/60 mt-1">
						{t("teacher_application.proof_document_help")}
					</p>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end space-x-3 pt-4">
					<button
						type="button"
						onClick={() => navigate("/dashboard")}
						className="px-4 py-2 text-sm font-medium text-base-content bg-base-200 border-2 border-base-content/20 rounded-md hover:bg-base-300"
					>
						{t("teacher_application.cancel")}
					</button>
					<button
						type="submit"
						disabled={submitting}
						className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-lavender to-brand-coral rounded-md hover:opacity-90 disabled:opacity-50 font-bold"
					>
						{submitting ? t("teacher_application.submitting") : t("teacher_application.submit_application")}
					</button>
				</div>
			</form>
		</div>
	);
}

export default TeacherApplicationPage;
