import {
	CheckCircle2,
	ChevronRight,
	Facebook,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Twitter,
	Youtube,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import API, { API_URL } from "../services/api";

// Animation Variants
const fadeIn = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: "easeInOut",
		},
	},
};

const stagger = {
	visible: {
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const staggerFast = {
	visible: {
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const scaleIn = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

const slideIn = {
	hidden: { opacity: 0, x: -50 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.8,
			ease: "easeOut",
		},
	},
};

const floatAnimation = {
	animate: {
		y: [0, -20, 0],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

// Text reveal animation
const textReveal = {
	hidden: { opacity: 0, y: 20 },
	visible: (i = 0) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.5,
			ease: "easeOut",
		},
	}),
};

// Gradient shift animation
const gradientShift = {
	animate: {
		backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
		transition: {
			duration: 5,
			repeat: Infinity,
			ease: "linear",
		},
	},
};

// Hover effects
const hoverLift = {
	rest: { y: 0, scale: 1 },
	hover: {
		y: -8,
		scale: 1.02,
		transition: {
			duration: 0.3,
			ease: "easeOut",
		},
	},
};

const hoverGlow = {
	rest: { boxShadow: "0 0 0 rgba(119, 118, 188, 0)" },
	hover: {
		boxShadow: "0 20px 40px rgba(119, 118, 188, 0.3)",
		transition: {
			duration: 0.3,
		},
	},
};

// Animated Background Component
const AnimatedBackground = () => {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			<motion.div
				className="absolute top-20 left-10 w-64 h-64 rounded-full bg-brand-lavender/30 blur-3xl"
				animate={{
					x: [0, 100, 0],
					y: [0, 50, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute top-40 right-20 w-96 h-96 rounded-full bg-brand-coral/30 blur-3xl"
				animate={{
					x: [0, -80, 0],
					y: [0, 80, 0],
					scale: [1, 1.3, 1],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-brand-yellow/40 blur-3xl"
				animate={{
					x: [0, 60, 0],
					y: [0, -60, 0],
					scale: [1, 1.1, 1],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-brand-lime/25 blur-3xl"
				animate={{
					x: [0, -40, 0],
					y: [0, 40, 0],
					scale: [1, 1.15, 1],
				}}
				transition={{
					duration: 22,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-cream/60 blur-2xl"
				animate={{
					x: [0, 30, 0],
					y: [0, -30, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 16,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
};

import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedBook from "./AnimatedBook";
import Hero3DAnimation from "./Hero3DAnimation";
import ModernHero from "./ModernHero";

import CategoriesSection from "./CategoriesSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

// Animated Text Component
const AnimatedText = ({ text, className = "" }) => {
	const words = text.split(" ");
	return (
		<motion.div className={className} variants={staggerFast} initial="hidden" animate="visible">
			{words.map((word, i) => (
				<motion.span
					key={i}
					className="inline-block mr-2"
					variants={textReveal}
					custom={i}
				>
					{word}
				</motion.span>
			))}
		</motion.div>
	);
};

const Nav = () => {
	const { t } = useTranslation();
	const [logo, setLogo] = useState(null);
	const [siteName, setSiteName] = useState("EduClass");

	useEffect(() => {
		const fetchParams = async () => {
			try {
				const response = await API.getParameters();
				const params = response.data.data || [];

				const logoParam = params.find((p) => p.key === "logo");
				if (logoParam && logoParam.value) {
					setLogo(`${API_URL}/${logoParam.value}`);
				}

				const siteNameParam = params.find((p) => p.key === "site_name");
				if (siteNameParam && siteNameParam.value) {
					setSiteName(siteNameParam.value);
				}
			} catch (error) {
				console.error("Failed to fetch parameters:", error);
			}
		};
		fetchParams();
	}, []);

	return (
		<motion.nav
			className="bg-base-100/90 backdrop-blur-md border-b-2 border-brand-lavender/30 fixed w-full top-0 z-50 shadow-lg"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				<motion.div
					className="flex items-center"
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}
				>
					<img
						src={logo || "/logo.svg"}
						alt="EduClass logo"
						className="h-8 w-auto"
					/>
					<h1 className="text-2xl font-bold bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent ml-2">
						{siteName}
					</h1>
				</motion.div>
				<div className="hidden md:flex items-center space-x-8">
					<motion.a
						href="#features"
						className="text-base-content hover:text-brand-lavender transition-all duration-300 font-semibold relative group"
						whileHover={{ y: -2 }}
					>
						{t("nav.features")}
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-lavender group-hover:w-full transition-all duration-300"></span>
					</motion.a>
					<motion.a
						href="#categories"
						className="text-base-content hover:text-brand-coral transition-all duration-300 font-semibold relative group"
						whileHover={{ y: -2 }}
					>
						{t("nav.categories", { defaultValue: "Ангилал" })}
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-coral group-hover:w-full transition-all duration-300"></span>
					</motion.a>
					<motion.a
						href="#courses"
						className="text-base-content hover:text-brand-yellow transition-all duration-300 font-semibold relative group"
						whileHover={{ y: -2 }}
					>
						{t("nav.courses")}
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-yellow group-hover:w-full transition-all duration-300"></span>
					</motion.a>
					<motion.a
						href="#teachers"
						className="text-base-content hover:text-brand-lime transition-all duration-300 font-semibold relative group"
						whileHover={{ y: -2 }}
					>
						{t("nav.teachers")}
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-lime group-hover:w-full transition-all duration-300"></span>
					</motion.a>
					<motion.a
						href="/account"
						className="text-base-content hover:text-brand-lavender transition-all duration-300 font-semibold relative group"
						whileHover={{ y: -2 }}
					>
						{t("nav.book_teacher", { defaultValue: "Багш захиалах" })}
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-lavender group-hover:w-full transition-all duration-300"></span>
					</motion.a>
					<motion.a
						href="#testimonials"
						className="text-base-content hover:text-brand-coral transition-all duration-300 font-semibold relative group"
						whileHover={{ y: -2 }}
					>
						{t("nav.testimonials")}
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-coral group-hover:w-full transition-all duration-300"></span>
					</motion.a>
				</div>
				<div className="flex items-center">
					<LanguageSwitcher />
					<motion.a
						href="/account"
						className="bg-brand-lavender text-white px-6 py-2 rounded-full font-bold ml-4 hover:shadow-lg hover:shadow-brand-lavender/50 hover:bg-brand-coral transition-all duration-300"
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.95 }}
					>
						{t("nav.login", { defaultValue: "Нэвтрэх" })}
					</motion.a>
				</div>
			</div>
		</motion.nav>
	);
};

import { Button } from "./ui/button";

const Hero = () => {
	return <ModernHero />;
};

const Features = () => {
	const { t } = useTranslation();
	return (
		<section id="features" className="py-24 bg-gradient-to-b from-base-100 to-brand-cream/20 relative overflow-hidden">
			{/* Background decorative elements */}
			<motion.div
				className="absolute top-10 right-0 w-96 h-96 bg-brand-lavender/10 rounded-full blur-3xl"
				animate={{
					x: [0, -50, 0],
					y: [0, 50, 0],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="grid md:grid-cols-2 gap-12"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.div
						className="relative text-center p-8 bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 rounded-3xl border-0 shadow-xl group overflow-hidden"
						variants={scaleIn}
						whileHover={{ y: -12, scale: 1.03 }}
						initial="rest"
						animate="rest"
					>
						<motion.div
							className="absolute inset-0 bg-gradient-to-br from-brand-lavender/20 to-brand-coral/20 opacity-0"
							initial={{ opacity: 0 }}
							whileHover={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						/>
						<div className="relative z-10">
							<motion.div
								className="bg-gradient-to-br from-brand-lavender to-brand-coral rounded-full p-4 inline-block"
								whileHover={{ rotate: 360, scale: 1.1 }}
								transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
							>
								<svg
									className="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 10l4.55a2.5 2.5 0 010 4.24l-8.51 4.72a2.5 2.5 0 01-3.54-1.73L6 9m6 1l6-3.5"
									></path>
								</svg>
							</motion.div>
							<motion.h3
								className="mt-6 text-2xl font-bold bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent"
								whileHover={{ scale: 1.05 }}
							>
								{t("features.videos_title")}
							</motion.h3>
							<motion.p
								className="mt-2 text-base-content"
								initial={{ opacity: 0.8 }}
								whileHover={{ opacity: 1 }}
							>
								{t("features.videos_text")}
							</motion.p>
						</div>
						<motion.div
							className="absolute -bottom-2 -right-2 w-20 h-20 bg-brand-coral/20 rounded-full blur-xl"
							animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
							transition={{ duration: 3, repeat: Infinity }}
						/>
					</motion.div>
					<motion.div
						className="relative text-center p-8 bg-gradient-to-br from-brand-yellow/10 to-brand-lime/10 rounded-3xl border-0 shadow-xl group overflow-hidden"
						variants={scaleIn}
						whileHover={{ y: -12, scale: 1.03 }}
					>
						<motion.div
							className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 to-brand-lime/20 opacity-0"
							initial={{ opacity: 0 }}
							whileHover={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						/>
						<div className="relative z-10">
							<motion.div
								className="bg-gradient-to-br from-brand-yellow to-brand-lime rounded-full p-4 inline-block"
								whileHover={{ rotate: 360, scale: 1.1 }}
								transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
							>
								<svg
									className="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									></path>
								</svg>
							</motion.div>
							<motion.h3
								className="mt-6 text-2xl font-bold bg-gradient-to-r from-brand-yellow to-brand-lime bg-clip-text text-transparent"
								whileHover={{ scale: 1.05 }}
							>
								{t("features.live_tutoring_title")}
							</motion.h3>
							<motion.p
								className="mt-2 text-base-content"
								initial={{ opacity: 0.8 }}
								whileHover={{ opacity: 1 }}
							>
								{t("features.live_tutoring_text")}
							</motion.p>
						</div>
						<motion.div
							className="absolute -bottom-2 -right-2 w-20 h-20 bg-brand-lime/20 rounded-full blur-xl"
							animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
							transition={{ duration: 3, repeat: Infinity, delay: 1 }}
						/>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

const Courses = () => {
	const { t, i18n } = useTranslation();
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await API.getAllCourses();
				// Get first 6 courses or featured courses
				const allCourses = response.data.data || [];
				setCourses(allCourses.slice(0, 6));
			} catch (error) {
				console.error("Failed to fetch courses:", error);
				setCourses([]); // Set empty array on error
			} finally {
				setLoading(false);
			}
		};
		fetchCourses();
	}, []);

	// Don't render section if no courses and not loading
	if (!loading && courses.length === 0) {
		return null;
	}

	return (
		<section id="courses" className="py-24 bg-gradient-to-b from-brand-cream/20 to-brand-lavender/10 relative overflow-hidden">
			{/* Animated background */}
			<motion.div
				className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-brand-lavender/20 to-transparent"
				animate={{
					opacity: [0.3, 0.6, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.h2
						className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent uppercase"
						initial={{ opacity: 0, y: -20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						{t("courses.title")}
					</motion.h2>
				</motion.div>
				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content">
							{t("common.loading") || "Loading..."}
						</p>
					</div>
				) : (
					<motion.div
						className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
						variants={stagger}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{courses.map((course) => {
							const courseTitle =
								typeof course.title === "object"
									? course.title[i18n.language] ||
										course.title.en ||
										course.title.mn
									: course.title;
							const courseDesc =
								typeof course.description === "object"
									? course.description[i18n.language] ||
										course.description.en ||
										course.description.mn
									: course.description || "";
							const bannerImage = course.bannerImage
								? `${API_URL}/${course.bannerImage}`
								: "https://images.unsplash.com/photo-1524995767962-b1f5b5a8a485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80";

							return (
								<motion.div
									key={course.id}
									className="relative bg-base-100 rounded-3xl overflow-hidden border-0 shadow-xl group"
									variants={scaleIn}
									whileHover={{ y: -15, scale: 1.04 }}
									transition={{ duration: 0.3, ease: "easeOut" }}
								>
									<motion.div
										className="absolute inset-0 bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 opacity-0 z-0"
										whileHover={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									/>
									<div className="relative overflow-hidden">
										<motion.div
											className="absolute inset-0 bg-gradient-to-br from-brand-lavender/80 to-brand-coral/80 opacity-0 z-10 flex items-center justify-center"
											whileHover={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											<motion.div
												initial={{ scale: 0 }}
												whileHover={{ scale: 1, rotate: 360 }}
												transition={{ duration: 0.5, type: "spring" }}
												className="bg-white rounded-full p-4"
											>
												<svg className="w-8 h-8 text-brand-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											</motion.div>
										</motion.div>
										<motion.img
											src={bannerImage}
											alt={courseTitle}
											className="w-full h-48 object-cover"
											whileHover={{ scale: 1.15 }}
											transition={{ duration: 0.5 }}
										/>
									</div>
									<div className="p-6 relative z-10">
										<motion.p
											className="text-sm font-bold bg-gradient-to-r from-brand-coral to-brand-yellow bg-clip-text text-transparent uppercase"
											whileHover={{ scale: 1.05, x: 5 }}
										>
											{course.category?.name?.[i18n.language] ||
												course.category?.name ||
												"Course"}
										</motion.p>
										<motion.h3
											className="mt-2 text-xl font-bold text-base-content group-hover:text-brand-lavender transition-colors"
											whileHover={{ x: 5 }}
										>
											{courseTitle}
										</motion.h3>
										<p className="mt-2 text-base-content/80 line-clamp-2">
											{courseDesc}
										</p>
										<div className="mt-4">
											<motion.a
												href={`/courses/${course.id}`}
												className="inline-flex items-center text-brand-lavender font-bold group/link"
												whileHover={{ x: 8, color: "#ff764d" }}
												transition={{ duration: 0.2 }}
											>
												<span>{t("courses.details_button")}</span>
												<motion.span
													className="ml-2"
													animate={{ x: [0, 5, 0] }}
													transition={{
														duration: 1.5,
														repeat: Infinity,
														ease: "easeInOut",
													}}
												>
													→
												</motion.span>
											</motion.a>
										</div>
									</div>
									<motion.div
										className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-coral/10 rounded-full blur-2xl"
										animate={{ scale: [1, 1.3, 1] }}
										transition={{ duration: 4, repeat: Infinity }}
									/>
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</div>
		</section>
	);
};

const HowItWorks = () => {
	const { t } = useTranslation();
	const steps = [
		{
			title: t("how_it_works.step1_title"),
			desc: t("how_it_works.step1_desc"),
		},
		{
			title: t("how_it_works.step2_title"),
			desc: t("how_it_works.step2_desc"),
		},
		{
			title: t("how_it_works.step3_title"),
			desc: t("how_it_works.step3_desc"),
		},
	];

	return (
		<section id="how-it-works" className="py-24 bg-gradient-to-b from-brand-lavender/10 to-base-100 relative overflow-hidden">
			{/* Decorative floating elements */}
			<motion.div
				className="absolute top-20 left-10 w-32 h-32 bg-brand-coral/20 rounded-full blur-2xl"
				animate={{
					x: [0, 50, 0],
					y: [0, -30, 0],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-20 right-10 w-40 h-40 bg-brand-yellow/20 rounded-full blur-2xl"
				animate={{
					x: [0, -40, 0],
					y: [0, 40, 0],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-coral via-brand-yellow to-brand-lime bg-clip-text text-transparent uppercase">
						{t("how_it_works.title")}
					</h2>
				</motion.div>
				<motion.div
					className="mt-12 grid md:grid-cols-3 gap-8 text-center"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{steps.map((step, index) => {
						const colors = [
							{ bg: "from-brand-lavender to-brand-coral", text: "lavender" },
							{ bg: "from-brand-coral to-brand-yellow", text: "coral" },
							{ bg: "from-brand-yellow to-brand-lime", text: "yellow" },
						];
						const stepColor = colors[index % colors.length];
						return (
							<motion.div
								key={index}
								className="relative"
								variants={scaleIn}
								whileHover={{ y: -10 }}
							>
								<div className="flex items-center justify-center">
									<motion.div
										className={`w-20 h-20 rounded-full bg-gradient-to-br ${stepColor.bg} text-white flex items-center justify-center text-3xl font-bold shadow-xl`}
										whileHover={{ rotate: 360, scale: 1.1 }}
										transition={{ duration: 0.6 }}
									>
										{index + 1}
									</motion.div>
								</div>
								<h3 className="mt-6 text-2xl font-bold text-base-content hover:scale-105 transition-transform">
									{step.title}
								</h3>
								<p className="mt-2 text-base-content/80">{step.desc}</p>
								{index < steps.length - 1 && (
									<motion.div
										className={`hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r ${stepColor.bg} -z-10`}
										initial={{ scaleX: 0 }}
										whileInView={{ scaleX: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.8, delay: 0.3 }}
									></motion.div>
								)}
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
};

const Teachers = () => {
	const { t, i18n } = useTranslation();
	const [teachers, setTeachers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				const response = await API.getTeachers();
				const allTeachers = response.data.data || [];
				setTeachers(allTeachers.slice(0, 6)); // Show first 6 teachers
			} catch (error) {
				console.error("Failed to fetch teachers:", error);
				setTeachers([]);
			} finally {
				setLoading(false);
			}
		};
		fetchTeachers();
	}, []);

	// Don't render section if no teachers and not loading
	if (!loading && teachers.length === 0) {
		return null;
	}

	return (
		<section id="teachers" className="py-24 bg-gradient-to-b from-base-100 to-brand-cream/30 relative overflow-hidden">
			{/* Animated background elements */}
			<motion.div
				className="absolute top-0 right-0 w-96 h-96 bg-brand-lavender/10 rounded-full blur-3xl"
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent uppercase">
						{t("teachers.title")}
					</h2>
				</motion.div>
				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content">
							{t("common.loading") || "Loading..."}
						</p>
					</div>
				) : (
					<motion.div
						className="grid md:grid-cols-3 gap-8"
						variants={stagger}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{teachers.map((teacher) => {
							const teacherName =
								teacher.name || t("teachers.default_name") || "Teacher";
							const teacherSpecialty =
								typeof teacher.specialty === "object"
									? teacher.specialty[i18n.language] ||
										teacher.specialty.en ||
										teacher.specialty.mn
									: teacher.specialty || "";
							const teacherBio =
								typeof teacher.bio === "object"
									? teacher.bio[i18n.language] ||
										teacher.bio.en ||
										teacher.bio.mn
									: teacher.bio || "";
							const avatarUrl = teacher.avatar
								? `${API_URL}/${teacher.avatar}`
								: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80";

							const borderColors = [
								"border-brand-lavender shadow-brand-lavender/50",
								"border-brand-coral shadow-brand-coral/50",
								"border-brand-yellow shadow-brand-yellow/50",
							];
							const borderColor = borderColors[teacher.id % borderColors.length];

							return (
								<motion.div
									key={teacher.id}
									className="text-center group"
									variants={scaleIn}
									whileHover={{ y: -10 }}
								>
									<div className="relative inline-block">
										<motion.div
											className={`absolute inset-0 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
										/>
										<motion.img
											src={avatarUrl}
											alt={teacherName}
											className={`relative w-48 h-48 rounded-full mx-auto border-4 ${borderColor} shadow-xl object-cover group-hover:scale-105 transition-transform duration-500`}
											whileHover={{ rotate: [0, -5, 5, -5, 0] }}
											transition={{ duration: 0.5 }}
										/>
									</div>
									<h3 className="mt-6 text-2xl font-bold text-base-content group-hover:text-brand-lavender transition-colors">
										{teacherName}
									</h3>
									<p className="mt-1 font-semibold bg-gradient-to-r from-brand-coral to-brand-yellow bg-clip-text text-transparent">
										{teacherSpecialty}
									</p>
									<p className="mt-2 text-base-content/80 text-sm">
										{teacherBio}
									</p>
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</div>
		</section>
	);
};

const Testimonials = () => {
	const { t, i18n } = useTranslation();
	const [testimonials, setTestimonials] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const response = await API.getTestimonials();
				setTestimonials(response.data.data || []);
			} catch (error) {
				console.error("Failed to fetch testimonials:", error);
				setTestimonials([]);
			} finally {
				setLoading(false);
			}
		};
		fetchTestimonials();
	}, []);

	// Don't render section if no testimonials and not loading
	if (!loading && testimonials.length === 0) {
		return null;
	}

	return (
		<section id="testimonials" className="py-24 bg-gradient-to-b from-brand-cream/30 to-brand-lavender/10 relative overflow-hidden">
			{/* Animated background blobs */}
			<motion.div
				className="absolute top-1/4 left-0 w-72 h-72 bg-brand-coral/20 rounded-full blur-3xl"
				animate={{
					x: [0, 100, 0],
					scale: [1, 1.3, 1],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-coral via-brand-yellow to-brand-lime bg-clip-text text-transparent uppercase">
						{t("testimonials.title")}
					</h2>
				</motion.div>
				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content">
							{t("common.loading") || "Loading..."}
						</p>
					</div>
				) : (
					<motion.div
						className="grid md:grid-cols-3 gap-8"
						variants={stagger}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{testimonials.map((testimonial) => {
							const testimonialName =
								typeof testimonial.name === "object"
									? testimonial.name[i18n.language] ||
										testimonial.name.en ||
										testimonial.name.mn
									: testimonial.name ||
										t("testimonials.default_name") ||
										"User";
							const testimonialRole =
								typeof testimonial.role === "object"
									? testimonial.role[i18n.language] ||
										testimonial.role.en ||
										testimonial.role.mn
									: testimonial.role || "";
							const testimonialQuote =
								typeof testimonial.quote === "object"
									? testimonial.quote[i18n.language] ||
										testimonial.quote.en ||
										testimonial.quote.mn
									: testimonial.quote || "";
							const imageUrl = testimonial.imageUrl
								? `${API_URL}/${testimonial.imageUrl}`
								: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80";

							const cardColors = [
								"from-brand-lavender/10 to-brand-coral/10 border-brand-lavender/30 hover:shadow-brand-lavender/30",
								"from-brand-coral/10 to-brand-yellow/10 border-brand-coral/30 hover:shadow-brand-coral/30",
								"from-brand-yellow/10 to-brand-lime/10 border-brand-yellow/30 hover:shadow-brand-yellow/30",
							];
							const cardColor =
								cardColors[testimonial.id % cardColors.length];

							return (
								<motion.div
									key={testimonial.id}
									className={`bg-gradient-to-br ${cardColor} p-8 rounded-3xl border-2 shadow-xl hover:shadow-2xl transition-all duration-500 group`}
									variants={scaleIn}
									whileHover={{ y: -10, scale: 1.02 }}
								>
									<motion.div
										className="relative"
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
									>
										<svg
											className="absolute -top-2 -left-2 w-8 h-8 text-brand-lavender/30"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
										</svg>
										<p className="text-base-content italic text-lg relative z-10 pl-8">
											&quot;{testimonialQuote}&quot;
										</p>
									</motion.div>
									<div className="mt-6 flex items-center">
										<motion.div
											className="relative"
											whileHover={{ scale: 1.1, rotate: 5 }}
											transition={{ duration: 0.3 }}
										>
											<div className="absolute inset-0 bg-gradient-to-br from-brand-lavender to-brand-coral rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
											<img
												src={imageUrl}
												alt={testimonialName}
												className="relative w-16 h-16 rounded-full border-0 object-cover"
											/>
										</motion.div>
										<div className="ml-4">
											<p className="font-bold text-base-content text-xl group-hover:text-brand-lavender transition-colors">
												{testimonialName}
											</p>
											<p className="text-brand-coral font-semibold">{testimonialRole}</p>
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</div>
		</section>
	);
};

const About = () => {
	const { t } = useTranslation();
	return (
		<section id="about" className="py-24 bg-gradient-to-b from-brand-lavender/10 to-base-100 relative overflow-hidden">
			{/* Floating decorative circles */}
			<motion.div
				className="absolute top-1/3 right-10 w-24 h-24 bg-brand-yellow/30 rounded-full"
				animate={{
					y: [0, -30, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<div className="flex flex-col md:flex-row items-center gap-12">
					<motion.div
						className="md:w-1/2 relative"
						variants={slideIn}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<div className="absolute inset-0 bg-gradient-to-br from-brand-lavender/30 to-brand-coral/30 rounded-3xl blur-2xl"></div>
						<motion.img
							src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
							alt="Team working"
							className="relative rounded-3xl border-0 shadow-2xl hover:shadow-brand-coral/50 transition-all duration-500"
							whileHover={{ scale: 1.05, rotate: 2 }}
							transition={{ duration: 0.3 }}
						/>
					</motion.div>
					<motion.div
						className="md:w-1/2"
						variants={fadeIn}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent uppercase">
							{t("about.title")}
						</h2>
						<p className="mt-6 text-base-content text-lg leading-relaxed">
							{t("about.text")}
						</p>
						<motion.div
							className="mt-8 flex gap-4"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
						>
							<CheckCircle2 className="w-6 h-6 text-brand-lime flex-shrink-0 mt-1" />
							<p className="text-base-content">
								Professional educators with years of experience
							</p>
						</motion.div>
						<motion.div
							className="mt-4 flex gap-4"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4 }}
						>
							<CheckCircle2 className="w-6 h-6 text-brand-coral flex-shrink-0 mt-1" />
							<p className="text-base-content">
								Interactive and engaging learning materials
							</p>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

const Faq = () => {
	const { t } = useTranslation();
	const faqs = [
		{ q: t("faq_section.q1"), a: t("faq_section.a1") },
		{ q: t("faq_section.q2"), a: t("faq_section.a2") },
		{ q: t("faq_section.q3"), a: t("faq_section.a3") },
		{ q: t("faq_section.q4"), a: t("faq_section.a4") },
	];

	return (
		<section id="faq" className="py-24 bg-gradient-to-b from-base-100 to-brand-cream/20">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent uppercase">
						{t("faq_section.title")}
					</h2>
				</motion.div>
				<motion.div
					className="mt-12 max-w-3xl mx-auto"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							className="border-b-2 border-brand-lavender/20 py-6 hover:bg-brand-lavender/5 px-4 rounded-lg transition-all duration-300"
							variants={fadeIn}
							whileHover={{ x: 10 }}
						>
							<details className="group">
								<summary className="flex justify-between items-center font-bold text-xl cursor-pointer text-base-content hover:text-brand-lavender transition-colors list-none">
									<span className="pr-4">{faq.q}</span>
									<motion.div
										animate={{ rotate: 0 }}
										whileHover={{ scale: 1.2 }}
									>
										<ChevronRight className="w-6 h-6 transform group-open:rotate-90 transition-transform text-brand-coral" />
									</motion.div>
								</summary>
								<motion.p
									className="mt-4 text-base-content/80 text-lg pl-2"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									{faq.a}
								</motion.p>
							</details>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const Contact = () => {
	const { t } = useTranslation();
	return (
		<section id="contact" className="py-24 bg-gradient-to-b from-brand-cream/20 to-brand-lavender/10 relative overflow-hidden">
			{/* Animated background elements */}
			<motion.div
				className="absolute top-10 left-1/4 w-64 h-64 bg-brand-coral/20 rounded-full blur-3xl"
				animate={{
					x: [0, 50, 0],
					y: [0, -50, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-coral via-brand-yellow to-brand-lime bg-clip-text text-transparent uppercase">
						{t("contact.title")}
					</h2>
				</motion.div>
				<motion.div
					className="mt-12 max-w-xl mx-auto"
					variants={scaleIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<form className="space-y-6 bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border-0 shadow-2xl">
						<motion.input
							type="text"
							placeholder={t("contact.name_placeholder")}
							className="w-full px-4 py-3 rounded-xl border-0 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-brand-lavender focus:border-brand-lavender font-semibold transition-all duration-300"
							whileFocus={{ scale: 1.02 }}
						/>
						<motion.input
							type="email"
							placeholder={t("contact.email_placeholder")}
							className="w-full px-4 py-3 rounded-xl border-0 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-brand-coral font-semibold transition-all duration-300"
							whileFocus={{ scale: 1.02 }}
						/>
						<motion.textarea
							placeholder={t("contact.message_placeholder")}
							rows="4"
							className="w-full px-4 py-3 rounded-xl border-0 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow font-semibold transition-all duration-300"
							whileFocus={{ scale: 1.02 }}
						></motion.textarea>
						<motion.button
							type="submit"
							className="w-full bg-brand-lavender text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-brand-lavender/50 hover:bg-brand-coral transition-all duration-300"
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
						>
							{t("contact.send_button")}
						</motion.button>
					</form>
				</motion.div>
			</div>
		</section>
	);
};

const Footer = () => {
	const { t, i18n } = useTranslation();
	const year = new Date().getFullYear();
	const [siteName, setSiteName] = useState("EduClass");
	const [footerText, setFooterText] = useState("");
	const [contactEmail, setContactEmail] = useState("info@buteekhui.com");
	const [contactPhone, setContactPhone] = useState("+976 90111016");
	const [contactAddress, setContactAddress] = useState("Ulaanbaatar, Mongolia");
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch parameters
				console.log("Footer: Fetching parameters...");
				const response = await API.getParameters();
				console.log("Footer: Parameters response:", response.data);
				const params = response.data.data || [];
				console.log("Footer: Parameters data:", params);

				const siteNameParam = params.find((p) => p.key === "site_name");
				console.log("Footer: site_name param:", siteNameParam);
				if (siteNameParam?.value) setSiteName(siteNameParam.value);

				const footerTextParam = params.find((p) => p.key === "footer_text");
				console.log("Footer: footer_text param:", footerTextParam);
				if (footerTextParam?.value) setFooterText(footerTextParam.value);

				const emailParam = params.find((p) => p.key === "contact_email");
				console.log("Footer: contact_email param:", emailParam);
				if (emailParam?.value) setContactEmail(emailParam.value);

				const phoneParam = params.find((p) => p.key === "contact_phone");
				console.log("Footer: contact_phone param:", phoneParam);
				if (phoneParam?.value) setContactPhone(phoneParam.value);

				const addressParam = params.find((p) => p.key === "contact_address");
				console.log("Footer: contact_address param:", addressParam);
				if (addressParam?.value) setContactAddress(addressParam.value);

				// Fetch courses for footer
				const coursesResponse = await API.getAllCourses();
				const allCourses = coursesResponse.data.data || [];
				// Get first 3 courses for footer
				setCourses(allCourses.slice(0, 3));
			} catch (error) {
				console.error("Footer: Failed to fetch data:", error);
			}
		};
		fetchData();
	}, []);
	return (
		<footer className="bg-gradient-to-b from-brand-lavender/5 to-brand-cream/30 text-base-content relative overflow-hidden">
			{/* Animated background */}
			<motion.div
				className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow"
				initial={{ scaleX: 0 }}
				whileInView={{ scaleX: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 1.5 }}
			/>
			<div className="container mx-auto px-6 py-12 relative z-10">
				<div className="grid md:grid-cols-4 gap-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<h3 className="text-lg font-bold bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
							{siteName}
						</h3>
						<p className="mt-4 text-base-content/80">
							{footerText || t("hero.subtitle")}
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<h3 className="text-lg font-bold bg-gradient-to-r from-brand-coral to-brand-yellow bg-clip-text text-transparent">
							{t("nav.contact")}
						</h3>
						<ul className="mt-4 space-y-2 text-base-content/80">
							<li className="flex items-center hover:text-brand-lavender transition-colors">
								<Mail className="w-5 h-5 mr-2 text-brand-lavender" /> {contactEmail}
							</li>
							<li className="flex items-center hover:text-brand-coral transition-colors">
								<Phone className="w-5 h-5 mr-2 text-brand-coral" /> {contactPhone}
							</li>
							<li className="flex items-center hover:text-brand-yellow transition-colors">
								<MapPin className="w-5 h-5 mr-2 text-brand-yellow" /> {contactAddress}
							</li>
						</ul>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h3 className="text-lg font-bold bg-gradient-to-r from-brand-yellow to-brand-lime bg-clip-text text-transparent">
							{t("nav.courses")}
						</h3>
						<ul className="mt-4 space-y-2 text-base-content/80">
							<li>
								<a
									href={
										courses.length > 0 && courses[0]
											? `/courses/${courses[0].id}`
											: "#"
									}
									className="hover:text-brand-lavender transition-colors"
								>
									{courses.length > 0 && courses[0]
										? typeof courses[0].title === "object"
											? courses[0].title[i18n.language] ||
												courses[0].title.en ||
												courses[0].title.mn
											: courses[0].title
										: t("courses.design_title")}
								</a>
							</li>
							<li>
								<a
									href={
										courses.length > 1 && courses[1]
											? `/courses/${courses[1].id}`
											: "#"
									}
									className="hover:text-brand-coral transition-colors"
								>
									{courses.length > 1 && courses[1]
										? typeof courses[1].title === "object"
											? courses[1].title[i18n.language] ||
												courses[1].title.en ||
												courses[1].title.mn
											: courses[1].title
										: t("courses.programming_title")}
								</a>
							</li>
							<li>
								<a
									href={
										courses.length > 2 && courses[2]
											? `/courses/${courses[2].id}`
											: "#"
									}
									className="hover:text-brand-yellow transition-colors"
								>
									{courses.length > 2 && courses[2]
										? typeof courses[2].title === "object"
											? courses[2].title[i18n.language] ||
												courses[2].title.en ||
												courses[2].title.mn
											: courses[2].title
										: t("courses.language_title")}
								</a>
							</li>
						</ul>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<h3 className="text-lg font-bold bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
							Follow Us
						</h3>
						<div className="mt-4 flex space-x-4">
							<motion.a
								href="#"
								className="text-base-content hover:text-brand-lavender transition-colors"
								whileHover={{ scale: 1.2, rotate: 5 }}
							>
								<Facebook />
							</motion.a>
							<motion.a
								href="#"
								className="text-base-content hover:text-brand-coral transition-colors"
								whileHover={{ scale: 1.2, rotate: 5 }}
							>
								<Twitter />
							</motion.a>
							<motion.a
								href="#"
								className="text-base-content hover:text-brand-yellow transition-colors"
								whileHover={{ scale: 1.2, rotate: 5 }}
							>
								<Instagram />
							</motion.a>
							<motion.a
								href="#"
								className="text-base-content hover:text-brand-lime transition-colors"
								whileHover={{ scale: 1.2, rotate: 5 }}
							>
								<Linkedin />
							</motion.a>
							<motion.a
								href="#"
								className="text-base-content hover:text-brand-coral transition-colors"
								whileHover={{ scale: 1.2, rotate: 5 }}
							>
								<Youtube />
							</motion.a>
						</div>
					</motion.div>
				</div>
				<motion.div
					className="mt-12 border-t-2 border-brand-lavender/30 pt-8 text-center text-base-content/80"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5 }}
				>
					<p>{t("footer.copyright", { year })}</p>
				</motion.div>
			</div>
		</footer>
	);
};

const App = () => {
	return (
		<div className="bg-base-100 text-base-content">
			<Nav />
			<main>
				<Hero />
				<Features />
				<CategoriesSection />
				<Courses />
				<WhyChooseUsSection />
				<HowItWorks />
				<Teachers />
				<Testimonials />
				<About />
				<Faq />
				<Contact />
			</main>
			<Footer />
		</div>
	);
};

export default App;
