import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import CourseCard from "./dashboard/CourseCard";
import FilterBar from "./dashboard/FilterBar";
import { motion, AnimatePresence } from "framer-motion";
import SubscriptionModal from "./dashboard/SubscriptionModal";
import API from "../services/api";
import {
	FaSpinner,
	FaBook,
	FaChalkboardTeacher,
	FaRocket,
} from "react-icons/fa";

const DashboardPage = () => {
	const { t } = useTranslation(["translation", "course"]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [subscribedFilter, setSubscribedFilter] = useState("all");
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);

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
		setSelectedCourse(course);
	};

	const handleConfirmSubscription = async (courseId) => {
		const courseToSubscribe = courses.find((c) => c.id === courseId);
		if (!courseToSubscribe) return;

		setSelectedCourse({ ...courseToSubscribe, _subscribing: true });

		try {
			await API.createSubscription(courseId);
			setCourses(
				courses.map((c) =>
					c.id === courseId ? { ...c, subscribed: true } : c,
				),
			);
			setSelectedCourse(null);
		} catch (error) {
			console.error("Subscription failed:", error);
			setSelectedCourse((prev) => ({
				...prev,
				_subscribing: false,
				_error: error.response?.data?.error || "Subscription failed",
			}));
		}
	};

	const handleCancelSubscription = () => {
		setSelectedCourse(null);
	};

	const filteredCourses = useMemo(() => {
		return courses
			.filter((course) =>
				course.title?.toLowerCase().includes(searchQuery.toLowerCase()),
			)
			.filter((course) => {
				if (selectedCategory === "") return true;

				// Check if course has multiple categories (new approach)
				if (course.categories && Array.isArray(course.categories)) {
					return course.categories.some(
						(cat) => cat.id.toString() === selectedCategory.toString(),
					);
				}

				// Fallback to old single categoryId for backward compatibility
				return course.categoryId?.toString() === selectedCategory.toString();
			})
			.filter((course) => {
				return (
					subscribedFilter === "all" ||
					(subscribedFilter === "subscribed" && course.subscribed) ||
					(subscribedFilter === "not_subscribed" && !course.subscribed)
				);
			});
	}, [searchQuery, selectedCategory, subscribedFilter, courses]);

	// Split courses into subscribed and unsubscribed
	const subscribedCourses = useMemo(() => {
		return filteredCourses.filter((course) => course.subscribed);
	}, [filteredCourses]);

	const unsubscribedCourses = useMemo(() => {
		return filteredCourses.filter((course) => !course.subscribed);
	}, [filteredCourses]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center"
				>
					<FaSpinner className="animate-spin text-brand-lavender mx-auto h-12 w-12 mb-4" />
					<span className="text-base-content text-lg">{t("loading")}...</span>
				</motion.div>
			</div>
		);
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="p-6 text-red-600 bg-red-100 rounded-xl border-2 border-red-300"
			>
				<strong>Error:</strong> {error}
			</motion.div>
		);
	}

	return (
		<div className="relative -mx-4 sm:-mx-6 -my-8 min-h-[calc(100vh-6rem)]">
			{/* Grid Background - extends beyond container */}
			<div
				className="fixed inset-0 opacity-[0.08] pointer-events-none"
				style={{
					backgroundImage: `
						linear-gradient(to right, #7776bc 1px, transparent 1px),
						linear-gradient(to bottom, #7776bc 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
					top: "5rem", // Account for navbar
				}}
			/>

			{/* Animated gradient blobs */}
			<div
				className="fixed inset-0 overflow-hidden pointer-events-none"
				style={{ top: "5rem" }}
			>
				<motion.div
					className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-lavender/10 blur-3xl"
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
					className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl"
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
			<div className="relative z-10 px-4 sm:px-6 py-8">
				{/* Hero Welcome Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-12"
				>
					<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-lavender/10 via-brand-coral/10 to-brand-yellow/10 border-2 border-brand-lavender/20 backdrop-blur-sm">
						{/* Decorative elements */}
						<motion.div
							className="absolute top-0 right-0 w-64 h-64 bg-brand-coral/20 rounded-full blur-3xl"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.5, 0.3],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
							}}
						/>

						<div className="relative z-1 p-8 md:p-12">
							<div className="max-w-3xl">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-brand-lavender/20 mb-6"
								>
									<FaRocket className="text-brand-coral" />
									<span className="font-semibold text-brand-lavender">
										{t("dashboard.welcome_back", {
											defaultValue: "Тавтай морилно уу",
										})}
									</span>
								</motion.div>

								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent"
								>
									{t("dashboard.welcome")}
								</motion.h1>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="text-lg md:text-xl text-base-content/80 mb-6 leading-relaxed"
								>
									{t("dashboard.subtitle")}
								</motion.p>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="flex flex-wrap gap-4"
								>
									<Link to="/book">
										<motion.div
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button className="bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
												<FaChalkboardTeacher className="mr-2" />
												{t("dashboard.book_teacher")}
											</Button>
										</motion.div>
									</Link>

									<Link to="/my-bookings">
										<motion.div
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												variant="outline"
												className="font-bold px-6 py-3 rounded-full border-2 border-brand-lavender hover:bg-brand-lavender/10"
											>
												<FaBook className="mr-2" />
												{t("nav.my_bookings", {
													defaultValue: "Миний захиалгууд",
												})}
											</Button>
										</motion.div>
									</Link>
								</motion.div>

								{/* Quick stats */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
									className="mt-8 flex flex-wrap gap-6"
								>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-full bg-brand-lavender/20 flex items-center justify-center">
											<FaBook className="text-brand-lavender text-xl" />
										</div>
										<div>
											<div className="text-2xl font-bold text-base-content">
												{courses.filter((c) => c.subscribed).length}
											</div>
											<div className="text-sm text-base-content/60">
												{t("dashboard.enrolled_courses", {
													defaultValue: "Элссэн хичээл",
												})}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-full bg-brand-coral/20 flex items-center justify-center">
											<FaBook className="text-brand-coral text-xl" />
										</div>
										<div>
											<div className="text-2xl font-bold text-base-content">
												{courses.length}
											</div>
											<div className="text-sm text-base-content/60">
												{t("dashboard.total_courses", {
													defaultValue: "Нийт хичээл",
												})}
											</div>
										</div>
									</div>
								</motion.div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Filter Bar */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
				>
					<FilterBar
						onSearch={setSearchQuery}
						onCategoryChange={setSelectedCategory}
						onSubscribedChange={setSubscribedFilter}
					/>
				</motion.div>

				{/* Course Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
					className="mt-8 space-y-12"
				>
					{/* Subscribed Courses Section */}
					{subscribedCourses.length > 0 && (
						<div>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="flex items-center gap-4 mb-6"
							>
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
									<FaBook className="text-white text-xl" />
								</div>
								<div>
									<h2 className="text-2xl font-black text-base-content">
										{t("dashboard.my_courses", {
											defaultValue: "Миний хичээлүүд",
										})}
									</h2>
									<p className="text-sm text-base-content/60">
										{subscribedCourses.length}{" "}
										{t("dashboard.enrolled_courses", {
											defaultValue: "элссэн хичээл",
										})}
									</p>
								</div>
							</motion.div>

							<motion.div
								layout
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
							>
								<AnimatePresence mode="popLayout">
									{subscribedCourses.map((course, index) => (
										<motion.div
											key={course.id}
											initial={{ opacity: 0, scale: 0.9, y: 20 }}
											animate={{ opacity: 1, scale: 1, y: 0 }}
											exit={{ opacity: 0, scale: 0.9, y: -20 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
										>
											<CourseCard
												course={course}
												onSubscribe={handleSubscribe}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						</div>
					)}

					{/* Separator */}
					{subscribedCourses.length > 0 && unsubscribedCourses.length > 0 && (
						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{ opacity: 1, scaleX: 1 }}
							transition={{ duration: 0.5 }}
							className="relative"
						>
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t-2 border-brand-lavender/20"></div>
							</div>
							<div className="relative flex justify-center">
								<span className="px-6 py-2 bg-gradient-to-r from-brand-lavender/10 to-brand-coral/10 rounded-full border-2 border-brand-lavender/20 text-sm font-bold text-base-content/60 backdrop-blur-sm">
									{t("dashboard.explore_more", {
										defaultValue: "Explore more",
									})}
								</span>
							</div>
						</motion.div>
					)}

					{/* Unsubscribed Courses Section */}
					{unsubscribedCourses.length > 0 && (
						<div>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="flex items-center gap-4 mb-6"
							>
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center flex-shrink-0">
									<FaBook className="text-white text-xl" />
								</div>
								<div>
									<h2 className="text-2xl font-black text-base-content">
										{t("dashboard.available_courses", {
											defaultValue: "Боломжтой хичээлүүд",
										})}
									</h2>
									<p className="text-sm text-base-content/60">
										{unsubscribedCourses.length}{" "}
										{t("dashboard.courses_available", {
											defaultValue: "хичээл",
										})}
									</p>
								</div>
							</motion.div>

							<motion.div
								layout
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
							>
								<AnimatePresence mode="popLayout">
									{unsubscribedCourses.map((course, index) => (
										<motion.div
											key={course.id}
											initial={{ opacity: 0, scale: 0.9, y: 20 }}
											animate={{ opacity: 1, scale: 1, y: 0 }}
											exit={{ opacity: 0, scale: 0.9, y: -20 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
										>
											<CourseCard
												course={course}
												onSubscribe={handleSubscribe}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						</div>
					)}

					{/* No Courses Message */}
					{filteredCourses.length === 0 && !loading && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="text-center py-20"
						>
							<motion.div
								animate={{ y: [0, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-lavender/20 to-brand-coral/20 flex items-center justify-center"
							>
								<FaBook className="text-4xl text-brand-lavender" />
							</motion.div>
							<p className="text-2xl font-bold text-base-content mb-2">
								{t("dashboard.no_courses_found")}
							</p>
							<p className="text-base-content/60">
								{t("dashboard.no_courses_found_subtitle")}
							</p>
						</motion.div>
					)}
				</motion.div>
			</div>

			{/* Subscription Modal */}
			<SubscriptionModal
				course={selectedCourse}
				onConfirm={handleConfirmSubscription}
				onCancel={handleCancelSubscription}
			/>
		</div>
	);
};

export default DashboardPage;
