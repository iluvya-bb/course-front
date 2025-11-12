import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button"; // Assuming Button component exists
import { FaTimes, FaSpinner } from "react-icons/fa"; // Added icons

const SubscriptionModal = ({
	course,
	isOpen, // Prop to control visibility
	onConfirm,
	onCancel,
	isLoading, // Prop for loading state during API call
	error, // Prop for displaying API errors
}) => {
	const { t } = useTranslation(["translation", "course"]); // Keep translations for static text

	// Don't render if not open or no course data
	if (!isOpen || !course) return null;

	return (
		// Modal Backdrop
		<div
			className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
			onClick={onCancel} // Close on backdrop click
		>
			{/* Modal Content - Increased max-width */}
			<div
				// --- THE FIX: Changed max-w-sm to max-w-md ---
				className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2 border-neutral relative"
				// ---------------------------------------------
				onClick={(e) => e.stopPropagation()} // Prevent close on content click
			>
				{/* Close Button */}
				<button
					onClick={onCancel}
					disabled={isLoading}
					className="absolute top-3 right-3 text-base-content/50 hover:text-error transition-colors"
					aria-label={t("close")} // Accessibility
				>
					<FaTimes size={18} />
				</button>

				<h2 className="text-xl font-bold text-base-content mb-4">
					{t("subscribe_confirmation.title")}
				</h2>

				{/* Confirmation Message using actual course title */}
				<p className="text-base-content/80 mb-6">
					{t("subscribe_confirmation.message", { courseName: course.title })}{" "}
					{/* Use course.title */}
				</p>

				{/* Display Error Message */}
				{error && (
					<p className="text-error text-sm mb-4 text-center">{error}</p>
				)}

				{/* Action Buttons */}
				{/* Use flex-wrap in case buttons still wrap on very small screens */}
				<div className="flex flex-wrap justify-end gap-3">
					{" "}
					{/* Added flex-wrap and gap */}
					<Button
						variant="ghost" // Assuming ghost variant exists
						onClick={onCancel}
						disabled={isLoading}
					>
						{t("subscribe_confirmation.cancel")}
					</Button>
					<Button
						onClick={() => onConfirm(course.id)} // Pass course ID back
						disabled={isLoading}
						className="flex items-center" // Ensure spinner aligns
					>
						{isLoading && (
							<FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
						)}{" "}
						{/* Loading spinner */}
						{isLoading ? t("subscribing") : t("subscribe_confirmation.confirm")}{" "}
						{/* Loading text */}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionModal;
