import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API, { API_URL } from "../services/api";

const ModernHero = () => {
	const { t } = useTranslation();
	const [logo, setLogo] = useState(null);
	const [siteName, setSiteName] = useState("EduClass");
	const [heroTitle, setHeroTitle] = useState("");
	const [heroSubtitle, setHeroSubtitle] = useState("");
	const [heroButtonCourses, setHeroButtonCourses] = useState("");
	const [heroButtonTutor, setHeroButtonTutor] = useState("");

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 200 });
	const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 200 });

	useEffect(() => {
		const fetchParams = async () => {
			try {
				const response = await API.getParameters();
				const params = response.data.data || [];

				const logoParam = params.find((p) => p.key === "logo");
				if (logoParam?.value) setLogo(`${API_URL}/${logoParam.value}`);

				const siteNameParam = params.find((p) => p.key === "site_name");
				if (siteNameParam?.value) setSiteName(siteNameParam.value);

				const titleParam = params.find((p) => p.key === "hero_title");
				if (titleParam?.value) setHeroTitle(titleParam.value);

				const subtitleParam = params.find((p) => p.key === "hero_subtitle");
				if (subtitleParam?.value) setHeroSubtitle(subtitleParam.value);

				const buttonCoursesParam = params.find((p) => p.key === "hero_button_courses");
				if (buttonCoursesParam?.value) setHeroButtonCourses(buttonCoursesParam.value);

				const buttonTutorParam = params.find((p) => p.key === "hero_button_tutor");
				if (buttonTutorParam?.value) setHeroButtonTutor(buttonTutorParam.value);
			} catch (error) {
				console.error("Failed to fetch parameters:", error);
			}
		};
		fetchParams();
	}, []);

	useEffect(() => {
		const handleMouseMove = (e) => {
			const { clientX, clientY } = e;
			const { innerWidth, innerHeight } = window;
			mouseX.set((clientX - innerWidth / 2) / 25);
			mouseY.set((clientY - innerHeight / 2) / 25);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	// Split text into characters for animation
	const title = heroTitle || t("hero.title");
	const subtitle = heroSubtitle || t("hero.subtitle");
	const titleChars = title.split("");
	const words = title.split(" ");

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-base-100 via-brand-cream/10 to-brand-lavender/5">
			{/* Animated Mesh Background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Large morphing blobs */}
				<motion.div
					className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full opacity-20"
					style={{
						background: "radial-gradient(circle, #7776bc 0%, transparent 70%)",
						filter: "blur(80px)",
						x: smoothMouseX,
						y: smoothMouseY,
					}}
					animate={{
						scale: [1, 1.2, 1],
						x: [0, 100, 0],
						y: [0, -50, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute top-1/2 right-0 w-[700px] h-[700px] rounded-full opacity-20"
					style={{
						background: "radial-gradient(circle, #ff764d 0%, transparent 70%)",
						filter: "blur(80px)",
						x: useTransform(smoothMouseX, (x) => -x),
						y: useTransform(smoothMouseY, (y) => -y),
					}}
					animate={{
						scale: [1, 1.3, 1],
						x: [0, -100, 0],
						y: [0, 100, 0],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-0 left-1/2 w-[600px] h-[600px] rounded-full opacity-20"
					style={{
						background: "radial-gradient(circle, #ddec51 0%, transparent 70%)",
						filter: "blur(80px)",
					}}
					animate={{
						scale: [1, 1.4, 1],
						x: [0, -80, 0],
						y: [0, -80, 0],
					}}
					transition={{
						duration: 22,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Grid Pattern */}
				<div
					className="absolute inset-0 opacity-[0.15]"
					style={{
						backgroundImage: `
							linear-gradient(to right, #7776bc 1px, transparent 1px),
							linear-gradient(to bottom, #7776bc 1px, transparent 1px)
						`,
						backgroundSize: "60px 60px",
					}}
				/>

				{/* Floating particles */}
				{[...Array(30)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-brand-lavender/30 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -100, 0],
							opacity: [0, 0.5, 0],
							scale: [0, 1.5, 0],
						}}
						transition={{
							duration: Math.random() * 10 + 10,
							repeat: Infinity,
							delay: Math.random() * 5,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-6 relative z-10 py-20">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						{/* Logo Badge */}
						{logo && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="inline-block"
							>
								<div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-brand-lavender/20">
									<img src={logo} alt={siteName} className="h-8 w-auto" />
									<span className="font-bold text-brand-lavender">{siteName}</span>
								</div>
							</motion.div>
						)}

						{/* Animated Title */}
						<div className="overflow-hidden">
							<motion.h1
								className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								{words.map((word, wordIndex) => (
									<span key={wordIndex} className="inline-block mr-4">
										{word.split("").map((char, charIndex) => (
											<motion.span
												key={charIndex}
												className="inline-block"
												initial={{
													opacity: 0,
													y: 50,
													rotateX: -90,
													filter: "blur(10px)"
												}}
												animate={{
													opacity: 1,
													y: 0,
													rotateX: 0,
													filter: "blur(0px)"
												}}
												transition={{
													duration: 0.3,
													delay: (wordIndex * word.length + charIndex) * 0.015,
													ease: [0.33, 1, 0.68, 1],
												}}
												style={{
													display: "inline-block",
													transformStyle: "preserve-3d",
												}}
											>
												<span
													className="inline-block text-transparent"
													style={{
														backgroundImage: "linear-gradient(110deg, #7776bc 0%, #9b87d4 25%, #ff764d 50%, #9b87d4 75%, #7776bc 100%)",
														backgroundSize: "200% 100%",
														backgroundPosition: "50% 0%",
														WebkitBackgroundClip: "text",
														backgroundClip: "text",
													}}
												>
													{char}
												</span>
											</motion.span>
										))}
									</span>
								))}
							</motion.h1>
						</div>

						{/* Subtitle */}
						<motion.div className="max-w-xl">
							<motion.p
								className="text-xl md:text-2xl text-base-content/70 leading-relaxed font-medium"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.6 }}
							>
								{subtitle.split("").map((char, i) => (
									<motion.span
										key={i}
										className="inline-block"
										initial={{
											opacity: 0,
											y: 20,
											filter: "blur(8px)"
										}}
										animate={{
											opacity: char === " " ? 1 : [0, 1],
											y: 0,
											filter: "blur(0px)"
										}}
										transition={{
											duration: 0.3,
											delay: 0.7 + i * 0.015,
											ease: "easeOut",
										}}
										style={{
											marginRight: char === " " ? "0.25rem" : "0",
										}}
									>
										{char === " " ? "\u00A0" : char}
									</motion.span>
								))}
							</motion.p>
						</motion.div>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.8, delay: 1, ease: [0.33, 1, 0.68, 1] }}
							className="flex flex-wrap gap-4"
						>
							<motion.a
								href="/account"
								className="group relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden shadow-lg"
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.98 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
							>
								<motion.div
									className="absolute inset-0"
									style={{
										backgroundImage: "linear-gradient(135deg, #7776bc, #9b87d4, #ff764d)",
										backgroundSize: "200% 200%",
									}}
									animate={{
										backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
									}}
									transition={{
										duration: 8,
										repeat: Infinity,
										ease: "easeInOut"
									}}
								/>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-brand-coral via-brand-yellow to-brand-coral"
									style={{
										backgroundSize: "200% 100%",
									}}
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 0.8 }}
									transition={{ duration: 0.5, ease: "easeOut" }}
									animate={{
										backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
									}}
								/>
								<motion.div
									className="absolute inset-0"
									initial={{ boxShadow: "0 10px 30px rgba(119, 118, 188, 0.3)" }}
									whileHover={{ boxShadow: "0 20px 50px rgba(255, 118, 77, 0.5)" }}
									transition={{ duration: 0.3 }}
								/>
								<span className="relative z-10 text-white flex items-center gap-2">
									{heroButtonCourses || t("hero.button_courses")}
									<motion.svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										initial={{ x: 0 }}
										whileHover={{ x: 5 }}
										transition={{ duration: 0.2 }}
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</motion.svg>
								</span>
							</motion.a>

							<motion.a
								href="/account"
								className="group relative px-8 py-4 rounded-full font-bold text-lg border-2 border-brand-lavender text-brand-lavender hover:text-white overflow-hidden shadow-lg"
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.98 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
							>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-lavender"
									style={{
										backgroundSize: "200% 100%",
									}}
									initial={{ x: "-100%", opacity: 0.95 }}
									whileHover={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
									animate={{
										backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
									}}
								/>
								<motion.div
									className="absolute inset-0"
									initial={{ boxShadow: "0 10px 30px rgba(119, 118, 188, 0.2)" }}
									whileHover={{ boxShadow: "0 20px 50px rgba(119, 118, 188, 0.4)" }}
									transition={{ duration: 0.3 }}
								/>
								<span className="relative z-10">{heroButtonTutor || t("hero.button_tutor")}</span>
							</motion.a>
						</motion.div>

						{/* Stats */}
						<motion.div
							initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.8, delay: 1.3, ease: [0.33, 1, 0.68, 1] }}
							className="flex gap-8 pt-8 border-t border-brand-lavender/20"
						>
							{[
								{ value: "1000+", label: "Students" },
								{ value: "50+", label: "Courses" },
								{ value: "20+", label: "Instructors" },
							].map((stat, i) => (
								<motion.div
									key={i}
									initial={{ scale: 0, opacity: 0, rotateY: -90 }}
									animate={{ scale: 1, opacity: 1, rotateY: 0 }}
									transition={{
										duration: 0.6,
										delay: 1.5 + i * 0.15,
										ease: [0.33, 1, 0.68, 1],
										type: "spring",
										stiffness: 200,
										damping: 20
									}}
									whileHover={{ scale: 1.1, y: -5 }}
									className="cursor-default"
								>
									<div
										className="font-black text-3xl text-transparent"
										style={{
											backgroundImage: "linear-gradient(110deg, #7776bc 0%, #9b87d4 25%, #ff764d 50%, #9b87d4 75%, #7776bc 100%)",
											backgroundSize: "200% 100%",
											backgroundPosition: "50% 0%",
											WebkitBackgroundClip: "text",
											backgroundClip: "text",
										}}
									>
										{stat.value}
									</div>
									<div className="text-sm text-base-content/60 font-medium">{stat.label}</div>
								</motion.div>
							))}
						</motion.div>
					</div>

					{/* Right - 3D Visual */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						className="relative h-[600px]"
						style={{ perspective: "1200px" }}
					>
						{/* Main floating card */}
						<motion.div
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
							style={{
								rotateX: useTransform(smoothMouseY, [-50, 50], [10, -10]),
								rotateY: useTransform(smoothMouseX, [-50, 50], [-10, 10]),
							}}
						>
							{/* Center glass card */}
							<motion.div
								className="relative w-full h-full rounded-3xl overflow-hidden"
								style={{
									background: "rgba(255, 255, 255, 0.1)",
									backdropFilter: "blur(20px)",
									border: "1px solid rgba(255, 255, 255, 0.2)",
									boxShadow: "0 25px 50px rgba(119, 118, 188, 0.3)",
								}}
								animate={{
									rotateZ: [0, 5, 0, -5, 0],
								}}
								transition={{
									duration: 10,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								{/* Gradient overlay */}
								<motion.div
									className="absolute inset-0 opacity-50"
									style={{
										background: "linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3))",
									}}
									animate={{
										background: [
											"linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3))",
											"linear-gradient(135deg, rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3), rgba(119, 118, 188, 0.3))",
											"linear-gradient(135deg, rgba(221, 236, 81, 0.3), rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3))",
											"linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3), rgba(221, 236, 81, 0.3))",
										],
									}}
									transition={{
										duration: 8,
										repeat: Infinity,
										ease: "linear",
									}}
								/>

								{/* Inner content */}
								<div className="relative z-10 p-8 h-full flex flex-col justify-between">
									{/* Decorative elements */}
									<div className="space-y-3">
										{[...Array(4)].map((_, i) => (
											<motion.div
												key={i}
												className="h-2 bg-white/20 rounded-full"
												style={{ width: `${100 - i * 20}%` }}
												initial={{ scaleX: 0 }}
												animate={{ scaleX: 1 }}
												transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
											/>
										))}
									</div>

									{/* Center icon */}
									<motion.div
										className="mx-auto w-32 h-32 rounded-full flex items-center justify-center"
										style={{
											background: "linear-gradient(135deg, rgba(119, 118, 188, 0.5), rgba(255, 118, 77, 0.5))",
											backdropFilter: "blur(10px)",
										}}
										animate={{
											scale: [1, 1.1, 1],
											rotate: [0, 360],
										}}
										transition={{
											scale: { duration: 3, repeat: Infinity },
											rotate: { duration: 20, repeat: Infinity, ease: "linear" },
										}}
									>
										<svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</motion.div>

									<div className="space-y-3">
										{[...Array(3)].map((_, i) => (
											<motion.div
												key={i}
												className="h-2 bg-white/20 rounded-full"
												style={{ width: `${60 + i * 15}%`, marginLeft: "auto" }}
												initial={{ scaleX: 0 }}
												animate={{ scaleX: 1 }}
												transition={{ duration: 0.8, delay: 1.4 + i * 0.1 }}
											/>
										))}
									</div>
								</div>
							</motion.div>

							{/* Orbiting elements */}
							{[...Array(3)].map((_, i) => {
								const angle = (i * 360) / 3;
								return (
									<motion.div
										key={i}
										className="absolute w-20 h-20 rounded-2xl"
										style={{
											background: `linear-gradient(135deg, rgba(${119 + i * 40}, ${118 + i * 30}, ${188 - i * 50}, 0.4), rgba(${255 - i * 40}, ${118 + i * 30}, ${77 + i * 50}, 0.4))`,
											backdropFilter: "blur(10px)",
											border: "1px solid rgba(255, 255, 255, 0.2)",
											boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
										}}
										animate={{
											rotate: [angle, angle + 360],
											x: [
												Math.cos((angle * Math.PI) / 180) * 200,
												Math.cos(((angle + 360) * Math.PI) / 180) * 200,
											],
											y: [
												Math.sin((angle * Math.PI) / 180) * 200,
												Math.sin(((angle + 360) * Math.PI) / 180) * 200,
											],
										}}
										transition={{
											duration: 15 + i * 5,
											repeat: Infinity,
											ease: "linear",
										}}
									>
										<motion.div
											className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
											animate={{ rotate: [0, -360] }}
											transition={{
												duration: 15 + i * 5,
												repeat: Infinity,
												ease: "linear",
											}}
										>
											{["📚", "🎓", "✨"][i]}
										</motion.div>
									</motion.div>
								);
							})}
						</motion.div>

						{/* Floating accents */}
						<motion.div
							className="absolute top-0 right-0 w-24 h-24 rounded-full"
							style={{
								background: "radial-gradient(circle, rgba(221, 236, 81, 0.4), transparent)",
								filter: "blur(20px)",
							}}
							animate={{
								scale: [1, 1.5, 1],
								x: [0, 20, 0],
								y: [0, -20, 0],
							}}
							transition={{
								duration: 6,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>

						<motion.div
							className="absolute bottom-0 left-0 w-32 h-32 rounded-full"
							style={{
								background: "radial-gradient(circle, rgba(255, 118, 77, 0.4), transparent)",
								filter: "blur(20px)",
							}}
							animate={{
								scale: [1, 1.5, 1],
								x: [0, -20, 0],
								y: [0, 20, 0],
							}}
							transition={{
								duration: 7,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					</motion.div>
				</div>
			</div>

			{/* Bottom gradient fade */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-100 to-transparent pointer-events-none" />
		</section>
	);
};

export default ModernHero;
