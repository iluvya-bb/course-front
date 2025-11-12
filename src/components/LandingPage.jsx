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

import LanguageSwitcher from "./LanguageSwitcher";

import CategoriesSection from "./CategoriesSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

const Nav = () => {
	const { t } = useTranslation();
	const [logo, setLogo] = useState(null);
	const [siteName, setSiteName] = useState('EduStream');

	useEffect(() => {
		const fetchParams = async () => {
			try {
				const response = await API.getParameters();
				const params = response.data.data || [];

				const logoParam = params.find(p => p.key === 'logo');
				if (logoParam && logoParam.value) {
					setLogo(`${API_URL}/${logoParam.value}`);
				}

				const siteNameParam = params.find(p => p.key === 'site_name');
				if (siteNameParam && siteNameParam.value) {
					setSiteName(siteNameParam.value);
				}
			} catch (error) {
				console.error('Failed to fetch parameters:', error);
			}
		};
		fetchParams();
	}, []);

	return (
		<nav className="bg-base-100/80 backdrop-blur-md border-b-2 border-neutral fixed w-full top-0 z-50">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				<div className="flex items-center">
					<img
						src={logo || "/logo.svg"}
						alt="EduStream logo"
						className="h-8 w-auto"
					/>
					<h1 className="text-2xl font-bold text-base-content ml-2">
						{siteName}
					</h1>
				</div>
				<div className="hidden md:flex items-center space-x-8">
					<a
						href="#features"
						className="text-base-content hover:text-primary transition-colors font-semibold"
					>
						{t("nav.features")}
					</a>
					<a
						href="#categories"
						className="text-base-content hover:text-primary transition-colors font-semibold"
					>
						Categories
					</a>
					<a
						href="#courses"
						className="text-base-content hover:text-primary transition-colors font-semibold"
					>
						{t("nav.courses")}
					</a>
					<a
						href="#teachers"
						className="text-base-content hover:text-primary transition-colors font-semibold"
					>
						{t("nav.teachers")}
					</a>
					<a
						href="#testimonials"
						className="text-base-content hover:text-primary transition-colors font-semibold"
					>
						{t("nav.testimonials")}
					</a>
				</div>
				<div className="flex items-center">
					<LanguageSwitcher />
					<a
						href="/account"
						className="bg-primary text-neutral px-6 py-2 rounded-md font-bold ml-4 hover:bg-primary/80 transition-colors"
					>
						Login
					</a>
				</div>
			</div>
		</nav>
	);
};

import { Button } from "./ui/button";

const Hero = () => {
	const { t } = useTranslation();
	const [heroTitle, setHeroTitle] = useState('');
	const [heroSubtitle, setHeroSubtitle] = useState('');
	const [heroButtonCourses, setHeroButtonCourses] = useState('');
	const [heroButtonTutor, setHeroButtonTutor] = useState('');

	useEffect(() => {
		const fetchParams = async () => {
			try {
				const response = await API.getParameters();
				const params = response.data.data || [];

				const titleParam = params.find(p => p.key === 'hero_title');
				if (titleParam?.value) setHeroTitle(titleParam.value);

				const subtitleParam = params.find(p => p.key === 'hero_subtitle');
				if (subtitleParam?.value) setHeroSubtitle(subtitleParam.value);

				const buttonCoursesParam = params.find(p => p.key === 'hero_button_courses');
				if (buttonCoursesParam?.value) setHeroButtonCourses(buttonCoursesParam.value);

				const buttonTutorParam = params.find(p => p.key === 'hero_button_tutor');
				if (buttonTutorParam?.value) setHeroButtonTutor(buttonTutorParam.value);
			} catch (error) {
				console.error('Failed to fetch parameters:', error);
			}
		};
		fetchParams();
	}, []);

	return (
		<section className="relative bg-base-100 text-base-content min-h-screen flex items-center justify-center overflow-hidden">
			<motion.div
				className="absolute inset-0 z-0 bg-cover bg-center"
				style={{}}
				initial={{ scale: 1 }}
				animate={{ scale: 1.05 }}
				transition={{
					duration: 15,
					ease: "easeInOut",
					repeat: Infinity,
					repeatType: "mirror",
				}}
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/50 to-transparent z-10"></div>
			<div className="container mx-auto px-6 relative z-20">
				<div className="flex flex-col md:flex-row items-center gap-12">
					<motion.div
						className="md:w-1/2 text-center md:text-left"
						variants={fadeIn}
						initial="hidden"
						animate="visible"
					>
						<h1 className="text-5xl md:text-7xl font-black leading-tight text-base-content uppercase">
							{heroTitle || t("hero.title")}
						</h1>
						<p className="mt-4 text-xl text-base-content/80">
							{heroSubtitle || t("hero.subtitle")}
						</p>
						<div className="mt-8 flex justify-center md:justify-start space-x-4">
							<Button>{heroButtonCourses || t("hero.button_courses")}</Button>
							<Button variant="">{heroButtonTutor || t("hero.button_tutor")}</Button>
						</div>
					</motion.div>
					<motion.div
						className="md:w-1/2 mt-8 md:mt-0"
						variants={fadeIn}
						initial="hidden"
						animate="visible"
					>
						<img
							src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
							alt="Online learning illustration"
							className="rounded-md border-4 border-neutral shadow-[8px_8px_0px_#00F6FF]"
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

const Features = () => {
	const { t } = useTranslation();
	return (
		<section id="features" className="py-24 bg-base-100">
			<div className="container mx-auto px-6">
				<motion.div
					className="grid md:grid-cols-2 gap-12"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.div
						className="text-center p-8 border-2 border-neutral rounded-md shadow-[4px_4px_0px_#1A1A1A]"
						variants={fadeIn}
					>
						<div className="bg-primary/10 rounded-full p-4 inline-block">
							<svg
								className="w-8 h-8 text-primary"
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
						</div>
						<h3 className="mt-6 text-2xl font-bold text-base-content">
							{t("features.videos_title")}
						</h3>
						<p className="mt-2 text-base-content">
							{t("features.videos_text")}
						</p>
					</motion.div>
					<motion.div
						className="text-center p-8 border-2 border-neutral rounded-md shadow-[4px_4px_0px_#1A1A1A]"
						variants={fadeIn}
					>
						<div className="bg-accent/10 rounded-full p-4 inline-block">
							<svg
								className="w-8 h-8 text-accent"
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
						</div>
						<h3 className="mt-6 text-2xl font-bold text-base-content">
							{t("features.live_tutoring_title")}
						</h3>
						<p className="mt-2 text-base-content">
							{t("features.live_tutoring_text")}
						</p>
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
		<section id="courses" className="py-24 bg-neutral">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-black text-base-content uppercase">
						{t("courses.title")}
					</h2>
				</motion.div>
				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content">{t("common.loading") || "Loading..."}</p>
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
							const courseTitle = typeof course.title === 'object'
								? course.title[i18n.language] || course.title.en || course.title.mn
								: course.title;
							const courseDesc = typeof course.description === 'object'
								? course.description[i18n.language] || course.description.en || course.description.mn
								: course.description || "";
							const bannerImage = course.bannerImage
								? `${API_URL}/${course.bannerImage}`
								: "https://images.unsplash.com/photo-1524995767962-b1f5b5a8a485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80";

							return (
								<motion.div
									key={course.id}
									className="bg-base-100 rounded-md overflow-hidden border-2 border-neutral shadow-[4px_4px_0px_#00F6FF] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
									variants={fadeIn}
								>
									<img
										src={bannerImage}
										alt={courseTitle}
										className="w-full h-48 object-cover"
									/>
									<div className="p-6">
										<p className="text-sm font-bold text-primary uppercase">
											{course.category?.name?.[i18n.language] || course.category?.name || "Course"}
										</p>
										<h3 className="mt-2 text-xl font-bold text-base-content">
											{courseTitle}
										</h3>
										<p className="mt-2 text-base-content line-clamp-2">{courseDesc}</p>
										<div className="mt-4">
											<a
												href={`/courses/${course.id}`}
												className="text-primary font-bold hover:underline"
											>
												{t("courses.details_button")}
											</a>
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
		<section id="how-it-works" className="py-24 bg-base-100">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-black text-base-content uppercase">
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
					{steps.map((step, index) => (
						<motion.div key={index} className="relative" variants={fadeIn}>
							<div className="flex items-center justify-center">
								<div className="w-20 h-20 rounded-full bg-primary text-neutral flex items-center justify-center text-3xl font-bold border-4 border-neutral shadow-[4px_4px_0px_#1A1A1A]">
									{index + 1}
								</div>
							</div>
							<h3 className="mt-6 text-2xl font-bold text-base-content">
								{step.title}
							</h3>
							<p className="mt-2 text-base-content">{step.desc}</p>
							{index < steps.length - 1 && (
								<div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-neutral -z-10"></div>
							)}
						</motion.div>
					))}
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
		<section id="teachers" className="py-24 bg-neutral">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-black text-base-content uppercase">
						{t("teachers.title")}
					</h2>
				</motion.div>
				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content">{t("common.loading") || "Loading..."}</p>
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
							const teacherName = teacher.name || t("teachers.default_name") || "Teacher";
							const teacherSpecialty = typeof teacher.specialty === 'object'
								? teacher.specialty[i18n.language] || teacher.specialty.en || teacher.specialty.mn
								: teacher.specialty || "";
							const teacherBio = typeof teacher.bio === 'object'
								? teacher.bio[i18n.language] || teacher.bio.en || teacher.bio.mn
								: teacher.bio || "";
							const avatarUrl = teacher.avatar
								? `${API_URL}/${teacher.avatar}`
								: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80";

							return (
								<motion.div key={teacher.id} className="text-center" variants={fadeIn}>
									<img
										src={avatarUrl}
										alt={teacherName}
										className="w-48 h-48 rounded-full mx-auto border-4 border-primary shadow-[8px_8px_0px_#00F6FF] object-cover"
									/>
									<h3 className="mt-6 text-2xl font-bold text-base-content">
										{teacherName}
									</h3>
									<p className="mt-1 text-base-content">{teacherSpecialty}</p>
									<p className="mt-2 text-base-content/80 text-sm">{teacherBio}</p>
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
		<section id="testimonials" className="py-24 bg-base-100">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-black text-base-content uppercase">
						{t("testimonials.title")}
					</h2>
				</motion.div>
				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content">{t("common.loading") || "Loading..."}</p>
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
							const testimonialName = typeof testimonial.name === 'object'
								? testimonial.name[i18n.language] || testimonial.name.en || testimonial.name.mn
								: testimonial.name || t("testimonials.default_name") || "User";
							const testimonialRole = typeof testimonial.role === 'object'
								? testimonial.role[i18n.language] || testimonial.role.en || testimonial.role.mn
								: testimonial.role || "";
							const testimonialQuote = typeof testimonial.quote === 'object'
								? testimonial.quote[i18n.language] || testimonial.quote.en || testimonial.quote.mn
								: testimonial.quote || "";
							const imageUrl = testimonial.imageUrl
								? `${API_URL}/${testimonial.imageUrl}`
								: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80";

							return (
								<motion.div
									key={testimonial.id}
									className="bg-neutral p-8 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]"
									variants={fadeIn}
								>
									<p className="text-base-content italic text-lg">
										&quot;{testimonialQuote}&quot;
									</p>
									<div className="mt-6 flex items-center">
										<img
											src={imageUrl}
											alt={testimonialName}
											className="w-16 h-16 rounded-full border-2 border-primary object-cover"
										/>
										<div className="ml-4">
											<p className="font-bold text-base-content text-xl">
												{testimonialName}
											</p>
											<p className="text-base-content">{testimonialRole}</p>
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
		<section id="about" className="py-24 bg-neutral">
			<div className="container mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center gap-12">
					<motion.div
						className="md:w-1/2"
						variants={fadeIn}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<img
							src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
							alt="Team working"
							className="rounded-md border-4 border-neutral shadow-[8px_8px_0px_#00F6FF]"
						/>
					</motion.div>
					<motion.div
						className="md:w-1/2"
						variants={fadeIn}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<h2 className="text-4xl font-black text-base-content uppercase">
							{t("about.title")}
						</h2>
						<p className="mt-4 text-base-content text-lg">{t("about.text")}</p>
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
		<section id="faq" className="py-24 bg-base-100">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-black text-base-content uppercase">
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
							className="border-b-2 border-neutral py-6"
							variants={fadeIn}
						>
							<details className="group">
								<summary className="flex justify-between items-center font-bold text-xl cursor-pointer text-base-content hover:text-primary transition-colors">
									{faq.q}
									<ChevronRight className="w-6 h-6 transform group-open:rotate-90 transition-transform text-primary" />
								</summary>
								<p className="mt-4 text-base-content/80 text-lg">{faq.a}</p>
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
		<section id="contact" className="py-24 bg-neutral">
			<div className="container mx-auto px-6">
				<motion.div
					className="text-center mb-12"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-black text-base-content uppercase">
						{t("contact.title")}
					</h2>
				</motion.div>
				<motion.div
					className="mt-12 max-w-xl mx-auto"
					variants={fadeIn}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<form className="space-y-6">
						<input
							type="text"
							placeholder={t("contact.name_placeholder")}
							className="w-full px-4 py-3 rounded-md border-2 border-neutral bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
						/>
						<input
							type="email"
							placeholder={t("contact.email_placeholder")}
							className="w-full px-4 py-3 rounded-md border-2 border-neutral bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
						/>
						<textarea
							placeholder={t("contact.message_placeholder")}
							rows="4"
							className="w-full px-4 py-3 rounded-md border-2 border-neutral bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
						></textarea>
						<button
							type="submit"
							className="w-full bg-primary text-neutral px-6 py-3 rounded-md font-bold text-lg shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
						>
							{t("contact.send_button")}
						</button>
					</form>
				</motion.div>
			</div>
		</section>
	);
};

const Footer = () => {
	const { t, i18n } = useTranslation();
	const year = new Date().getFullYear();
	const [siteName, setSiteName] = useState('EduStream');
	const [footerText, setFooterText] = useState('');
	const [contactEmail, setContactEmail] = useState('info@edustream.mn');
	const [contactPhone, setContactPhone] = useState('+976 7777 8888');
	const [contactAddress, setContactAddress] = useState('Ulaanbaatar, Mongolia');
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch parameters
				console.log('Footer: Fetching parameters...');
				const response = await API.getParameters();
				console.log('Footer: Parameters response:', response.data);
				const params = response.data.data || [];
				console.log('Footer: Parameters data:', params);

				const siteNameParam = params.find(p => p.key === 'site_name');
				console.log('Footer: site_name param:', siteNameParam);
				if (siteNameParam?.value) setSiteName(siteNameParam.value);

				const footerTextParam = params.find(p => p.key === 'footer_text');
				console.log('Footer: footer_text param:', footerTextParam);
				if (footerTextParam?.value) setFooterText(footerTextParam.value);

				const emailParam = params.find(p => p.key === 'contact_email');
				console.log('Footer: contact_email param:', emailParam);
				if (emailParam?.value) setContactEmail(emailParam.value);

				const phoneParam = params.find(p => p.key === 'contact_phone');
				console.log('Footer: contact_phone param:', phoneParam);
				if (phoneParam?.value) setContactPhone(phoneParam.value);

				const addressParam = params.find(p => p.key === 'contact_address');
				console.log('Footer: contact_address param:', addressParam);
				if (addressParam?.value) setContactAddress(addressParam.value);

				// Fetch courses for footer
				const coursesResponse = await API.getAllCourses();
				const allCourses = coursesResponse.data.data || [];
				// Get first 3 courses for footer
				setCourses(allCourses.slice(0, 3));
			} catch (error) {
				console.error('Footer: Failed to fetch data:', error);
			}
		};
		fetchData();
	}, []);
	return (
		<footer className="bg-neutral text-base-content">
			<div className="container mx-auto px-6 py-12">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-bold text-base-content">{siteName}</h3>
						<p className="mt-4 text-base-content">{footerText || t("hero.subtitle")}</p>
					</div>
					<div>
						<h3 className="text-lg font-bold text-base-content">
							{t("nav.contact")}
						</h3>
						<ul className="mt-4 space-y-2 text-base-content">
							<li className="flex items-center">
								<Mail className="w-5 h-5 mr-2" /> {contactEmail}
							</li>
							<li className="flex items-center">
								<Phone className="w-5 h-5 mr-2" /> {contactPhone}
							</li>
							<li className="flex items-center">
								<MapPin className="w-5 h-5 mr-2" /> {contactAddress}
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-bold text-base-content">
							{t("nav.courses")}
						</h3>
						<ul className="mt-4 space-y-2 text-base-content">
							<li>
								<a href={courses.length > 0 && courses[0] ? `/courses/${courses[0].id}` : "#"} className="hover:text-primary">
									{courses.length > 0 && courses[0] ? (
									typeof courses[0].title === 'object'
										? courses[0].title[i18n.language] || courses[0].title.en || courses[0].title.mn
										: courses[0].title
								) : t("courses.design_title")}
								</a>
							</li>
							<li>
								<a href={courses.length > 1 && courses[1] ? `/courses/${courses[1].id}` : "#"} className="hover:text-primary">
									{courses.length > 1 && courses[1] ? (
									typeof courses[1].title === 'object'
										? courses[1].title[i18n.language] || courses[1].title.en || courses[1].title.mn
										: courses[1].title
								) : t("courses.programming_title")}
								</a>
							</li>
							<li>
								<a href={courses.length > 2 && courses[2] ? `/courses/${courses[2].id}` : "#"} className="hover:text-primary">
									{courses.length > 2 && courses[2] ? (
									typeof courses[2].title === 'object'
										? courses[2].title[i18n.language] || courses[2].title.en || courses[2].title.mn
										: courses[2].title
								) : t("courses.language_title")}
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-bold text-base-content">Follow Us</h3>
						<div className="mt-4 flex space-x-4">
							<a href="#" className="text-base-content hover:text-primary">
								<Facebook />
							</a>
							<a href="#" className="text-base-content hover:text-primary">
								<Twitter />
							</a>
							<a href="#" className="text-base-content hover:text-primary">
								<Instagram />
							</a>
							<a href="#" className="text-base-content hover:text-primary">
								<Linkedin />
							</a>
							<a href="#" className="text-base-content hover:text-primary">
								<Youtube />
							</a>
						</div>
					</div>
				</div>
				<div className="mt-12 border-t-2 border-neutral pt-8 text-center text-base-content">
					<p>{t("footer.copyright", { year })}</p>
				</div>
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
