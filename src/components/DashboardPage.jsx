import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button"; // Assuming these UI components exist
import CourseCard from "./dashboard/CourseCard"; // Assuming this component exists
import FilterBar from "./dashboard/FilterBar"; // Assuming this component exists
import { motion, AnimatePresence } from "framer-motion";
// Removed LanguageSwitcher import as it wasn't used directly here
import SubscriptionModal from "./dashboard/SubscriptionModal"; // Assuming this component exists
// Removed i18n import, assuming it's configured globally or in MainLayout
// import "./dashboard/i18n.js";
import API from "../services/api"; // *** 1. Use the correct API service ***
import { FaSpinner } from "react-icons/fa"; // Added for loading indicator

const DashboardPage = () => {
	const { t } = useTranslation(["translation", "course"]); // Keep translation for UI text
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(""); // Assuming category is a string ID or name
	const [subscribedFilter, setSubscribedFilter] = useState("all");
	const [courses, setCourses] = useState([]); // Raw course data from API
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null); // Course object for modal

	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true);
			setError(null);
			try {
				// Fetch all courses
				const coursesResponse = await API.getAllCourses();
				const coursesData = coursesResponse.data.data || [];

				// Fetch user's subscriptions
				const subsResponse = await API.getMySubscriptions();
				const userSubscriptions = subsResponse.data.data || [];

				// Create a Set of subscribed course IDs for fast lookup
				const subscribedCourseIds = new Set(
					userSubscriptions.map((sub) => sub.courseId),
				);

				// Mark courses as subscribed based on user's subscriptions
				const coursesWithSubStatus = coursesData.map((course) => ({
					...course,
					subscribed: subscribedCourseIds.has(course.id),
				}));

				setCourses(coursesWithSubStatus);
			} catch (error) {
				console.error("Failed to fetch courses:", error);
				setError(
					error.response?.data?.error ||
						error.message ||
						"Failed to load courses",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	const handleSubscribe = (course) => {
		setSelectedCourse(course); // Open modal with the selected course object
	};

	// *** 3. Implement actual API call for subscription ***
	const handleConfirmSubscription = async (courseId) => {
		// Find the specific course object again if needed, or pass it from modal
		const courseToSubscribe = courses.find((c) => c.id === courseId);
		if (!courseToSubscribe) return;

		setSelectedCourse({ ...courseToSubscribe, _subscribing: true }); // Show loading state in modal (optional)

		try {
			await API.createSubscription(courseId); // Call the backend API
			// Update local state AFTER successful API call
			setCourses(
				courses.map((c) =>
					c.id === courseId ? { ...c, subscribed: true } : c,
				),
			);
			setSelectedCourse(null); // Close modal
		} catch (error) {
			console.error("Subscription failed:", error);
			// Show error in modal or on page
			setSelectedCourse((prev) => ({
				...prev,
				_subscribing: false,
				_error: error.response?.data?.error || "Subscription failed",
			}));
			// Keep modal open to show error, don't update local course state
			// setError("Subscription failed. Please try again."); // Or show error in modal
		}
		// No finally needed here, error state handled above
	};

	const handleCancelSubscription = () => {
		setSelectedCourse(null); // Close modal
	};

	// *** 4. Filter based on actual data, not translation keys ***
	const filteredCourses = useMemo(() => {
		return courses
			.filter((course) =>
				// Filter by title (case-insensitive)
				course.title
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()),
			)
			.filter((course) => {
				console.log(selectedCategory);
				return selectedCategory != ""
					? course.categoryId + "" === selectedCategory.toString()
					: true;
			})
			.filter((course) => {
				// Filter by subscription status
				return (
					subscribedFilter === "all" ||
					(subscribedFilter === "subscribed" && course.subscribed) ||
					(subscribedFilter === "not_subscribed" && !course.subscribed) // Added 'not_subscribed' option
				);
			});
	}, [searchQuery, selectedCategory, subscribedFilter, courses]); // Removed 't' dependency

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<FaSpinner className="animate-spin text-indigo-600 mr-3 h-8 w-8" />
				<span>{t("loading")}...</span> {/* Use translation key */}
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-red-600 bg-red-100 rounded-md">
				Error: {error}
			</div>
		);
	}

	return (
		<>
			{/* Welcome Banner */}
			<div className="p-8 bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8">
				<h2 className="text-3xl font-bold text-base-content">
					{t("dashboard.welcome")}
				</h2>
				<p className="mt-2 text-base-content text-lg">
					{t("dashboard.subtitle")}
				</p>
				<Link to="/book">
					<Button className="mt-4">{t("dashboard.book_teacher")}</Button>
				</Link>
			</div>

			{/* Filter Bar */}
			<FilterBar
				onSearch={setSearchQuery}
				onCategoryChange={setSelectedCategory}
				onSubscribedChange={setSubscribedFilter}
				// Pass current filter values if FilterBar needs them
				// currentCategory={selectedCategory}
				// currentSubscribedFilter={subscribedFilter}
			/>

			{/* Course Grid */}
			<motion.div
				layout
				className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
			>
				{" "}
				{/* Added margin top */}
				<AnimatePresence>
					{filteredCourses.map((course) => (
						<CourseCard
							key={course.id}
							course={course}
							onSubscribe={handleSubscribe} // Pass handler to card
						/>
					))}
				</AnimatePresence>
			</motion.div>

			{/* No Courses Message */}
			{filteredCourses.length === 0 &&
				!loading && ( // Check loading state too
					<div className="text-center py-16">
						<p className="text-2xl font-bold text-base-content">
							{t("dashboard.no_courses_found")}
						</p>
						<p className="text-base-content mt-2">
							{t("dashboard.no_courses_found_subtitle")}
						</p>
					</div>
				)}

			{/* Subscription Modal */}
			<SubscriptionModal
				course={selectedCourse} // Pass the selected course object (or null)
				onConfirm={handleConfirmSubscription}
				onCancel={handleCancelSubscription}
				// Pass loading/error state specific to the subscription action if needed
				// isSubscribing={selectedCourse?._subscribing}
				// subscribeError={selectedCourse?._error}
			/>
		</>
	);
};

export default DashboardPage;
