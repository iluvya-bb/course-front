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
	return (
		<nav className="bg-base-100/80 backdrop-blur-md border-b-2 border-neutral fixed w-full top-0 z-50">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				<div className="flex items-center">
					<img src="/logo.svg" alt="EduStream logo" className="h-8 w-auto" />
					<h1 className="text-2xl font-bold text-base-content ml-2">
						EduStream
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
							{t("hero.title")}
						</h1>
						<p className="mt-4 text-xl text-base-content/80">
							{t("hero.subtitle")}
						</p>
						<div className="mt-8 flex justify-center md:justify-start space-x-4">
							<Button>{t("hero.button_courses")}</Button>
							<Button variant="">{t("hero.button_tutor")}</Button>
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
	const { t } = useTranslation();
	const courses = [
		{
			category: t("courses.design_category"),
			title: t("courses.design_title"),
			desc: t("courses.design_desc"),
			img: "https://images.unsplash.com/photo-1524995767962-b1f5b5a8a485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
		},
		{
			category: t("courses.programming_category"),
			title: t("courses.programming_title"),
			desc: t("courses.programming_desc"),
			img: "https://images.unsplash.com/photo-1524995767962-b1f5b5a8a485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
		},
		{
			category: t("courses.language_category"),
			title: t("courses.language_title"),
			desc: t("courses.language_desc"),
			img: "https://images.unsplash.com/photo-1524995767962-b1f5b5a8a485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
		},
	];

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
				<motion.div
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{courses.map((course, index) => (
						<motion.div
							key={index}
							className="bg-base-100 rounded-md overflow-hidden border-2 border-neutral shadow-[4px_4px_0px_#00F6FF] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
							variants={fadeIn}
						>
							<img
								src={course.img}
								alt={course.title}
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-sm font-bold text-primary uppercase">
									{course.category}
								</p>
								<h3 className="mt-2 text-xl font-bold text-base-content">
									{course.title}
								</h3>
								<p className="mt-2 text-base-content">{course.desc}</p>
								<div className="mt-4">
									<a
										href="#"
										className="text-primary font-bold hover:underline"
									>
										{t("courses.details_button")}
									</a>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
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
	const { t } = useTranslation();
	const teachers = [
		{
			name: t("teachers.teacher1_name"),
			title: t("teachers.teacher1_title"),
			img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
			bio: "John is a passionate web developer with over 10 years of experience in building modern, responsive websites.",
		},
		{
			name: t("teachers.teacher2_name"),
			title: t("teachers.teacher2_title"),
			img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
			bio: "Jane is a graphic designer who loves to create beautiful and intuitive user interfaces.",
		},
		{
			name: t("teachers.teacher3_name"),
			title: t("teachers.teacher3_title"),
			img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
			bio: "Mike is a language expert who can help you master any language with his innovative teaching methods.",
		},
	];

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
				<motion.div
					className="grid md:grid-cols-3 gap-8"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{teachers.map((teacher, index) => (
						<motion.div key={index} className="text-center" variants={fadeIn}>
							<img
								src={teacher.img}
								alt={teacher.name}
								className="w-48 h-48 rounded-full mx-auto border-4 border-primary shadow-[8px_8px_0px_#00F6FF]"
							/>
							<h3 className="mt-6 text-2xl font-bold text-base-content">
								{teacher.name}
							</h3>
							<p className="mt-1 text-base-content">{teacher.title}</p>
							<p className="mt-2 text-base-content/80 text-sm">{teacher.bio}</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const Testimonials = () => {
	const { t } = useTranslation();
	const testimonials = [
		{
			name: t("testimonials.student_name"),
			role: t("testimonials.student_role"),
			quote:
				"The interactive lessons and hands-on projects helped me grasp complex concepts much faster. I feel much more confident in my coding skills now.",
			img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
		},
		{
			name: t("testimonials.parent_name"),
			role: t("testimonials.parent_role"),
			quote:
				"As a parent, I'm thrilled with the quality of education my child is receiving. The instructors are knowledgeable and the platform is easy to use.",
			img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
		},
		{
			name: t("testimonials.teacher_name"),
			role: t("testimonials.teacher_role"),
			quote:
				"Teaching on this platform has been a rewarding experience. I'm able to connect with students from all over the world and share my passion for design.",
			img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
		},
	];

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
				<motion.div
					className="grid md:grid-cols-3 gap-8"
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							className="bg-neutral p-8 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]"
							variants={fadeIn}
						>
							<p className="text-base-content italic text-lg">
								&quot;{testimonial.quote}&quot;
							</p>
							<div className="mt-6 flex items-center">
								<img
									src={testimonial.img}
									alt={testimonial.name}
									className="w-16 h-16 rounded-full border-2 border-primary"
								/>
								<div className="ml-4">
									<p className="font-bold text-base-content text-xl">
										{testimonial.name}
									</p>
									<p className="text-base-content">{testimonial.role}</p>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
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
	const { t } = useTranslation();
	const year = new Date().getFullYear();
	return (
		<footer className="bg-neutral text-base-content">
			<div className="container mx-auto px-6 py-12">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-bold text-base-content">EduStream</h3>
						<p className="mt-4 text-base-content">{t("hero.subtitle")}</p>
					</div>
					<div>
						<h3 className="text-lg font-bold text-base-content">
							{t("nav.contact")}
						</h3>
						<ul className="mt-4 space-y-2 text-base-content">
							<li className="flex items-center">
								<Mail className="w-5 h-5 mr-2" /> info@edustream.mn
							</li>
							<li className="flex items-center">
								<Phone className="w-5 h-5 mr-2" /> +976 7777 8888
							</li>
							<li className="flex items-center">
								<MapPin className="w-5 h-5 mr-2" /> Ulaanbaatar, Mongolia
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-bold text-base-content">
							{t("nav.courses")}
						</h3>
						<ul className="mt-4 space-y-2 text-base-content">
							<li>
								<a href="#" className="hover:text-primary">
									{t("courses.design_title")}
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary">
									{t("courses.programming_title")}
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary">
									{t("courses.language_title")}
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
