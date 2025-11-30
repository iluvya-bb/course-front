import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	FaTicketAlt,
	FaSpinner,
	FaCheckCircle,
	FaTimesCircle,
	FaPercent,
	FaMoneyBillWave,
	FaInfoCircle,
	FaGift,
} from "react-icons/fa";
import API from "../services/api";
import SubscriptionModal from "./dashboard/SubscriptionModal";

const PromocodePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [promoCode, setPromoCode] = useState("");
	const [courses, setCourses] = useState([]);
	const [selectedCourseId, setSelectedCourseId] = useState("");
	const [loading, setLoading] = useState(true);
	const [validating, setValidating] = useState(false);
	const [validationResult, setValidationResult] = useState(null);
	const [error, setError] = useState("");

	// Subscription modal state
	const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
	const [courseToSubscribe, setCourseToSubscribe] = useState(null);
	const [redeeming, setRedeeming] = useState(false);
	const [redeemError, setRedeemError] = useState("");

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		setLoading(true);
		try {
			const response = await API.getCourses({ isActive: true });
			setCourses(response.data.data || []);
		} catch (err) {
			console.error("Failed to fetch courses:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleValidate = async (e) => {
		e.preventDefault();
		if (!promoCode.trim()) {
			setError(t("promocode.enter_code"));
			return;
		}

		setValidating(true);
		setError("");
		setValidationResult(null);

		try {
			const selectedCourse = courses.find(
				(c) => c.id === parseInt(selectedCourseId)
			);
			const basePrice = selectedCourse?.price || 0;

			const response = await API.validatePromoCode({
				code: promoCode.trim(),
				courseId: selectedCourseId || undefined,
				basePrice: basePrice,
			});

			const result = {
				success: true,
				...response.data.data,
				originalPrice: basePrice,
			};

			setValidationResult(result);

			// If this is a grantsAccess code with a course, show subscription modal
			if (result.grantsAccess && result.course) {
				setCourseToSubscribe(result.course);
				setShowSubscriptionModal(true);
			}
		} catch (err) {
			const errorMessage =
				err.response?.data?.error || t("promocode.invalid_code");
			setError(errorMessage);
			setValidationResult({
				success: false,
				message: errorMessage,
			});
		} finally {
			setValidating(false);
		}
	};

	const handleConfirmSubscription = async () => {
		if (!courseToSubscribe) return;

		setRedeeming(true);
		setRedeemError("");

		try {
			await API.redeemPromoCode({ code: promoCode.trim() });

			// Close modal and navigate to course page
			setShowSubscriptionModal(false);
			setCourseToSubscribe(null);
			navigate(`/course/${courseToSubscribe.id}`);
		} catch (err) {
			const errorMessage =
				err.response?.data?.error || t("promocode.redeem_failed");
			setRedeemError(errorMessage);
		} finally {
			setRedeeming(false);
		}
	};

	const handleCancelSubscription = () => {
		setShowSubscriptionModal(false);
		setCourseToSubscribe(null);
		setRedeemError("");
	};

	const formatCurrency = (amount) => {
		return `₮${parseFloat(amount || 0).toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})}`;
	};

	const getDiscountDisplay = (result) => {
		if (result.type === "percent") {
			return `${result.discount}%`;
		}
		return formatCurrency(result.discount);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<FaSpinner className="animate-spin text-4xl text-brand-lavender" />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
					<FaTicketAlt className="text-brand-lavender" />
					{t("promocode.title")}
				</h1>
				<p className="text-base-content/70 mt-2">
					{t("promocode.subtitle")}
				</p>
			</div>

			{/* Promo Code Entry Card */}
			<div className="bg-neutral rounded-2xl shadow-[8px_8px_0px_#7776bc] border-2 border-brand-lavender/30 p-8 mb-8">
				<h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
					<FaTicketAlt className="text-brand-coral" />
					{t("promocode.redeem")}
				</h2>

				<form onSubmit={handleValidate} className="space-y-6">
					{/* Promo Code Input */}
					<div>
						<label className="block text-sm font-medium text-base-content mb-2">
							{t("promocode.code_label")}
						</label>
						<input
							type="text"
							value={promoCode}
							onChange={(e) => {
								setPromoCode(e.target.value.toUpperCase());
								setValidationResult(null);
								setError("");
							}}
							className="w-full px-4 py-3 border-2 border-brand-lavender/30 rounded-xl focus:ring-2 focus:ring-brand-lavender focus:border-brand-lavender bg-base-100 uppercase"
							placeholder={t("promocode.code_placeholder")}
						/>
					</div>

					{/* Course Selection - Only show if not validating a grantsAccess code */}
					{!validationResult?.grantsAccess && (
						<div>
							<label className="block text-sm font-medium text-base-content mb-2">
								{t("promocode.select_course")}
							</label>
							<select
								value={selectedCourseId}
								onChange={(e) => {
									setSelectedCourseId(e.target.value);
									setValidationResult(null);
								}}
								className="w-full px-4 py-3 border-2 border-brand-lavender/30 rounded-xl focus:ring-2 focus:ring-brand-lavender focus:border-brand-lavender bg-base-100"
							>
								<option value="">
									{t("promocode.all_courses")}
								</option>
								{courses.map((course) => (
									<option key={course.id} value={course.id}>
										{course.title} - {formatCurrency(course.price)}
									</option>
								))}
							</select>
							<p className="text-xs text-base-content/60 mt-1">
								{t("promocode.course_hint")}
							</p>
						</div>
					)}

					{/* Validate Button */}
					<button
						type="submit"
						disabled={validating || !promoCode.trim()}
						className="w-full px-6 py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-xl hover:opacity-90 transition-all shadow-[4px_4px_0px_#7776bc] hover:shadow-[2px_2px_0px_#7776bc] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
					>
						{validating ? (
							<>
								<FaSpinner className="animate-spin" />
								{t("promocode.validating")}
							</>
						) : (
							<>
								<FaCheckCircle />
								{t("promocode.validate")}
							</>
						)}
					</button>
				</form>

				{/* Error Message */}
				{error && (
					<div className="mt-6 p-4 bg-brand-coral/10 border-2 border-brand-coral/30 rounded-xl flex items-start gap-3">
						<FaTimesCircle className="text-brand-coral mt-0.5 flex-shrink-0" />
						<div>
							<p className="text-brand-coral font-medium">
								{t("promocode.error")}
							</p>
							<p className="text-base-content/70 text-sm">{error}</p>
						</div>
					</div>
				)}

				{/* Success Result - For grantsAccess codes with course */}
				{validationResult?.success && validationResult?.grantsAccess && validationResult?.course && (
					<div className="mt-6 p-6 bg-brand-lime/20 border-2 border-brand-lime rounded-xl">
						<div className="flex items-start gap-3">
							<FaGift className="text-brand-lime text-xl mt-0.5 flex-shrink-0" />
							<div className="flex-1">
								<p className="text-base-content font-semibold text-lg">
									{t("promocode.access_code_valid")}
								</p>
								<p className="text-base-content/70 text-sm mt-1">
									{t("promocode.access_code_desc")}
								</p>
							</div>
						</div>

						{/* Course Info Card */}
						<div className="mt-4 bg-base-100 rounded-xl p-4 border border-brand-lavender/20">
							<div className="flex gap-4">
								{validationResult.course.bannerImage && (
									<img
										src={validationResult.course.bannerImage}
										alt={validationResult.course.title}
										className="w-24 h-24 object-cover rounded-lg"
									/>
								)}
								<div className="flex-1">
									<h3 className="font-semibold text-base-content">
										{validationResult.course.title}
									</h3>
									{validationResult.course.teacher && (
										<p className="text-sm text-base-content/60">
											{validationResult.course.teacher.name}
										</p>
									)}
									<p className="text-sm text-brand-lime font-semibold mt-2">
										{t("promocode.free_access")}
									</p>
								</div>
							</div>
						</div>

						{/* Activate Button */}
						<button
							onClick={() => {
								setCourseToSubscribe(validationResult.course);
								setShowSubscriptionModal(true);
							}}
							className="mt-4 w-full px-6 py-3 bg-brand-lime text-base-content rounded-xl hover:bg-brand-lime/90 transition-all font-semibold flex items-center justify-center gap-2"
						>
							<FaGift />
							{t("promocode.activate_access")}
						</button>
					</div>
				)}

				{/* Success Result - For regular discount codes */}
				{validationResult?.success && !validationResult?.grantsAccess && (
					<div className="mt-6 p-6 bg-brand-lime/20 border-2 border-brand-lime rounded-xl">
						<div className="flex items-start gap-3">
							<FaCheckCircle className="text-brand-lime text-xl mt-0.5 flex-shrink-0" />
							<div className="flex-1">
								<p className="text-base-content font-semibold text-lg">
									{t("promocode.valid")}
								</p>
								{validationResult.description && (
									<p className="text-base-content/70 text-sm mt-1">
										{validationResult.description}
									</p>
								)}
							</div>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Discount Type */}
							<div className="bg-base-100 rounded-xl p-4 shadow-sm border border-brand-lavender/20">
								<div className="flex items-center gap-2 text-base-content/60 text-sm mb-1">
									{validationResult.type === "percent" ? (
										<FaPercent />
									) : (
										<FaMoneyBillWave />
									)}
									{t("promocode.discount")}
								</div>
								<p className="text-2xl font-bold text-brand-lavender">
									{getDiscountDisplay(validationResult)}
								</p>
							</div>

							{/* Original Price */}
							{validationResult.originalPrice > 0 && (
								<div className="bg-base-100 rounded-xl p-4 shadow-sm border border-brand-lavender/20">
									<div className="text-base-content/60 text-sm mb-1">
										{t("promocode.original_price")}
									</div>
									<p className="text-2xl font-bold text-base-content/50 line-through">
										{formatCurrency(validationResult.originalPrice)}
									</p>
								</div>
							)}

							{/* Final Price */}
							{validationResult.finalPrice !== null && (
								<div className="bg-base-100 rounded-xl p-4 shadow-sm border border-brand-lime/50">
									<div className="text-base-content/60 text-sm mb-1">
										{t("promocode.final_price")}
									</div>
									<p className="text-2xl font-bold text-brand-lime">
										{formatCurrency(validationResult.finalPrice)}
									</p>
								</div>
							)}
						</div>

						{/* Applicability Info */}
						{validationResult.applicableType &&
							validationResult.applicableType !== "all" && (
								<div className="mt-4 p-3 bg-brand-yellow/20 border-2 border-brand-yellow/50 rounded-xl">
									<p className="text-base-content text-sm flex items-center gap-2">
										<FaInfoCircle className="text-brand-yellow" />
										{t("promocode.limited_applicability")}
									</p>
								</div>
							)}
					</div>
				)}
			</div>

			{/* How It Works Section */}
			<div className="bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 rounded-2xl p-8 border-2 border-brand-lavender/20">
				<h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
					<FaInfoCircle className="text-brand-lavender" />
					{t("promocode.how_it_works")}
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-base-100 rounded-xl p-6 shadow-[4px_4px_0px_#7776bc] border border-brand-lavender/20">
						<div className="w-10 h-10 bg-brand-lavender/20 rounded-full flex items-center justify-center mb-4">
							<span className="text-brand-lavender font-bold">1</span>
						</div>
						<h3 className="font-semibold text-base-content mb-2">
							{t("promocode.step1_title")}
						</h3>
						<p className="text-base-content/70 text-sm">
							{t("promocode.step1_desc")}
						</p>
					</div>

					<div className="bg-base-100 rounded-xl p-6 shadow-[4px_4px_0px_#ff764d] border border-brand-coral/20">
						<div className="w-10 h-10 bg-brand-coral/20 rounded-full flex items-center justify-center mb-4">
							<span className="text-brand-coral font-bold">2</span>
						</div>
						<h3 className="font-semibold text-base-content mb-2">
							{t("promocode.step2_title")}
						</h3>
						<p className="text-base-content/70 text-sm">
							{t("promocode.step2_desc")}
						</p>
					</div>

					<div className="bg-base-100 rounded-xl p-6 shadow-[4px_4px_0px_#ddec51] border border-brand-yellow/20">
						<div className="w-10 h-10 bg-brand-yellow/20 rounded-full flex items-center justify-center mb-4">
							<span className="text-brand-lime font-bold">3</span>
						</div>
						<h3 className="font-semibold text-base-content mb-2">
							{t("promocode.step3_title")}
						</h3>
						<p className="text-base-content/70 text-sm">
							{t("promocode.step3_desc")}
						</p>
					</div>
				</div>
			</div>

			{/* Subscription Modal */}
			<SubscriptionModal
				course={courseToSubscribe}
				isOpen={showSubscriptionModal}
				onConfirm={handleConfirmSubscription}
				onCancel={handleCancelSubscription}
				isLoading={redeeming}
				error={redeemError}
			/>
		</div>
	);
};

export default PromocodePage;
