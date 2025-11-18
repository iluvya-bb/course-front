import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { useParams } from "react-router-dom"; // Removed unused 'Link'
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
} from "react-icons/fa"; // Removed unused 'FaPlayCircle'

import API, { API_URL } from "../services/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SubscriptionModal from "./dashboard/SubscriptionModal";

const CoursePage = () => {
	// --- Core Hooks ---
	const { t } = useTranslation(["translation", "course_page"]);
	console.log(t);
	const { courseId } = useParams();
	const videoRef = useRef(null);
	const hlsRef = useRef(null); // Store HLS instance for quality control

	// --- Component State ---

	// Course data and loading state
	const [course, setCourse] = useState(null);
	const [selectedLesson, setSelectedLesson] = useState(null);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Video player state
	const [videoType, setVideoType] = useState(null); // 'hls' or 'regular'
	const [videoSrc, setVideoSrc] = useState("");
	const [qualityLevels, setQualityLevels] = useState([]); // Available quality levels
	const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto, >= 0 = specific level

	// Subscription modal state
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
	const [subscriptionLoading, setSubscriptionLoading] = useState(false);
	const [subscriptionError, setSubscriptionError] = useState(null);

	// Promo code state
	const [promoCodeInput, setPromoCodeInput] = useState("");
	const [promoCodeValidation, setPromoCodeValidation] = useState({
		status: "idle", // 'idle', 'validating', 'valid', 'invalid'
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
	const [submittingExercise, setSubmittingExercise] = useState(null); // Stores the ID of the exercise being submitted

	// --- Effects ---

	/**
	 * Effect: Fetch main course data
	 * Runs when `courseId` changes.
	 * Resets all component state and fetches course details.
	 */
	useEffect(() => {
		const fetchCourseData = async () => {
			if (!courseId) return;

			// Reset state for new course load
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

				const userIsSubscribed = !!fetchedCourse.subscriptions?.length;
				setIsSubscribed(userIsSubscribed);

				const fetchedLessons = fetchedCourse.lessons || [];
				// If subscribed, select the first lesson by default
				if (userIsSubscribed && fetchedLessons.length > 0) {
					setSelectedLesson(fetchedLessons[0]);
				} else {
					setSelectedLesson(null); // Not subscribed or no lessons
				}
			} catch (error) {
				console.error("Failed to fetch course data:", error);
				setError(
					error.response?.data?.error ||
					error.message ||
					t("error_fetching_course", { ns: "course_page" }),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCourseData();
	}, [courseId, t]);

	/**
	 * Effect: Fetch video stream info
	 * Runs when the `selectedLesson` changes.
	 * Fetches the appropriate stream URL (HLS or regular).
	 */
	useEffect(() => {
		if (!selectedLesson?.videoPath || !selectedLesson.id) {
			setVideoSrc("");
			setVideoType(null);
			return;
		}

		const fetchVideoInfo = async () => {
			try {
				const response = await API.streamVideo(selectedLesson.id);
				const streamData = response.data.data;
				console.log("Stream type:", streamData.type);
				console.log("Stream URL:", streamData.url);

				if (streamData.type === "hls") {
					setVideoType("hls");
					// Use CloudFront URL directly (already a full URL from backend)
					setVideoSrc(streamData.url);
				} else {
					setVideoType("regular");
					// Use CloudFront URL directly (already a full URL from backend)
					setVideoSrc(streamData.url);
				}
			} catch (error) {
				console.error("Failed to fetch video info:", error);
				setVideoType(null);
				setVideoSrc("");
			}
		};

		fetchVideoInfo();
	}, [selectedLesson?.id, selectedLesson?.videoPath]); // Re-run if lesson or its video path changes

	/**
	 * Effect: Configure HLS.js player
	 * Runs when the `videoSrc` or `videoType` changes.
	 * Handles attaching HLS.js to the video element and cleaning up.
	 */
	useEffect(() => {
		if (!videoRef.current || !videoSrc || videoType !== "hls") {
			// 'regular' type is handled by the 'src' attribute in JSX
			return;
		}

		console.log("Setting up HLS player with URL:", videoSrc);

		let hls;
		if (Hls.isSupported()) {
			hls = new Hls({
				debug: false,
				xhrSetup: (xhr, url) => {
					// Include credentials for authenticated requests
					xhr.withCredentials = true;
				},
			});

			// Store HLS instance in ref
			hlsRef.current = hls;

			hls.on(Hls.Events.ERROR, (event, data) => {
				console.error("HLS Error:", data);
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							console.error("Fatal network error, trying to recover");
							hls.startLoad();
							break;
						case Hls.ErrorTypes.MEDIA_ERROR:
							console.error("Fatal media error, trying to recover");
							hls.recoverMediaError();
							break;
						default:
							console.error("Fatal error, cannot recover");
							hls.destroy();
							break;
					}
				}
			});

			hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
				console.log("HLS manifest loaded successfully");
				// Populate quality levels
				const levels = hls.levels.map((level, index) => ({
					index,
					height: level.height,
					width: level.width,
					bitrate: level.bitrate,
					name: `${level.height}p`,
				}));
				console.log("Available quality levels:", levels);
				setQualityLevels(levels);
				setCurrentQuality(-1); // Auto quality
			});

			hls.loadSource(videoSrc);
			hls.attachMedia(videoRef.current);
		} else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
			// Native HLS support (e.g., Safari)
			console.log("Using native HLS support");
			videoRef.current.src = videoSrc;
		} else {
			console.error("HLS is not supported in this browser");
		}

		// Cleanup function to destroy HLS instance
		return () => {
			if (hls) {
				hls.destroy();
			}
			hlsRef.current = null;
			setQualityLevels([]);
			setCurrentQuality(-1);
		};
	}, [videoSrc, videoType]);

	// --- Memoized Values ---

	/**
	 * Memo: Calculate the final display price
	 * Recalculates only when promo validation or course price changes.
	 */
	const displayPrice = useMemo(
		() =>
			promoCodeValidation.status === "valid" &&
				promoCodeValidation.discountedPrice !== null
				? promoCodeValidation.discountedPrice
				: course?.price, // Use optional chaining for safety
		[
			promoCodeValidation.status,
			promoCodeValidation.discountedPrice,
			course?.price,
		],
	);

	/**
	 * Memo: Check if the course is effectively free
	 * Recalculates only when the `displayPrice` changes.
	 */
	const isEffectivelyFree = useMemo(() => displayPrice <= 0, [displayPrice]);

	// --- Event Handlers ---

	/**
	 * Handler: Change video quality
	 */
	const handleQualityChange = useCallback((qualityIndex) => {
		if (!hlsRef.current) return;

		console.log("Changing quality to:", qualityIndex);
		if (qualityIndex === -1) {
			// Auto quality
			hlsRef.current.currentLevel = -1;
		} else {
			// Specific quality level
			hlsRef.current.currentLevel = qualityIndex;
		}
		setCurrentQuality(qualityIndex);
	}, []);

	/**
	 * Handler: Selects a lesson from the sidebar
	 */
	const handleSelectLesson = useCallback((lesson) => {
		setSelectedLesson(lesson);
		setCompletionSuccess(false); // Hide success message on new lesson
		setExerciseAnswers({}); // Reset answers for new lesson
		setExerciseSubmissions({}); // Reset submissions for new lesson
	}, []); // No dependencies, state setters are stable

	/**
	 * Handler: Updates the answer for a specific exercise
	 */
	const handleExerciseAnswerChange = useCallback((exerciseId, value) => {
		setExerciseAnswers((prev) => ({
			...prev,
			[exerciseId]: value,
		}));
	}, []);

	/**
	 * Handler: Submits an exercise answer to the API
	 */
	const handleSubmitExercise = useCallback(
		async (exerciseId) => {
			const answer = exerciseAnswers[exerciseId]?.trim();
			if (!answer) return;

			setSubmittingExercise(exerciseId);
			try {
				const response = await API.submitExercise(exerciseId, {
					submittedAnswer: answer,
				});

				// Store the submission result (correct/incorrect, correct answer)
				setExerciseSubmissions((prev) => ({
					...prev,
					[exerciseId]: response.data.data,
				}));
			} catch (error) {
				console.error("Failed to submit exercise:", error);
				alert(
					error.response?.data?.error ||
					t("error_submitting_exercise", { ns: "course_page" }),
				);
			} finally {
				setSubmittingExercise(null);
			}
		},
		[exerciseAnswers, t],
	);

	/**
	 * Handler: Marks the current lesson as complete
	 * Uses optimistic updates to modify local state without a full re-fetch.
	 */
	const handleMarkAsComplete = useCallback(async () => {
		if (!selectedLesson) return;
		setCompletingLesson(true);

		try {
			await API.markLessonAsComplete(selectedLesson.id);

			const completionStub = [{ userId: "current" }]; // Mock completion object

			// Optimistic update: Update the main course list
			setCourse((prevCourse) => {
				if (!prevCourse) return prevCourse;
				const updatedLessons = prevCourse.lessons.map((lesson) =>
					lesson.id === selectedLesson.id
						? { ...lesson, completions: completionStub }
						: lesson,
				);
				return { ...prevCourse, lessons: updatedLessons };
			});

			// Optimistic update: Update the currently selected lesson
			setSelectedLesson((prev) => ({
				...prev,
				completions: completionStub,
			}));

			// Show success animation
			setCompletionSuccess(true);
			setTimeout(() => setCompletionSuccess(false), 3000); // Hide after 3s
		} catch (error) {
			console.error("Failed to mark lesson as complete:", error);
			// Optionally show an error toast/alert
		} finally {
			setCompletingLesson(false);
		}
	}, [selectedLesson]);

	/**
	 * Handler: Opens the subscription modal
	 */
	const handleSubscribeClick = useCallback(
		() => setIsSubscriptionModalOpen(true),
		[],
	);

	/**
	 * Handler: Closes the subscription modal
	 */
	const handleCancelSubscription = useCallback(() => {
		setIsSubscriptionModalOpen(false);
		setSubscriptionError(null); // Clear any old errors
	}, []);

	/**
	 * Handler: Updates the promo code input value
	 * Resets validation if the input is cleared.
	 */
	const handlePromoCodeInputChange = useCallback(
		(e) => {
			const newValue = e.target.value;
			setPromoCodeInput(newValue);

			// If user clears the input after validation, reset the validation state
			if (!newValue.trim() && promoCodeValidation.status !== "idle") {
				setPromoCodeValidation({
					status: "idle",
					message: "",
					discountedPrice: null,
					codeApplied: null,
				});
			}
		},
		[promoCodeValidation.status],
	); // Dependency needed for the reset check

	/**
	 * Handler: Validates the promo code with the API
	 */
	const handleValidatePromoCode = useCallback(async () => {
		const code = promoCodeInput.trim().toUpperCase();
		if (!code || !course?.price || course.price <= 0) return;

		setPromoCodeValidation({
			status: "validating",
			message: "",
			discountedPrice: null,
			codeApplied: null,
		});

		try {
			const response = await API.validatePromoCode({
				code: code,
				basePrice: course.price,
			});
			setPromoCodeValidation({
				status: "valid",
				message:
					response.data.message || t("promo_code.valid", { ns: "course_page" }),
				discountedPrice: response.data.data.finalPrice,
				codeApplied: response.data.data.code,
			});
		} catch (error) {
			console.error("Promo code validation failed:", error);
			setPromoCodeValidation({
				status: "invalid",
				message:
					error.response?.data?.error ||
					t("promo_code.invalid", { ns: "course_page" }),
				discountedPrice: null,
				codeApplied: null,
			});
		}
	}, [promoCodeInput, course?.price, t]);

	/**
	 * Handler: Confirms subscription
	 * Creates the subscription, passing the validated promo code.
	 * Uses optimistic updates to grant access immediately.
	 */
	const handleConfirmSubscription = useCallback(
		async (courseIdToSubscribe) => {
			if (!courseIdToSubscribe) return;
			setSubscriptionLoading(true);
			setSubscriptionError(null);

			const subscriptionData = {
				promoCode:
					promoCodeValidation.status === "valid"
						? promoCodeValidation.codeApplied
						: null,
			};

			try {
				const response = await API.createSubscription(
					courseIdToSubscribe,
					subscriptionData,
				);

				// Optimistic update: Grant access
				setIsSubscribed(true);

				// Optimistic update: Add subscription data to local course object
				setCourse((prevCourse) => {
					if (!prevCourse) return prevCourse;
					return {
						...prevCourse,
						subscriptions: response.data.data
							? [response.data.data]
							: [{ status: "active" }], // Fallback stub
					};
				});

				// Set first lesson from existing course data
				if (course?.lessons && course.lessons.length > 0) {
					setSelectedLesson(course.lessons[0]);
				}

				setIsSubscriptionModalOpen(false);
			} catch (error) {
				console.error("Subscription failed:", error);
				setSubscriptionError(
					error.response?.data?.error || "Subscription failed",
				);
			} finally {
				setSubscriptionLoading(false);
			}
		},
		[
			promoCodeValidation.status,
			promoCodeValidation.codeApplied,
			course?.lessons,
		],
	);

	// --- Render Logic ---

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<FaSpinner className="animate-spin text-indigo-600 mr-3 h-8 w-8" />
				<span>{t("loading")}...</span>
			</div>
		);
	}

	// Show error only if course *failed* to load (i.e., `course` is still null)
	if (error && !course) {
		return (
			<div className="p-4 text-red-600 bg-red-100 rounded-md">
				Error: {error}
			</div>
		);
	}

	if (!course) {
		return (
			<div className="text-center p-4 text-gray-500">
				{t("course_not_found", { ns: "course_page" })}
			</div>
		);
	}

	// --- Main Component JSX ---
	return (
		<>
			{isSubscribed ? (
				// --- SUBSCRIBED VIEW ---
				<div className="flex flex-1 h-full max-h-[calc(100vh-theme(space.24))]">
					{/* Lesson Sidebar */}
					<aside className="w-full md:w-1/3 lg:w-1/4 bg-neutral p-4 md:p-6 border-r-2 border-neutral flex-shrink-0 overflow-y-auto">
						<h2
							className="text-xl lg:text-2xl font-bold text-base-content mb-4 truncate"
							title={course.title}
						>
							{course.title}
						</h2>

						{/* Progress Bar */}
						{course.progress !== undefined && (
							<div className="mb-6">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-medium text-base-content">
										{t("progress", { ns: "course_page" })}
									</span>
									<span className="text-sm font-bold text-primary">
										{course.progress}%
									</span>
								</div>
								<div className="w-full bg-base-200 rounded-full h-2.5">
									<div
										className="bg-primary h-2.5 rounded-full transition-all duration-500"
										style={{ width: `${course.progress}%` }}
									></div>
								</div>
							</div>
						)}

						{/* Lesson List */}
						{course.lessons && course.lessons.length > 0 ? (
							<ul className="space-y-2">
								{course.lessons.map((lesson, index) => {
									const isCompleted = !!lesson.completions?.length;
									const isSelected = selectedLesson?.id === lesson.id;
									return (
										<li key={lesson.id}>
											<button
												onClick={() => handleSelectLesson(lesson)}
												className={`w-full text-left p-3 rounded-lg transition-colors duration-150 flex items-center justify-between ${isSelected
														? "bg-primary text-primary-content font-semibold"
														: "hover:bg-base-300 text-base-content"
													}`}
											>
												<span className="truncate pr-2">
													{index + 1}. {lesson.title}
												</span>
												{isCompleted && (
													<FaCheckCircle
														className="flex-shrink-0 text-success"
														title={t("completed", { ns: "course_page" })}
													/>
												)}
											</button>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="text-sm text-base-content/70">
								{t("no_lessons", { ns: "course_page" })}
							</p>
						)}
					</aside>

					{/* Main Content Area */}
					<main className="flex-1 p-4 md:p-8 overflow-y-auto">
						{selectedLesson ? (
							<motion.div
								key={selectedLesson.id} // Animate when lesson ID changes
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex justify-between items-start mb-4">
									<h1 className="text-2xl md:text-3xl font-bold text-base-content">
										{selectedLesson.title}
									</h1>

									{/* Mark as Complete / Completed Badge */}
									{selectedLesson.completions?.length > 0 ? (
										<div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20">
											<FaCheckCircle />
											<span className="font-medium text-sm">
												{t("completed", { ns: "course_page" })}
											</span>
										</div>
									) : (
										<Button
											onClick={handleMarkAsComplete}
											disabled={completingLesson}
											className="flex items-center gap-2"
											variant="outline"
										>
											{completingLesson ? (
												<>
													<FaSpinner className="animate-spin" />
													{t("marking_complete", { ns: "course_page" })}
												</>
											) : (
												<>
													<FaCheck />
													{t("mark_complete", { ns: "course_page" })}
												</>
											)}
										</Button>
									)}
								</div>

								{/* Completion Success Animation */}
								<AnimatePresence>
									{completionSuccess && (
										<motion.div
											initial={{ opacity: 0, y: -20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											className="mb-4 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3"
										>
											<FaCheckCircle className="text-success text-xl" />
											<span className="text-success font-medium">
												{t("lesson_completed_success", { ns: "course_page" })}
											</span>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Video Player */}
								{selectedLesson.videoPath ? (
									<div className="mb-8">
										{/* Quality Selector */}
										{videoType === "hls" && qualityLevels.length > 0 && (
											<div className="mb-4 flex items-center gap-2">
												<span className="text-sm font-medium text-base-content">
													Quality:
												</span>
												<select
													value={currentQuality}
													onChange={(e) =>
														handleQualityChange(parseInt(e.target.value))
													}
													className="px-3 py-1 border-2 border-neutral bg-base-100 text-base-content rounded-md shadow-[2px_2px_0px_#1A1A1A] focus:outline-none focus:ring-2 focus:ring-primary"
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
										<div className="bg-black rounded-lg overflow-hidden aspect-video border-2 border-neutral shadow-[8px_8px_0px_#00F6FF]">
											<video
												ref={videoRef}
												controls
												className="w-full h-full"
												crossOrigin="use-credentials"
												// Set 'src' only for regular MP4 files. HLS is handled by useEffect.
												{...(videoType === "regular" && { src: videoSrc })}
											>
												Your browser does not support the video tag.
											</video>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-center w-full h-64 mb-8 bg-gray-200 rounded-lg">
										<p className="text-gray-500">
											{t("no_video", { ns: "course_page" })}
										</p>
									</div>
								)}

								{/* Exercises Section */}
								<div>
									<h2 className="text-2xl font-bold text-base-content mb-4">
										{t("course_page.exercises")}
									</h2>
									{selectedLesson.exercises?.length > 0 ? (
										<ul className="space-y-4">
											{selectedLesson.exercises.map((exercise, index) => {
												const submission = exerciseSubmissions[exercise.id];
												const isSubmitted = !!submission;

												return (
													<li
														key={exercise.id}
														className="bg-neutral p-6 rounded-lg border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]"
													>
														<p className="font-semibold text-lg mb-4">
															{t("course_page.exercise_number", {
																number: index + 1,
															})}
														</p>
														<p className="text-base mb-4">
															{exercise.question}
														</p>

														{!isSubmitted ? (
															// --- Exercise Input Form ---
															<div className="space-y-3">
																<Input
																	type="text"
																	placeholder={t("course_page.your_answer")}
																	value={exerciseAnswers[exercise.id] || ""}
																	onChange={(e) =>
																		handleExerciseAnswerChange(
																			exercise.id,
																			e.target.value,
																		)
																	}
																	className="w-full"
																	disabled={submittingExercise === exercise.id}
																/>
																<Button
																	onClick={() =>
																		handleSubmitExercise(exercise.id)
																	}
																	disabled={
																		!exerciseAnswers[exercise.id]?.trim() ||
																		submittingExercise === exercise.id
																	}
																	className="w-full sm:w-auto"
																>
																	{submittingExercise === exercise.id ? (
																		<>
																			<FaSpinner className="animate-spin mr-2" />
																			{t("course_page.submitting")}
																		</>
																	) : (
																		t("course_page.submit_answer")
																	)}
																</Button>
															</div>
														) : (
															// --- Exercise Result ---
															<div className="space-y-3">
																<div
																	className={`p-4 rounded-lg ${submission.isCorrect
																			? "bg-green-100 border-2 border-green-500"
																			: "bg-red-100 border-2 border-red-500"
																		}`}
																>
																	<p className="font-semibold mb-2">
																		{submission.isCorrect ? (
																			<span className="text-green-700 flex items-center">
																				<FaCheckCircle className="mr-2" />
																				{t("course_page.correct")}
																			</span>
																		) : (
																			<span className="text-red-700 flex items-center">
																				<FaInfoCircle className="mr-2" />
																				{t("course_page.incorrect")}
																			</span>
																		)}
																	</p>
																	<p className="text-sm mb-2">
																		<strong>
																			{t("course_page.your_answer")}:
																		</strong>{" "}
																		{submission.submittedAnswer}
																	</p>
																	{!submission.isCorrect && (
																		<p className="text-sm">
																			<strong>
																				{t("course_page.correct_answer")}:
																			</strong>{" "}
																			{submission.correctAnswer}
																		</p>
																	)}
																</div>
															</div>
														)}
													</li>
												);
											})}
										</ul>
									) : (
										<p className="text-base-content/70">
											{t("course_page.no_exercises")}
										</p>
									)}
								</div>
							</motion.div>
						) : (
							// Shown if subscribed but no lesson is selected (e.g., course has 0 lessons)
							<div className="text-center p-10">
								<p className="text-base-content/70">
									{t("select_lesson", { ns: "course_page" })}
								</p>
							</div>
						)}
					</main>
				</div>
			) : (
				// --- NON-SUBSCRIBED VIEW (Course Landing Page) ---
				<div className="p-4 md:p-8 max-w-4xl mx-auto">
					{/* Display general error if one occurred during load */}
					{error && (
						<div className="p-4 mb-4 text-red-600 bg-red-100 rounded-md">
							Error: {error}
						</div>
					)}
					<div className="p-6 mb-6 bg-white rounded-lg shadow-md border border-neutral">
						{course.bannerImage && (
							<img
								src={`${API_URL}/${course.bannerImage}`}
								alt={course.title}
								className="w-full h-48 sm:h-64 object-cover rounded-md mb-6"
							/>
						)}
						<h1 className="text-2xl sm:text-3xl font-bold mb-2">
							{course.title}
						</h1>
						<p className="text-sm text-gray-500 mb-4">
							{t("dashboard.by", { ns: "translation" })}{" "}
							{course.teacher?.name || t("courses.instructor_unknown")}
						</p>
						<p className="text-gray-700 mb-6 leading-relaxed">
							{course.description}
						</p>

						{/* --- Promo Code Input Section --- */}
						{course.price != null && course.price > 0 && (
							<div className="mb-6 p-4 bg-gray-50 rounded-md border">
								<label
									htmlFor="promoCode"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									{t("course_page.promo_code.label")}{" "}
									<FaTag className="inline ml-1 text-gray-500" />
								</label>
								<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
									<Input
										type="text"
										id="promoCode"
										placeholder={t("course_page.promo_code.placeholder")}
										value={promoCodeInput}
										onChange={handlePromoCodeInputChange}
										className="flex-grow uppercase h-10 text-black"
										disabled={promoCodeValidation.status === "validating"}
									/>
									<Button
										onClick={handleValidatePromoCode}
										disabled={
											!promoCodeInput.trim() ||
											promoCodeValidation.status === "validating" ||
											promoCodeValidation.status === "valid"
										}
										className="flex-shrink-0 h-10 w-full sm:w-auto"
										variant="outline"
									>
										{promoCodeValidation.status === "validating" && (
											<FaSpinner className="animate-spin mr-2" />
										)}
										{promoCodeValidation.status === "valid"
											? t("course_page.promo_code.applied")
											: t("course_page.promo_code.validate_button")}
									</Button>
								</div>

								{/* Validation Message */}
								{promoCodeValidation.message && (
									<p
										className={`text-xs mt-1 ${promoCodeValidation.status === "invalid"
												? "text-error"
												: "text-success"
											}`}
									>
										{promoCodeValidation.message}
									</p>
								)}
							</div>
						)}

						{/* --- Price and Subscribe Button --- */}
						<div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
							<div className="text-center sm:text-left mb-3 sm:mb-0">
								{/* Strikethrough original price if promo is valid */}
								{promoCodeValidation.status === "valid" &&
									promoCodeValidation.discountedPrice !== null &&
									course.price > 0 &&
									promoCodeValidation.discountedPrice < course.price && (
										<p className="text-lg font-medium text-gray-500 line-through">{`${course.price}₮`}</p>
									)}

								{/* Display Final Price */}
								<p className="text-2xl font-bold text-primary">
									{isEffectivelyFree
										? t("free", { ns: "translation" })
										: `${displayPrice}₮`}
								</p>
							</div>

							<Button
								onClick={handleSubscribeClick}
								className="w-full sm:w-auto"
							>
								<FaBook className="mr-2" />
								{isEffectivelyFree
									? t("enroll_free", { ns: "course_page" })
									: t("dashboard.subscribe", { ns: "translation" })}
							</Button>
						</div>

						{/* Lesson Count */}
						{course.lessons && course.lessons.length > 0 && (
							<p className="text-sm text-gray-500 mt-6 flex items-center">
								<FaInfoCircle className="mr-2" /> Энэ сургалтад{" "}
								{course.lessons.length} хичээл багтсан.
							</p>
						)}
					</div>
				</div>
			)}

			{/* --- Subscription Modal --- */}
			{/* This modal is rendered outside the conditional logic 
        so it can be opened from the non-subscribed view.
      */}
			<SubscriptionModal
				course={course}
				isOpen={isSubscriptionModalOpen}
				finalPrice={displayPrice} // Pass the calculated final price
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
		</>
	);
};

export default CoursePage;
