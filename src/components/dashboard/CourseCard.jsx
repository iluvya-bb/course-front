import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { FaGraduationCap, FaBook, FaCheckCircle, FaClock, FaStar, FaArrowRight, FaTags } from "react-icons/fa";

const CourseCard = ({ course, onSubscribe }) => {
	const { t } = useTranslation();

	const imageUrl = course.bannerImage
		? `${import.meta.env.VITE_API_URL}/${course.bannerImage}`
		: "https://via.placeholder.com/400x300?text=No+Image";

	return (
		<motion.div
			whileHover={{ y: -8, scale: 1.02 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-brand-lavender/20 shadow-xl hover:shadow-2xl transition-all duration-300"
		>
			{/* Image Section with Overlay */}
			<div className="relative h-48 overflow-hidden">
				<Link to={`/course/${course.id}`} className="block">
					<img
						src={imageUrl}
						alt={course.title}
						className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "https://via.placeholder.com/400x300?text=Image+Error";
						}}
					/>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
				</Link>

				{/* Category Badges */}
				{course.categories && course.categories.length > 0 && (
					<div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-6rem)]">
						{course.categories.slice(0, 2).map((category) => {
							const categoryName = typeof category.name === 'object'
								? category.name.mn || category.name.en || category.name
								: category.name;
							return (
								<span key={category.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-brand-lavender border border-brand-lavender/30 shadow-lg">
									<FaBook className="text-xs" />
									{categoryName}
								</span>
							);
						})}
						{course.categories.length > 2 && (
							<span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-brand-lavender border border-brand-lavender/30 shadow-lg">
								+{course.categories.length - 2}
							</span>
						)}
					</div>
				)}

				{/* Subscribed Badge or Sale Badge */}
				<div className="absolute top-4 right-4 flex flex-col gap-2">
					{course.subscribed && (
						<motion.span
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 rounded-full text-xs font-bold text-white shadow-lg"
						>
							<FaCheckCircle />
							{t("dashboard.subscribed")}
						</motion.span>
					)}
					{!course.subscribed && course.saleInfo && (
						<motion.span
							initial={{ scale: 0, rotate: -10 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ type: "spring", stiffness: 500 }}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse"
						>
							<FaTags />
							{course.saleInfo.badgeText || `${course.saleInfo.discountValue}${course.saleInfo.discountType === 'percentage' ? '%' : '₮'} OFF`}
						</motion.span>
					)}
				</div>

				{/* Rating Badge (bottom left) */}
				{course.ratingInfo?.averageRating && (
					<div className="absolute bottom-4 left-4">
						<span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-lg">
							<FaStar className="text-xs" />
							{course.ratingInfo.averageRating}
							{course.ratingInfo.totalRatings > 0 && (
								<span className="text-white/80">({course.ratingInfo.totalRatings})</span>
							)}
						</span>
					</div>
				)}

				{/* Hover Arrow Icon */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl">
						<FaArrowRight className="text-2xl text-brand-lavender" />
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="p-6">
				<Link to={`/course/${course.id}`} className="block">
					{/* Title */}
					<h3 className="text-xl font-black text-base-content group-hover:text-brand-lavender transition-colors duration-200 mb-2 line-clamp-2 min-h-[3.5rem]">
						{course.title}
					</h3>

					{/* Instructor */}
					<div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
						<FaGraduationCap className="text-brand-coral" />
						<span className="font-medium">
							{course.teacher?.name || t("courses.instructor_unknown")}
						</span>
					</div>
				</Link>

				{/* Stats Row */}
				<div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-100">
					<div className="flex items-center gap-1.5 text-xs text-base-content/60">
						<FaBook className="text-brand-lavender" />
						<span className="font-semibold">{course.lessons?.length || 0} {t("course.lessons", { defaultValue: "Lessons" })}</span>
					</div>
					<div className="flex items-center gap-1.5 text-xs text-base-content/60">
						<FaClock className="text-brand-coral" />
						<span className="font-semibold">{t("dashboard.lifetime", { defaultValue: "Lifetime" })}</span>
					</div>
				</div>

				{/* Action Section */}
				{course.subscribed ? (
					<div className="space-y-4">
						{/* Progress Bar */}
						{course.progress !== undefined && (
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-xs font-bold text-base-content/60 uppercase">
										{t("course.progress")}
									</span>
									<span className="text-sm font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
										{course.progress}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${course.progress}%` }}
										transition={{ duration: 1, ease: "easeOut" }}
										className="bg-gradient-to-r from-brand-lavender to-brand-coral h-2.5 rounded-full"
									></motion.div>
								</div>
							</div>
						)}

						{/* Continue Button */}
						<Link to={`/course/${course.id}`} className="block">
							<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
								<Button className="w-full bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
									<FaBook className="mr-2" />
									{t("dashboard.continue", { defaultValue: "Continue Learning" })}
								</Button>
							</motion.div>
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{/* Price and Enroll Button */}
						<div className="flex items-center justify-between">
							<div>
								{course.price != null && course.price > 0 ? (
									course.saleInfo ? (
										<div className="flex items-center gap-2">
											<div className="text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
												₮{course.saleInfo.salePrice.toLocaleString()}
											</div>
											<div className="text-lg text-gray-400 line-through">
												₮{course.price.toLocaleString()}
											</div>
										</div>
									) : (
										<div className="text-3xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
											₮{course.price.toLocaleString()}
										</div>
									)
								) : (
									<div className="text-3xl font-black bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
										{t("free", { defaultValue: "FREE" })}
									</div>
								)}
							</div>
						</div>

						{/* Sale savings info */}
						{course.saleInfo && (
							<div className="text-sm text-green-600 font-semibold">
								{t("dashboard.save", { defaultValue: "Save" })} ₮{course.saleInfo.discount.toLocaleString()}!
							</div>
						)}

						{/* Enroll Button */}
						<Link to={`/course/${course.id}`} className="block">
							<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
								<Button className="w-full bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
									<FaGraduationCap className="mr-2" />
									{t("dashboard.enroll", { defaultValue: "Enroll Now" })}
								</Button>
							</motion.div>
						</Link>
					</div>
				)}
			</div>

			{/* Decorative corner accent */}
			<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-lavender/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
		</motion.div>
	);
};

export default CourseCard;
