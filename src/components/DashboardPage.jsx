import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import CourseCard from "./dashboard/CourseCard";
import FilterBar from "./dashboard/FilterBar";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import SubscriptionModal from "./dashboard/SubscriptionModal";
import "./dashboard/i18n.js";
import { getCourses } from "../services/courseService";

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
			try {
				const data = await getCourses();
				setCourses(data);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	const handleSubscribe = (course) => {
		setSelectedCourse(course);
	};

	const handleConfirmSubscription = (courseId) => {
		setCourses(
			courses.map((c) => (c.id === courseId ? { ...c, subscribed: true } : c)),
		);
		setSelectedCourse(null);
	};

	const handleCancelSubscription = () => {
		setSelectedCourse(null);
	};

	const filteredCourses = useMemo(() => {
		return courses
			.filter((course) =>
				t(`${course.id}.title`, { ns: "course" })
					.toLowerCase()
					.includes(searchQuery.toLowerCase()),
			)
			.filter((course) =>
				selectedCategory
					? t(`${course.id}.category`, { ns: "course" }) === selectedCategory
					: true,
			)
			.filter((course) => {
				return (
					subscribedFilter === "all" ||
					(subscribedFilter === "subscribed" && course.subscribed)
				);
			});
	}, [searchQuery, selectedCategory, subscribedFilter, t, courses]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
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

			<FilterBar
				onSearch={setSearchQuery}
				onCategoryChange={setSelectedCategory}
				onSubscribedChange={setSubscribedFilter}
			/>

			<motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<AnimatePresence>
					{filteredCourses.map((course) => (
						<CourseCard
							key={course.id}
							course={course}
							onSubscribe={handleSubscribe}
						/>
					))}
				</AnimatePresence>
			</motion.div>

			{filteredCourses.length === 0 && (
				<div className="text-center py-16">
					<p className="text-2xl font-bold text-base-content">
						{t("dashboard.no_courses_found")}
					</p>
					<p className="text-base-content mt-2">
						{t("dashboard.no_courses_found_subtitle")}
					</p>
				</div>
			)}
			<SubscriptionModal
				course={selectedCourse}
				onConfirm={handleConfirmSubscription}
				onCancel={handleCancelSubscription}
			/>
		</>
	);
};

export default DashboardPage;
