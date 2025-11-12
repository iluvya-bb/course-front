import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import API, { API_URL } from "../services/api";
import { FaInfoCircle, FaBook, FaTag, FaSpinner } from "react-icons/fa";
import SubscriptionModal from "./dashboard/SubscriptionModal";

// Receive course and the onSubscriptionSuccess handler as props
export const NonSubscribedCourseView = ({
	course,
	error,
	onSubscriptionSuccess,
}) => {
	const { t } = useTranslation(["translation", "course", "course_page"]);

	// --- ALL THIS STATE IS MOVED FROM PARENT ---
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
	const [subscriptionLoading, setSubscriptionLoading] = useState(false);
	const [subscriptionError, setSubscriptionError] = useState(null);
	const [promoCodeInput, setPromoCodeInput] = useState("");
	const [promoCodeValidation, setPromoCodeValidation] = useState({
		status: "idle",
		message: "",
		discountedPrice: null,
		codeApplied: null,
	});
	// --- END MOVED STATE ---

	const handleValidatePromoCode = async () => {
		// ... (Same logic as before)
	};

	const handlePromoCodeInputChange = (e) => {
		// ... (Same logic as before)
	};

	const handleSubscribeClick = () => setIsSubscriptionModalOpen(true);

	const handleCancelSubscription = () => {
		setIsSubscriptionModalOpen(false);
		setSubscriptionError(null);
	};

	const handleConfirmSubscription = async (courseIdToSubscribe) => {
		if (!courseIdToSubscribe) return;
		setSubscriptionLoading(true);
		setSubscriptionError(null);

		const subscriptionData = {
			promoCode:
				promoCodeValidation.status === "valid"
					? promoCodeValidation.codeApplied
					: null,
		};

		try {
			await API.createSubscription(courseIdToSubscribe, subscriptionData);
			setIsSubscriptionModalOpen(false);
			onSubscriptionSuccess(); // <-- Tell the parent to re-fetch data
		} catch (error) {
			console.error("Subscription failed:", error);
			setSubscriptionError(
				error.response?.data?.error || "Subscription failed",
			);
		} finally {
			setSubscriptionLoading(false);
		}
	};

	// Calculate prices (same logic as before)
	const displayPrice =
		promoCodeValidation.status === "valid" &&
		promoCodeValidation.discountedPrice !== null
			? promoCodeValidation.discountedPrice
			: course.price;

	const isEffectivelyFree = displayPrice <= 0;

	return (
		// --- PASTE YOUR ENTIRE "NON-SUBSCRIBED VIEW" JSX HERE ---
		<div className="p-4 md:p-8 max-w-4xl mx-auto">
			{error && (
				<div className="p-4 mb-4 text-red-600 bg-red-100 rounded-md">
					Error: {error}
				</div>
			)}
			<div className="p-6 mb-6 bg-white rounded-lg shadow-md border border-neutral">
				{/* ... all your banner, title, description JSX ... */}
				{/* ... all your promo code input JSX ... */}
				{/* ... all your price & subscribe button JSX ... */}

				{/* Example of promo code input */}
				{course.price != null && course.price > 0 && (
					<div className="mb-6 p-4 bg-gray-50 rounded-md border">
						{/* ... label ... */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
							<Input
								type="text"
								id="promoCode"
								value={promoCodeInput} // Uses local state
								onChange={handlePromoCodeInputChange} // Uses local handler
								// ... etc
							/>
							<Button onClick={handleValidatePromoCode} /* ... etc */>
								{/* ... */}
							</Button>
						</div>
						{/* ... validation message ... */}
					</div>
				)}
				{/* ... rest of the JSX ... */}
			</div>

			<SubscriptionModal
				course={course}
				isOpen={isSubscriptionModalOpen}
				finalPrice={displayPrice}
				promoCodeApplied={promoCodeValidation.codeApplied}
				onConfirm={() => handleConfirmSubscription(course.id)}
				onCancel={handleCancelSubscription}
				isLoading={subscriptionLoading}
				error={subscriptionError}
			/>
		</div>
	);
};
