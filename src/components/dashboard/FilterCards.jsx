import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import API, { API_URL } from "../../services/api";
import {
	FaBook,
	FaUser,
	FaLayerGroup,
	FaTimes,
	FaFilter,
	FaChevronLeft,
	FaChevronRight,
	FaChevronDown,
	FaChevronUp,
} from "react-icons/fa";

const FilterCards = ({
	onSubjectChange,
	onTeacherChange,
	selectedSubject,
	selectedTeacher,
}) => {
	const { t, i18n } = useTranslation();
	const [subjects, setSubjects] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

	// Carousel state for subjects
	const [subjectScrollPosition, setSubjectScrollPosition] = useState(0);
	const subjectCarouselRef = useRef(null);

	// Carousel state for teachers
	const [teacherScrollPosition, setTeacherScrollPosition] = useState(0);
	const teacherCarouselRef = useRef(null);

	useEffect(() => {
		const fetchFilters = async () => {
			setLoading(true);
			try {
				const [subjectsRes, teachersRes] = await Promise.all([
					API.getSubjectsWithCourses(),
					API.getTeachers(),
				]);
				setSubjects(subjectsRes.data.data || []);
				setTeachers(teachersRes.data.data || []); // No limit - show all in carousel
			} catch (error) {
				console.error("Failed to fetch filter data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchFilters();
	}, []);

	const getName = (obj) => {
		if (typeof obj === "object" && obj !== null) {
			return obj[i18n.language] || obj.en || obj.mn || "";
		}
		return obj || "";
	};

	const clearFilters = () => {
		onSubjectChange("");
		onTeacherChange("");
	};

	const hasActiveFilters = selectedSubject || selectedTeacher;

	// Carousel scroll functions
	const scrollCarousel = (ref, direction, setPosition) => {
		if (ref.current) {
			const scrollAmount = 300;
			const newPosition =
				direction === "left"
					? Math.max(0, ref.current.scrollLeft - scrollAmount)
					: ref.current.scrollLeft + scrollAmount;

			ref.current.scrollTo({
				left: newPosition,
				behavior: "smooth",
			});
			setPosition(newPosition);
		}
	};

	const handleScroll = (ref, setPosition) => {
		if (ref.current) {
			setPosition(ref.current.scrollLeft);
		}
	};

	const canScrollLeft = (position) => position > 0;
	const canScrollRight = (ref, position) => {
		if (!ref.current) return false;
		return position < ref.current.scrollWidth - ref.current.clientWidth - 10;
	};

	if (loading) {
		return (
			<div className="mb-8">
				<div className="h-12 bg-base-200 rounded-2xl animate-pulse" />
			</div>
		);
	}

	return (
		<div className="mb-8 space-y-4">
			{/* Advanced Filters Toggle Button */}
			<motion.button
				onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 ${
					showAdvancedFilters || hasActiveFilters
						? "bg-gradient-to-r from-brand-lavender/20 to-brand-coral/20 border-brand-lavender/50"
						: "bg-base-100 border-brand-lavender/20 hover:border-brand-lavender/40"
				}`}
			>
				<FaFilter
					className={`text-lg ${
						showAdvancedFilters || hasActiveFilters
							? "text-brand-lavender"
							: "text-base-content/60"
					}`}
				/>
				<span className="font-bold text-base-content">
					{showAdvancedFilters
						? t("dashboard.hide_filters")
						: t("dashboard.advanced_filters")}
				</span>
				{hasActiveFilters && (
					<span className="px-2 py-0.5 bg-brand-coral text-white text-xs rounded-full font-bold">
						{(selectedSubject ? 1 : 0) + (selectedTeacher ? 1 : 0)}
					</span>
				)}
				{showAdvancedFilters ? (
					<FaChevronUp className="text-base-content/60" />
				) : (
					<FaChevronDown className="text-base-content/60" />
				)}
			</motion.button>

			{/* Active Filter Indicator - Always visible when filters are active */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="flex items-center gap-4 p-4 bg-brand-lavender/10 rounded-2xl border-2 border-brand-lavender/30"
					>
						<span className="text-sm font-semibold text-brand-lavender">
							{t("dashboard.active_filters")}
						</span>
						{selectedSubject && (
							<span className="px-3 py-1 bg-brand-coral/20 text-brand-coral rounded-full text-sm font-bold flex items-center gap-2">
								<FaLayerGroup className="text-xs" />
								{getName(
									subjects.find((s) => s.id.toString() === selectedSubject)
										?.name
								)}
							</span>
						)}
						{selectedTeacher && (
							<span className="px-3 py-1 bg-brand-yellow/20 text-brand-yellow rounded-full text-sm font-bold flex items-center gap-2">
								<FaUser className="text-xs" />
								{
									teachers.find((t) => t.id.toString() === selectedTeacher)
										?.name
								}
							</span>
						)}
						<button
							onClick={clearFilters}
							className="ml-auto px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold hover:bg-red-200 transition-colors flex items-center gap-1"
						>
							<FaTimes className="text-xs" />
							{t("dashboard.clear_filters")}
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Advanced Filters Content */}
			<AnimatePresence>
				{showAdvancedFilters && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="space-y-8 overflow-hidden"
					>
						{/* Subjects Section with Carousel */}
						{subjects.length > 0 && (
							<div>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-coral to-brand-yellow flex items-center justify-center">
										<FaLayerGroup className="text-white" />
									</div>
									<h3 className="text-xl font-bold text-base-content">
										{t("dashboard.browse_by_subject")}
									</h3>
								</div>

								{/* Carousel Container */}
								<div className="relative group">
									{/* Left Arrow */}
									{canScrollLeft(subjectScrollPosition) && (
										<motion.button
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											onClick={() =>
												scrollCarousel(
													subjectCarouselRef,
													"left",
													setSubjectScrollPosition
												)
											}
											className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-brand-lavender/20"
										>
											<FaChevronLeft className="text-brand-lavender" />
										</motion.button>
									)}

									{/* Carousel */}
									<div
										ref={subjectCarouselRef}
										onScroll={() =>
											handleScroll(subjectCarouselRef, setSubjectScrollPosition)
										}
										className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
										style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
									>
										{subjects.map((subject, index) => {
											const isSelected =
												selectedSubject === subject.id.toString();
											return (
												<motion.button
													key={subject.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.03 }}
													whileHover={{ scale: 1.03, y: -5 }}
													whileTap={{ scale: 0.97 }}
													onClick={() =>
														onSubjectChange(
															isSelected ? "" : subject.id.toString()
														)
													}
													className={`relative flex-shrink-0 w-48 overflow-hidden rounded-2xl border-2 transition-all duration-300 group ${
														isSelected
															? "border-brand-coral shadow-lg shadow-brand-coral/30 bg-gradient-to-br from-brand-coral/20 to-brand-yellow/20"
															: "border-brand-lavender/20 hover:border-brand-coral/50 bg-gradient-to-br from-base-100 to-brand-cream/20"
													}`}
												>
													{/* Banner Image or Gradient */}
													<div className="h-20 relative overflow-hidden">
														{subject.bannerImage ? (
															<img
																src={`${API_URL}/${subject.bannerImage}`}
																alt={getName(subject.name)}
																className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
															/>
														) : (
															<div className="w-full h-full bg-gradient-to-br from-brand-coral/30 to-brand-yellow/30" />
														)}
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

														{/* Course count badge */}
														<div className="absolute bottom-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-brand-coral flex items-center gap-1">
															<FaBook className="text-[10px]" />
															{subject.courseCount}
														</div>
													</div>

													{/* Subject name */}
													<div className="p-3">
														<h4 className="font-bold text-sm text-base-content line-clamp-1">
															{getName(subject.name)}
														</h4>
														{subject.category && (
															<span className="text-xs text-base-content/60">
																{getName(subject.category.name)}
															</span>
														)}
													</div>

													{/* Selection indicator */}
													{isSelected && (
														<motion.div
															layoutId="subject-indicator"
															className="absolute top-2 left-2 w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center"
															initial={false}
														>
															<svg
																className="w-3 h-3 text-white"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={3}
																	d="M5 13l4 4L19 7"
																/>
															</svg>
														</motion.div>
													)}
												</motion.button>
											);
										})}
									</div>

									{/* Right Arrow */}
									{canScrollRight(
										subjectCarouselRef,
										subjectScrollPosition
									) && (
										<motion.button
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											onClick={() =>
												scrollCarousel(
													subjectCarouselRef,
													"right",
													setSubjectScrollPosition
												)
											}
											className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-brand-lavender/20"
										>
											<FaChevronRight className="text-brand-lavender" />
										</motion.button>
									)}
								</div>
							</div>
						)}

						{/* Teachers Section with Carousel */}
						{teachers.length > 0 && (
							<div>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center">
										<FaUser className="text-white" />
									</div>
									<h3 className="text-xl font-bold text-base-content">
										{t("dashboard.browse_by_teacher")}
									</h3>
								</div>

								{/* Carousel Container */}
								<div className="relative group">
									{/* Left Arrow */}
									{canScrollLeft(teacherScrollPosition) && (
										<motion.button
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											onClick={() =>
												scrollCarousel(
													teacherCarouselRef,
													"left",
													setTeacherScrollPosition
												)
											}
											className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-brand-lavender/20"
										>
											<FaChevronLeft className="text-brand-lavender" />
										</motion.button>
									)}

									{/* Carousel */}
									<div
										ref={teacherCarouselRef}
										onScroll={() =>
											handleScroll(teacherCarouselRef, setTeacherScrollPosition)
										}
										className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
										style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
									>
										{teachers.map((teacher, index) => {
											const isSelected =
												selectedTeacher === teacher.id.toString();
											return (
												<motion.button
													key={teacher.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.03 }}
													whileHover={{ scale: 1.03, y: -5 }}
													whileTap={{ scale: 0.97 }}
													onClick={() =>
														onTeacherChange(
															isSelected ? "" : teacher.id.toString()
														)
													}
													className={`relative flex-shrink-0 w-40 overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 text-center ${
														isSelected
															? "border-brand-lavender shadow-lg shadow-brand-lavender/30 bg-gradient-to-br from-brand-lavender/20 to-brand-coral/20"
															: "border-brand-lavender/20 hover:border-brand-lavender/50 bg-gradient-to-br from-base-100 to-brand-cream/20"
													}`}
												>
													{/* Teacher avatar */}
													<div className="relative mx-auto w-16 h-16 mb-3">
														{teacher.avatar ? (
															<img
																src={`${API_URL}/${teacher.avatar}`}
																alt={teacher.name}
																className="w-full h-full rounded-full object-cover border-2 border-white shadow-lg"
															/>
														) : (
															<div className="w-full h-full rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center text-white text-xl font-bold">
																{teacher.name?.charAt(0)?.toUpperCase() || "T"}
															</div>
														)}

														{/* Selection indicator */}
														{isSelected && (
															<motion.div
																layoutId="teacher-indicator"
																className="absolute -top-1 -right-1 w-6 h-6 bg-brand-lavender rounded-full flex items-center justify-center border-2 border-white"
																initial={false}
															>
																<svg
																	className="w-3 h-3 text-white"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={3}
																		d="M5 13l4 4L19 7"
																	/>
																</svg>
															</motion.div>
														)}
													</div>

													{/* Teacher name */}
													<h4 className="font-bold text-sm text-base-content line-clamp-1">
														{teacher.name}
													</h4>
													{teacher.specialty && (
														<span className="text-xs text-base-content/60 line-clamp-1">
															{getName(teacher.specialty)}
														</span>
													)}
												</motion.button>
											);
										})}
									</div>

									{/* Right Arrow */}
									{canScrollRight(
										teacherCarouselRef,
										teacherScrollPosition
									) && (
										<motion.button
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											onClick={() =>
												scrollCarousel(
													teacherCarouselRef,
													"right",
													setTeacherScrollPosition
												)
											}
											className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-brand-lavender/20"
										>
											<FaChevronRight className="text-brand-lavender" />
										</motion.button>
									)}
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default FilterCards;
