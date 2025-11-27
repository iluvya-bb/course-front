import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import {
	FaCheckCircle,
	FaSpinner,
	FaInfoCircle,
	FaBook,
	FaTag,
	FaCheck,
	FaBars,
	FaTimes,
	FaPlay,
	FaGraduationCap,
	FaClock,
	FaStar,
	FaTrophy,
	FaLock,
	FaUnlock,
} from "react-icons/fa";

import API, { API_URL } from "../services/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SubscriptionModal from "./dashboard/SubscriptionModal";

const CoursePage = () => {
	// --- Core Hooks ---
	const { t } = useTranslation();
	const { courseId } = useParams();
	const videoRef = useRef(null);
	const hlsRef = useRef(null);

	// --- Component State ---
	const [course, setCourse] = useState(null);
	const [selectedLesson, setSelectedLesson] = useState(null);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Video player state
	const [videoType, setVideoType] = useState(null);
	const [videoSrc, setVideoSrc] = useState("");
	const [qualityLevels, setQualityLevels] = useState([]);
	const [currentQuality, setCurrentQuality] = useState(-1);

	// Subscription modal state
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
	const [subscriptionLoading, setSubscriptionLoading] = useState(false);
	const [subscriptionError, setSubscriptionError] = useState(null);

	// Promo code state
	const [promoCodeInput, setPromoCodeInput] = useState("");
	const [promoCodeValidation, setPromoCodeValidation] = useState({
		status: "idle",
		message: "",
		discountedPrice: null,
		codeApplied: null,
	});

	// Lesson interaction state
	const [completingLesson, setCompletingLesson] = useState(false);
	const [completionSuccess, setCompletionSuccess] = useState(false);

	// Exercise state
	const [exerciseAnswers, setExerciseAnswers] = useState({});
	const [exerciseSubmissions, setExerciseSubmissions] = useState({});
	const [submittingExercise, setSubmittingExercise] = useState(null);

	// Tests state
	const [tests, setTests] = useState([]);
	const [loadingTests, setLoadingTests] = useState(false);
	const [showTestUnlocked, setShowTestUnlocked] = useState(false);
	const [previousProgress, setPreviousProgress] = useState(0);

	// Mobile sidebar state
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	// --- Effects ---

	/**
	 * Effect: Handle mobile sidebar and body scroll
	 */
	useEffect(() => {
		if (isMobileSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		const handleResize = () => {
			if (window.innerWidth >= 768 && isMobileSidebarOpen) {
				setIsMobileSidebarOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			document.body.style.overflow = "unset";
			window.removeEventListener("resize", handleResize);
		};
	}, [isMobileSidebarOpen]);

	/**
	 * Effect: Fetch main course data
	 */
	useEffect(() => {
		const fetchCourseData = async () => {
			if (!courseId) return;

			setLoading(true);
			setError(null);
			setIsSubscribed(false);
			setCourse(null);
			setSelectedLesson(null);
			setPromoCodeInput("");
			setPromoCodeValidation({
				status: "idle",
				message: "",
				discountedPrice: null,
				codeApplied: null,
			});

			try {
				const response = await API.getCourse(courseId);
				const fetchedCourse = response.data.data;
				setCourse(fetchedCourse);

				const currentUserSubscriptions = await API.getMySubscriptions();
				const subscriptions = currentUserSubscriptions.data.data || [];
				const isUserSubscribed = subscriptions.some(
					(sub) => sub.courseId === fetchedCourse.id,
				);
				setIsSubscribed(isUserSubscribed);

				if (isUserSubscribed && fetchedCourse.lessons?.length > 0) {
					const firstLesson = fetchedCourse.lessons[0];
					setSelectedLesson(firstLesson);
				}
			} catch (err) {
				console.error("Failed to fetch course:", err);
				setError(
					err.response?.data?.error || err.message || "Failed to load course",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCourseData();
	}, [courseId]);

	/**
	 * Effect: Fetch tests for the course
	 */
	useEffect(() => {
		const fetchTests = async () => {
			if (!courseId || !isSubscribed) {
				setTests([]);
				return;
			}

			setLoadingTests(true);
			try {
				const response = await API.getTests({ courseId });
				setTests(response.data.data || []);
			} catch (err) {
				console.error("Failed to fetch tests:", err);
			} finally {
				setLoadingTests(false);
			}
		};

		fetchTests();
	}, [courseId, isSubscribed]);

	/**
	 * Effect: Update video player when selected lesson changes
	 */
	useEffect(() => {
		if (!selectedLesson || !selectedLesson.videoPath || !videoRef.current) {
			setVideoSrc("");
			setVideoType(null);
			setQualityLevels([]);
			setCurrentQuality(-1);
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
			return;
		}

		const videoElement = videoRef.current;

		const fetchVideoInfo = async () => {
			try {
				const response = await API.streamVideo(selectedLesson.id);
				const streamData = response.data.data;
				console.log("Stream type:", streamData.type);
				console.log("Stream URL:", streamData.url);

				if (streamData.type === "hls") {
					setVideoType("hls");
					// Use CloudFront URL directly (already a full URL from backend)
					const videoUrl = streamData.url;

					if (Hls.isSupported()) {
						if (hlsRef.current) {
							hlsRef.current.destroy();
						}

						const hls = new Hls({
							xhrSetup: (xhr) => {
								xhr.withCredentials = true;
							},
						});

						hls.loadSource(videoUrl);
						hls.attachMedia(videoElement);

						hls.on(Hls.Events.MANIFEST_PARSED, () => {
							const levels = hls.levels.map((level, index) => ({
								index: index,
								name: `${level.height}p`,
								height: level.height,
								width: level.width,
								bitrate: level.bitrate,
							}));
							setQualityLevels(levels);
							setCurrentQuality(-1);
						});

						hls.on(Hls.Events.ERROR, (event, data) => {
							if (data.fatal) {
								console.error("HLS Error:", data);
							}
						});

						hlsRef.current = hls;
					} else if (
						videoElement.canPlayType("application/vnd.apple.mpegurl")
					) {
						videoElement.src = videoUrl;
						setVideoType("hls");
					} else {
						console.error("HLS not supported");
					}
				} else {
					setVideoType("regular");
					// Use CloudFront URL directly (already a full URL from backend)
					setVideoSrc(streamData.url);
					setQualityLevels([]);
					setCurrentQuality(-1);

					if (hlsRef.current) {
						hlsRef.current.destroy();
						hlsRef.current = null;
					}
				}
			} catch (error) {
				console.error("Failed to fetch video info:", error);
				setVideoType(null);
				setVideoSrc("");
			}
		};

		fetchVideoInfo();

		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
		};
	}, [selectedLesson?.id, selectedLesson?.videoPath]); // Re-run if lesson or its video path changes

	// --- Handlers ---

	const handleQualityChange = useCallback((qualityIndex) => {
		if (!hlsRef.current) return;
		if (qualityIndex === -1) {
			hlsRef.current.currentLevel = -1;
		} else {
			hlsRef.current.currentLevel = qualityIndex;
		}
		setCurrentQuality(qualityIndex);
	}, []);

	const handleSelectLesson = useCallback((lesson) => {
		setSelectedLesson(lesson);
		setCompletionSuccess(false);
		setExerciseAnswers({});
		setExerciseSubmissions({});
		setIsMobileSidebarOpen(false);
	}, []);

	const handleExerciseAnswerChange = useCallback((exerciseId, value) => {
		setExerciseAnswers((prev) => ({
			...prev,
			[exerciseId]: value,
		}));
	}, []);

	const handleSubmitExercise = useCallback(
		async (exerciseId) => {
			const answer = exerciseAnswers[exerciseId];
			if (!answer?.trim()) return;

			setSubmittingExercise(exerciseId);
			try {
				const response = await API.submitExercise(exerciseId, answer);
				const submissionResult = response.data.data;
				setExerciseSubmissions((prev) => ({
					...prev,
					[exerciseId]: submissionResult,
				}));
			} catch (err) {
				console.error("Failed to submit exercise:", err);
			} finally {
				setSubmittingExercise(null);
			}
		},
		[exerciseAnswers],
	);

	const handleMarkAsComplete = useCallback(async () => {
		if (!selectedLesson || completingLesson) return;

		setCompletingLesson(true);
		try {
			await API.markLessonAsComplete(selectedLesson.id);
			setSelectedLesson((prevLesson) => ({
				...prevLesson,
				completions: [{ id: "new-completion" }],
			}));

			setCourse((prevCourse) => {
				const updatedLessons = prevCourse.lessons.map((l) =>
					l.id === selectedLesson.id
						? { ...l, completions: [{ id: "new-completion" }] }
						: l,
				);

				// Recalculate progress
				const totalLessons = updatedLessons.length;
				const completedLessons = updatedLessons.filter(
					(lesson) => lesson.completions && lesson.completions.length > 0
				).length;
				const newProgress = totalLessons > 0
					? Math.round((completedLessons / totalLessons) * 100)
					: 0;

				// Check if we just reached 100%
				const oldProgress = prevCourse.progress || 0;
				if (oldProgress < 100 && newProgress === 100) {
					// Trigger test unlock animation
					setTimeout(() => {
						setShowTestUnlocked(true);
						setTimeout(() => setShowTestUnlocked(false), 5000);
					}, 1000);
				}

				return {
					...prevCourse,
					lessons: updatedLessons,
					progress: newProgress
				};
			});

			setCompletionSuccess(true);
			setTimeout(() => setCompletionSuccess(false), 3000);
		} catch (err) {
			console.error("Failed to mark lesson as complete:", err);
		} finally {
			setCompletingLesson(false);
		}
	}, [selectedLesson, completingLesson]);

	const handleOpenSubscriptionModal = useCallback(() => {
		setIsSubscriptionModalOpen(true);
	}, []);

	const handleCancelSubscription = useCallback(() => {
		setIsSubscriptionModalOpen(false);
		setPromoCodeInput("");
		setPromoCodeValidation({
			status: "idle",
			message: "",
			discountedPrice: null,
			codeApplied: null,
		});
	}, []);

	const handleConfirmSubscription = useCallback(
		async (courseId) => {
			setSubscriptionLoading(true);
			setSubscriptionError(null);
			try {
				const requestBody = {};

				// Only add promoCode to body if validation is successful
				if (promoCodeValidation.status === "valid" && promoCodeValidation.codeApplied) {
					requestBody.promoCode = promoCodeValidation.codeApplied;
				}

				await API.createSubscription(courseId, requestBody);
				setIsSubscriptionModalOpen(false);
				setIsSubscribed(true);

				const responseCourse = await API.getCourse(courseId);
				const updatedCourse = responseCourse.data.data;
				setCourse(updatedCourse);

				if (updatedCourse.lessons?.length > 0) {
					setSelectedLesson(updatedCourse.lessons[0]);
				}
			} catch (err) {
				console.error("Subscription failed:", err);
				setSubscriptionError(
					err.response?.data?.error || "Subscription failed",
				);
			} finally {
				setSubscriptionLoading(false);
			}
		},
		[promoCodeValidation],
	);

	const handlePromoCodeInputChange = useCallback((e) => {
		const value = e.target.value.toUpperCase();
		setPromoCodeInput(value);
		setPromoCodeValidation((prev) => ({
			...prev,
			status: "idle",
			message: "",
			discountedPrice: null,
			codeApplied: null,
		}));
	}, []);

	const handleValidatePromoCode = useCallback(async () => {
		const trimmedCode = promoCodeInput.trim();
		if (!trimmedCode) return;

		setPromoCodeValidation((prev) => ({ ...prev, status: "validating" }));
		try {
			const response = await API.validatePromoCode({
				code: trimmedCode,
				basePrice: course?.price,
				courseId: courseId, // Pass courseId to validate scope
			});
			const result = response.data.data;
			setPromoCodeValidation({
				status: "valid",
				message: result.message || "Promo code applied!",
				discountedPrice: result.discountedPrice,
				codeApplied: trimmedCode,
			});
		} catch (err) {
			console.error("Promo code validation failed:", err);
			setPromoCodeValidation({
				status: "invalid",
				message: err.response?.data?.error || "Invalid or expired promo code",
				discountedPrice: null,
				codeApplied: null,
			});
		}
	}, [promoCodeInput, course?.price]);

	const displayPrice = useMemo(() => {
		if (
			promoCodeValidation.status === "valid" &&
			promoCodeValidation.discountedPrice != null
		) {
			return promoCodeValidation.discountedPrice;
		}
		return course?.price;
	}, [course, promoCodeValidation]);

	// --- Render Loading State ---
	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
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

	// --- Render Error State ---
	if (error && !course) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="p-6 text-red-600 bg-red-100 rounded-xl border-2 border-red-300 m-8"
			>
				<strong>Error:</strong> {error}
			</motion.div>
		);
	}

	if (!course) return null;

	// --- Main Render ---
	return (
		<div className="relative min-h-screen -mx-4 sm:-mx-6 -my-8">
			{/* Grid Background */}
			<div
				className="fixed inset-0 opacity-[0.08] pointer-events-none"
				style={{
					backgroundImage: `
						linear-gradient(to right, #7776bc 1px, transparent 1px),
						linear-gradient(to bottom, #7776bc 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
					top: "5rem",
				}}
			/>

			{/* Animated gradient blobs */}
			<div
				className="fixed inset-0 overflow-hidden pointer-events-none"
				style={{ top: "5rem" }}
			>
				<motion.div
					className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl"
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
					className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-lavender/10 blur-3xl"
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

			{/* Content with relative positioning to be above grid */}
			<div className="relative z-10 px-4 sm:px-6 py-8">
				{isSubscribed ? (
					// --- SUBSCRIBED VIEW ---
					<div className="flex flex-1 h-full max-h-[calc(100vh-8rem)]">
						{/* Mobile Menu Toggle Button */}
						<button
							onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
							className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-brand-lavender to-brand-coral text-white shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all active:scale-95 hover:scale-110"
						>
							{isMobileSidebarOpen ? (
								<FaTimes size={22} />
							) : (
								<FaBars size={22} />
							)}
							{!isMobileSidebarOpen && course?.lessons?.length > 0 && (
								<span className="absolute -top-1 -right-1 w-6 h-6 bg-brand-yellow text-xs font-bold rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
									{course.lessons.length}
								</span>
							)}
						</button>

						{/* Mobile Sidebar Backdrop */}
						{isMobileSidebarOpen && (
							<div
								className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
								onClick={() => setIsMobileSidebarOpen(false)}
							/>
						)}

						{/* Lesson Sidebar */}
						<aside
							className={`
							fixed md:relative
							inset-y-0 left-0
							w-4/5 md:w-1/3 lg:w-1/4
							bg-white/90 backdrop-blur-md p-4 md:p-6
							border-r-2 border-brand-lavender/20
							flex-shrink-0 overflow-y-auto
							z-40
							transition-transform duration-300 ease-in-out
							${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
							md:translate-x-0
							shadow-xl
						`}
						>
							{/* Sidebar Header with Close Button */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3 flex-1">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center flex-shrink-0">
										<FaGraduationCap className="text-white" />
									</div>
									<h2
										className="text-xl font-black text-base-content truncate"
										title={course.title}
									>
										{course.title}
									</h2>
								</div>
								{/* Close button for mobile */}
								<button
									onClick={() => setIsMobileSidebarOpen(false)}
									className="md:hidden ml-2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
								>
									<FaTimes size={18} />
								</button>
							</div>

							{/* Progress Bar */}
							{course.progress !== undefined && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="mb-6 p-4 bg-gradient-to-r from-brand-lavender/10 to-brand-coral/10 rounded-xl border-2 border-brand-lavender/20"
								>
									<div className="flex justify-between items-center mb-3">
										<span className="text-sm font-bold text-base-content">
											{t("course_page.progress")}
										</span>
										<span className="text-lg font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
											{course.progress}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${course.progress}%` }}
											transition={{ duration: 1, ease: "easeOut" }}
											className="bg-gradient-to-r from-brand-lavender to-brand-coral h-3 rounded-full"
										></motion.div>
									</div>
								</motion.div>
							)}

							{/* Lesson List */}
							<div className="space-y-2">
								<h3 className="text-sm font-bold text-base-content/60 uppercase tracking-wide mb-3">
									{t("course.lessons", { defaultValue: "Lessons" })}
								</h3>
								{course.lessons && course.lessons.length > 0 ? (
									<ul className="space-y-2">
										{course.lessons.map((lesson, index) => {
											const isCompleted = !!lesson.completions?.length;
											const isSelected = selectedLesson?.id === lesson.id;
											return (
												<motion.li
													key={lesson.id}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: index * 0.05 }}
												>
													<button
														onClick={() => handleSelectLesson(lesson)}
														className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group ${isSelected
																? "bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold shadow-lg scale-105"
																: "hover:bg-gray-100 text-base-content hover:scale-102"
															}`}
													>
														<div className="flex items-center gap-3 flex-1 min-w-0">
															<div
																className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected
																		? "bg-white/20"
																		: "bg-gradient-to-br from-brand-lavender/20 to-brand-coral/20"
																	}`}
															>
																<span
																	className={`text-sm font-bold ${isSelected ? "text-white" : "text-brand-lavender"}`}
																>
																	{index + 1}
																</span>
															</div>
															<span className="truncate text-sm font-medium">
																{lesson.title}
															</span>
														</div>
														{isCompleted && (
															<FaCheckCircle
																className={`flex-shrink-0 ml-2 ${isSelected ? "text-white" : "text-green-500"}`}
																title={t("course.completed", {
																	defaultValue: "Completed",
																})}
															/>
														)}
													</button>
												</motion.li>
											);
										})}
									</ul>
								) : (
									<p className="text-sm text-base-content/70 text-center py-8">
										{t("course.no_lessons", {
											defaultValue: "No lessons available",
										})}
									</p>
								)}
							</div>
						</aside>

						{/* Main Content Area */}
						<main className="flex-1 p-4 md:p-8 overflow-y-auto">
							{selectedLesson ? (
								<motion.div
									key={selectedLesson.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									{/* Lesson Header */}
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
										<div>
											<h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent mb-2">
												{selectedLesson.title}
											</h1>
											<p className="text-base-content/60 flex items-center gap-2">
												<FaBook className="text-brand-lavender" />
												Lesson content
											</p>
										</div>

										{/* Mark as Complete / Completed Badge */}
										{selectedLesson.completions?.length > 0 ? (
											<div className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 rounded-full border-2 border-green-300 font-bold shadow-lg">
												<FaCheckCircle className="text-lg" />
												<span>
													{t("course.completed", { defaultValue: "Completed" })}
												</span>
											</div>
										) : (
											<Button
												onClick={handleMarkAsComplete}
												disabled={completingLesson}
												className="bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
											>
												{completingLesson ? (
													<>
														<FaSpinner className="animate-spin mr-2" />
														{t("course.marking_complete", {
															defaultValue: "Marking as complete...",
														})}
													</>
												) : (
													<>
														<FaCheck className="mr-2" />
														{t("course.mark_complete", {
															defaultValue: "Mark as Complete",
														})}
													</>
												)}
											</Button>
										)}
									</div>

									{/* Completion Success Animation */}
									<AnimatePresence>
										{completionSuccess && (
											<motion.div
												initial={{ opacity: 0, scale: 0.9, y: -20 }}
												animate={{ opacity: 1, scale: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.9, y: -20 }}
												className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-2xl flex items-center gap-3 shadow-lg"
											>
												<div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
													<FaCheckCircle className="text-white text-xl" />
												</div>
												<span className="text-green-700 font-bold">
													{t("course.lesson_completed_success", {
														defaultValue: "Lesson completed successfully!",
													})}
												</span>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Video Player */}
									{selectedLesson.videoPath ? (
										<div className="mb-8">
											{/* Quality Selector */}
											{videoType === "hls" && qualityLevels.length > 0 && (
												<div className="mb-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border-2 border-brand-lavender/20">
													<span className="text-sm font-bold text-base-content">
														Quality:
													</span>
													<select
														value={currentQuality}
														onChange={(e) =>
															handleQualityChange(parseInt(e.target.value))
														}
														className="px-4 py-2 border-2 border-gray-200 bg-white text-base-content rounded-xl focus:ring-2 focus:ring-brand-lavender font-medium"
													>
														<option value={-1}>Auto</option>
														{qualityLevels.map((level) => (
															<option key={level.index} value={level.index}>
																{level.name} ({Math.round(level.bitrate / 1000)}
																kbps)
															</option>
														))}
													</select>
												</div>
											)}

											{/* Video Container */}
											<div className="relative group">
												<div className="bg-black rounded-3xl overflow-hidden aspect-video border-4 border-brand-lavender/30 shadow-2xl">
													<video
														ref={videoRef}
														controls
														className="w-full h-full"
														crossOrigin="use-credentials"
														{...(videoType === "regular" && { src: videoSrc })}
													>
														Your browser does not support the video tag.
													</video>
												</div>
												{/* Decorative gradient overlay on hover */}
												<div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-lavender/20 to-brand-coral/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
											</div>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center w-full h-64 mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-2 border-gray-300">
											<FaPlay className="text-gray-400 text-5xl mb-4" />
											<p className="text-gray-500 font-medium">
												{t("course.no_video", {
													defaultValue: "No video available",
												})}
											</p>
										</div>
									)}

									{/* Exercises Section */}
									<div className="mt-8">
										<div className="flex items-center gap-3 mb-6">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-yellow to-brand-coral flex items-center justify-center">
												<FaBook className="text-white" />
											</div>
											<h2 className="text-2xl font-black text-base-content">
												{t("course.exercises", { defaultValue: "Exercises" })}
											</h2>
										</div>

										{selectedLesson.exercises?.length > 0 ? (
											<ul className="space-y-6">
												{selectedLesson.exercises.map((exercise, index) => {
													const submission = exerciseSubmissions[exercise.id];
													const isSubmitted = !!submission;

													return (
														<motion.li
															key={exercise.id}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: index * 0.1 }}
															className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border-2 border-brand-lavender/20 shadow-lg hover:shadow-xl transition-shadow"
														>
															<div className="flex items-center gap-3 mb-4">
																<span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral text-white flex items-center justify-center font-bold text-sm">
																	{index + 1}
																</span>
																<p className="font-bold text-lg text-base-content">
																	{t("course.exercise_number", {
																		number: index + 1,
																		defaultValue: `Exercise ${index + 1}`,
																	})}
																</p>
															</div>

															<p className="text-base-content mb-6 leading-relaxed">
																{exercise.question}
															</p>

															{!isSubmitted ? (
																// --- Exercise Input Form ---
																<div className="space-y-4">
																	<Input
																		type="text"
																		placeholder={t("course.your_answer", {
																			defaultValue: "Your answer...",
																		})}
																		value={exerciseAnswers[exercise.id] || ""}
																		onChange={(e) =>
																			handleExerciseAnswerChange(
																				exercise.id,
																				e.target.value,
																			)
																		}
																		className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-lavender"
																		disabled={
																			submittingExercise === exercise.id
																		}
																	/>
																	<Button
																		onClick={() =>
																			handleSubmitExercise(exercise.id)
																		}
																		disabled={
																			!exerciseAnswers[exercise.id]?.trim() ||
																			submittingExercise === exercise.id
																		}
																		className="w-full sm:w-auto bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
																	>
																		{submittingExercise === exercise.id ? (
																			<>
																				<FaSpinner className="animate-spin mr-2" />
																				{t("course.submitting", {
																					defaultValue: "Submitting...",
																				})}
																			</>
																		) : (
																			t("course.submit_answer", {
																				defaultValue: "Submit Answer",
																			})
																		)}
																	</Button>
																</div>
															) : (
																// --- Exercise Result ---
																<div
																	className={`p-6 rounded-2xl ${submission.isCorrect
																			? "bg-green-100 border-2 border-green-400"
																			: "bg-red-100 border-2 border-red-400"
																		}`}
																>
																	<p className="font-bold mb-3 flex items-center text-lg">
																		{submission.isCorrect ? (
																			<>
																				<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
																					<FaCheckCircle className="text-white" />
																				</div>
																				<span className="text-green-700">
																					{t("course.correct", {
																						defaultValue: "Correct!",
																					})}
																				</span>
																			</>
																		) : (
																			<>
																				<div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
																					<FaInfoCircle className="text-white" />
																				</div>
																				<span className="text-red-700">
																					{t("course.incorrect", {
																						defaultValue: "Incorrect",
																					})}
																				</span>
																			</>
																		)}
																	</p>
																	<div className="space-y-2">
																		<p className="text-sm">
																			<strong className="font-bold">
																				{t("course.your_answer", {
																					defaultValue: "Your answer",
																				})}
																				:
																			</strong>{" "}
																			<span
																				className={
																					submission.isCorrect
																						? "text-green-700"
																						: "text-red-700"
																				}
																			>
																				{submission.submittedAnswer}
																			</span>
																		</p>
																		{!submission.isCorrect && (
																			<p className="text-sm">
																				<strong className="font-bold">
																					{t("course.correct_answer", {
																						defaultValue: "Correct answer",
																					})}
																					:
																				</strong>{" "}
																				<span className="text-green-700 font-semibold">
																					{submission.correctAnswer}
																				</span>
																			</p>
																		)}
																	</div>
																</div>
															)}
														</motion.li>
													);
												})}
											</ul>
										) : (
											<p className="text-base-content/70 text-center py-8 bg-gray-100 rounded-2xl">
												{t("course.no_exercises", {
													defaultValue: "No exercises for this lesson",
												})}
											</p>
										)}
									</div>

									{/* Tests Section - Only show on last lesson */}
									{selectedLesson && course.lessons &&
									 selectedLesson.id === course.lessons[course.lessons.length - 1]?.id && (
										<div className="mt-12">
											<div className="flex items-center gap-3 mb-6">
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-coral to-brand-yellow flex items-center justify-center">
													<FaGraduationCap className="text-white" />
												</div>
												<h2 className="text-2xl font-black text-base-content">
													{t("course.tests", { defaultValue: "Tests & Certificates" })}
												</h2>
											</div>

											{/* Test Unlock Celebration */}
											<AnimatePresence>
												{showTestUnlocked && (
													<motion.div
														initial={{ opacity: 0, scale: 0.8, y: -20 }}
														animate={{ opacity: 1, scale: 1, y: 0 }}
														exit={{ opacity: 0, scale: 0.8, y: -20 }}
														className="mb-6 p-6 bg-gradient-to-r from-green-100 via-yellow-100 to-green-100 border-2 border-green-400 rounded-2xl flex items-center gap-4 shadow-2xl"
													>
														<motion.div
															animate={{
																rotate: [0, -10, 10, -10, 0],
																scale: [1, 1.2, 1]
															}}
															transition={{
																duration: 0.5,
																repeat: 3,
																ease: "easeInOut"
															}}
															className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-yellow to-brand-coral flex items-center justify-center flex-shrink-0"
														>
															<FaTrophy className="text-white text-3xl" />
														</motion.div>
														<div className="flex-1">
															<p className="text-green-800 font-black text-xl mb-1">
																🎉 {t("course.tests_unlocked_title", { defaultValue: "Tests Unlocked!" })}
															</p>
															<p className="text-green-700 font-medium">
																{t("course.tests_unlocked_message", { defaultValue: "Congratulations! You've completed all lessons. You can now take the tests!" })}
															</p>
														</div>
														<FaUnlock className="text-green-600 text-2xl flex-shrink-0" />
													</motion.div>
												)}
											</AnimatePresence>

											{loadingTests ? (
												<div className="flex justify-center py-8">
													<FaSpinner className="animate-spin text-brand-lavender text-2xl" />
												</div>
											) : course.progress === 100 ? (
												// Tests are unlocked - show available tests
												tests.length > 0 ? (
													<div className="grid grid-cols-1 gap-4">
														{tests.map((test, index) => (
															<motion.div
																key={test.id}
																initial={{ opacity: 0, y: 20 }}
																animate={{ opacity: 1, y: 0 }}
																transition={{ delay: index * 0.1 }}
																className="bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 p-6 rounded-3xl border-2 border-brand-lavender/30 shadow-lg hover:shadow-xl transition-all"
															>
																<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
																	<div className="flex-1">
																		<h3 className="text-xl font-bold text-base-content mb-2">
																			{test.title}
																		</h3>
																		{test.description && (
																			<p className="text-base-content/70 text-sm mb-3">
																				{test.description}
																			</p>
																		)}
																		<div className="flex flex-wrap gap-3 text-sm">
																			<div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
																				<FaBook className="text-brand-lavender" />
																				<span className="font-medium">
																					{test.questions?.length || 0} {t("course.questions", { defaultValue: "questions" })}
																				</span>
																			</div>
																			<div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
																				<FaStar className="text-brand-coral" />
																				<span className="font-medium">
																					{test.passingScore}% {t("course.passing_score", { defaultValue: "to pass" })}
																				</span>
																			</div>
																			{test.timeLimit && (
																				<div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
																					<FaClock className="text-brand-yellow" />
																					<span className="font-medium">
																						{test.timeLimit} {t("course.minutes", { defaultValue: "min" })}
																					</span>
																				</div>
																			)}
																		</div>
																	</div>
																	<Button
																		onClick={() => window.location.href = `/tests/${test.id}`}
																		className="bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
																	>
																		<FaGraduationCap className="mr-2" />
																		{t("course.start_test", { defaultValue: "Start Test" })}
																	</Button>
																</div>
															</motion.div>
														))}
													</div>
												) : (
													<div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200">
														<FaGraduationCap className="text-gray-300 text-5xl mx-auto mb-4" />
														<p className="text-base-content/70 font-medium">
															{t("course.no_tests", { defaultValue: "No tests available for this course yet" })}
														</p>
													</div>
												)
											) : (
												// Tests are locked - show locked state
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl border-2 border-gray-300 text-center"
												>
													<motion.div
														animate={{
															scale: [1, 1.1, 1],
														}}
														transition={{
															duration: 2,
															repeat: Infinity,
															ease: "easeInOut"
														}}
														className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center"
													>
														<FaLock className="text-white text-4xl" />
													</motion.div>
													<h3 className="text-2xl font-black text-gray-700 mb-3">
														{t("course.tests_locked_title", { defaultValue: "Tests Locked" })}
													</h3>
													<p className="text-gray-600 font-medium mb-6 max-w-md mx-auto">
														{t("course.tests_locked_message", {
															defaultValue: "Complete all lessons to unlock the tests. Keep going, you're doing great!"
														})}
													</p>
													<div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border-2 border-gray-300">
														<div className="flex items-center gap-2">
															<div className="w-48 bg-gray-200 rounded-full h-3 overflow-hidden">
																<motion.div
																	initial={{ width: 0 }}
																	animate={{ width: `${course.progress || 0}%` }}
																	transition={{ duration: 1, ease: "easeOut" }}
																	className="bg-gradient-to-r from-brand-lavender to-brand-coral h-3 rounded-full"
																></motion.div>
															</div>
															<span className="text-lg font-black text-gray-700">
																{course.progress || 0}%
															</span>
														</div>
													</div>
												</motion.div>
											)}
										</div>
									)}
								</motion.div>
							) : (
								// Shown if subscribed but no lesson is selected
								<div className="text-center py-20">
									<motion.div
										animate={{ y: [0, -10, 0] }}
										transition={{ duration: 2, repeat: Infinity }}
										className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-lavender/20 to-brand-coral/20 flex items-center justify-center"
									>
										<FaBook className="text-4xl text-brand-lavender" />
									</motion.div>
									<p className="text-xl font-bold text-base-content/70">
										{t("course.select_lesson", {
											defaultValue: "Select a lesson to begin",
										})}
									</p>
								</div>
							)}
						</main>
					</div>
				) : (
					// --- NON-SUBSCRIBED VIEW (Course Landing Page) ---
					<div className="max-w-5xl mx-auto">
						{/* Display general error if one occurred during load */}
						{error && (
							<div className="p-4 mb-6 text-red-600 bg-red-100 rounded-2xl border-2 border-red-300">
								Error: {error}
							</div>
						)}

						{/* Course Card */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-brand-lavender/20 overflow-hidden shadow-2xl"
						>
							{/* Banner Image */}
							{course.bannerImage && (
								<div className="relative h-64 md:h-80 overflow-hidden">
									<img
										src={`${API_URL}/${course.bannerImage}`}
										alt={course.title}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
									<div className="absolute bottom-6 left-6 right-6">
										<h1 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
											{course.title}
										</h1>
										<p className="text-white/90 flex items-center gap-2">
											<FaGraduationCap />
											{t("dashboard.by")}{" "}
											{course.teacher?.name || t("courses.instructor_unknown")}
										</p>
									</div>
								</div>
							)}

							{/* Course Content */}
							<div className="p-8">
								{!course.bannerImage && (
									<>
										<h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent mb-3">
											{course.title}
										</h1>
										<p className="text-base-content/60 mb-6 flex items-center gap-2">
											<FaGraduationCap className="text-brand-lavender" />
											{t("dashboard.by")}{" "}
											{course.teacher?.name || t("courses.instructor_unknown")}
										</p>
									</>
								)}

								<p className="text-base-content leading-relaxed mb-8 text-lg">
									{course.description}
								</p>

								{/* Course Stats */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
									<div className="bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 p-4 rounded-2xl border-2 border-brand-lavender/20 text-center">
										<FaBook className="text-brand-lavender text-2xl mx-auto mb-2" />
										<div className="text-2xl font-black text-base-content">
											{course.lessons?.length || 0}
										</div>
										<div className="text-xs text-base-content/60 font-medium">
											Lessons
										</div>
									</div>
									<div className="bg-gradient-to-br from-brand-coral/10 to-brand-yellow/10 p-4 rounded-2xl border-2 border-brand-coral/20 text-center">
										<FaClock className="text-brand-coral text-2xl mx-auto mb-2" />
										<div className="text-2xl font-black text-base-content">
											∞
										</div>
										<div className="text-xs text-base-content/60 font-medium">
											Lifetime Access
										</div>
									</div>
									<div className="bg-gradient-to-br from-brand-yellow/10 to-brand-lavender/10 p-4 rounded-2xl border-2 border-brand-yellow/20 text-center">
										<FaGraduationCap className="text-brand-yellow text-2xl mx-auto mb-2" />
										<div className="text-2xl font-black text-base-content">
											∞
										</div>
										<div className="text-xs text-base-content/60 font-medium">
											Students
										</div>
									</div>
									<div className="bg-gradient-to-br from-brand-coral/10 to-brand-lavender/10 p-4 rounded-2xl border-2 border-brand-coral/20 text-center">
										<FaStar className="text-brand-coral text-2xl mx-auto mb-2" />
										<div className="text-2xl font-black text-base-content">
											5.0
										</div>
										<div className="text-xs text-base-content/60 font-medium">
											Rating
										</div>
									</div>
								</div>

								{/* --- Promo Code Input Section --- */}
								{course.price != null && course.price > 0 && (
									<div className="mb-6 p-6 bg-gradient-to-r from-brand-yellow/10 to-brand-coral/10 rounded-2xl border-2 border-brand-yellow/30">
										<label
											htmlFor="promoCode"
											className="flex items-center gap-2 text-sm font-bold text-base-content mb-3"
										>
											<FaTag className="text-brand-coral" />
											{t("course.promo_code_label", {
												defaultValue: "Have a promo code?",
											})}
										</label>
										<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
											<Input
												type="text"
												id="promoCode"
												placeholder={t("course.promo_code_placeholder", {
													defaultValue: "Enter code...",
												})}
												value={promoCodeInput}
												onChange={handlePromoCodeInputChange}
												className="flex-grow uppercase text-base px-4 py-3 border-2 border-gray-200 rounded-xl font-bold"
												disabled={promoCodeValidation.status === "validating"}
											/>
											<Button
												onClick={handleValidatePromoCode}
												disabled={
													!promoCodeInput.trim() ||
													promoCodeValidation.status === "validating" ||
													promoCodeValidation.status === "valid"
												}
												className="flex-shrink-0 bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold px-6 py-3 rounded-xl shadow-lg"
											>
												{promoCodeValidation.status === "validating" && (
													<FaSpinner className="animate-spin mr-2" />
												)}
												{t("course.promo_code_apply", {
													defaultValue: "Apply",
												})}
											</Button>
										</div>

										{/* Promo Code Validation Messages */}
										<AnimatePresence>
											{promoCodeValidation.status === "valid" && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-xl flex items-center gap-3"
												>
													<FaCheckCircle className="text-green-600 text-xl" />
													<span className="text-green-700 font-bold">
														{promoCodeValidation.message}
													</span>
												</motion.div>
											)}
											{promoCodeValidation.status === "invalid" && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl flex items-center gap-3"
												>
													<FaInfoCircle className="text-red-600 text-xl" />
													<span className="text-red-700 font-bold">
														{promoCodeValidation.message}
													</span>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}

								{/* Price and Subscribe Button */}
								<div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-brand-lavender/10 via-brand-coral/10 to-brand-yellow/10 rounded-2xl border-2 border-brand-lavender/20">
									<div>
										{course.price != null && course.price > 0 ? (
											<>
												{promoCodeValidation.status === "valid" && (
													<span className="text-lg line-through text-base-content/50 mr-3">
														₮{course.price.toLocaleString()}
													</span>
												)}
												<span className="text-4xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
													₮{displayPrice?.toLocaleString()}
												</span>
											</>
										) : (
											<span className="text-4xl font-black bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
												{t("courses.free", { defaultValue: "FREE" })}
											</span>
										)}
									</div>
									<Button
										onClick={handleOpenSubscriptionModal}
										className="bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow text-white font-black px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all text-lg"
									>
										{t("courses.enroll", { defaultValue: "Enroll Now" })}
									</Button>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</div>

			{/* --- Subscription Modal --- */}
			<SubscriptionModal
				course={course}
				isOpen={isSubscriptionModalOpen}
				finalPrice={displayPrice}
				promoCodeApplied={
					promoCodeValidation.status === "valid"
						? promoCodeValidation.codeApplied
						: null
				}
				onConfirm={() => handleConfirmSubscription(course.id)}
				onCancel={handleCancelSubscription}
				isLoading={subscriptionLoading}
				error={subscriptionError}
			/>
		</div>
	);
};

export default CoursePage;
