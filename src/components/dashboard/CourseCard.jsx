import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button"; // Assuming UI components exist
import { motion } from "framer-motion";
// --- 1. Removed API_URL import ---
import API from "../../services/api"; // Keep API import if needed elsewhere, otherwise remove

const CourseCard = ({ course, onSubscribe }) => {
	const { t } = useTranslation(["translation", "course"]);

	// --- 2. Use import.meta.env directly ---
	const imageUrl = course.bannerImage
		? `${import.meta.env.VITE_API_URL}/${course.bannerImage}` // Use Vite env variable
		: "https://via.placeholder.com/400x200?text=No+Image"; // Placeholder
	// ------------------------------------

	return (
		<motion.div
			className="bg-neutral rounded-md overflow-hidden border-2 border-neutral shadow-[4px_4px_0px_#00F6FF] hover:shadow-none transform hover:-translate-y-1 transition-all duration-200 flex flex-col"
			layout
			key={course.id}
		>
			<div className="flex flex-col flex-grow">
				{/* Image Section */}
				<div className="relative">
					<Link to={`/course/${course.id}`} className="block">
						<img
							src={imageUrl}
							alt={course.title}
							className="w-full h-40 object-cover"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src =
									"https://via.placeholder.com/400x200?text=Image+Error";
							}}
						/>
					</Link>
					{course.subscribed && (
						<div className="absolute top-2 right-2 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded">
							{t("dashboard.subscribed", { ns: "translation" })}
						</div>
					)}
				</div>

				{/* Content Section */}
				<div className="p-6 flex-grow flex flex-col">
					<Link to={`/course/${course.id}`} className="block flex-grow">
						<p className="text-sm font-bold text-primary uppercase">
							{course.category || t("courses.category_unknown")}
						</p>
						<h3 className="mt-2 text-xl font-bold text-base-content hover:text-primary transition-colors duration-200">
							{course.title}
						</h3>
						<p className="mt-1 text-base-content/80 text-sm">
							{t("dashboard.by", { ns: "translation" })}{" "}
							{course.teacher?.name || t("courses.instructor_unknown")}
						</p>
					</Link>

					{/* Action/Progress Section */}
					<div className="mt-4">
						{course.subscribed ? (
							<>
								{course.progress !== undefined && (
									<>
										<div className="w-full bg-base-100 rounded-full h-2.5">
											<div
												className="bg-primary h-2.5 rounded-full"
												style={{ width: `${course.progress}%` }}
											></div>
										</div>
										<p className="mt-2 text-right text-sm font-semibold text-base-content/80">
											{course.progress}%{" "}
											{t("dashboard.complete", { ns: "translation" })}
										</p>
									</>
								)}
								<Link to={`/course/${course.id}`} className="block">
									<Button className="w-full mt-4">
										{t("dashboard.view_course", { ns: "translation" })}
									</Button>
								</Link>
							</>
						) : (
							<div className="flex items-center justify-between mt-4">
								<p className="text-2xl font-bold text-primary">
									{course.price != null && course.price > 0
										? `${course.price}₮`
										: t("free", { ns: "translation" })}
								</p>

								<Link to={`/course/${course.id}`} className="block">
									<Button>
										{t("dashboard.subscribe", { ns: "translation" })}
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CourseCard;
