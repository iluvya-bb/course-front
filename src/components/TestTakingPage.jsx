import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
	FaSpinner,
	FaGraduationCap,
	FaClock,
	FaStar,
	FaCheckCircle,
	FaBook,
	FaHistory,
	FaTimesCircle,
	FaEye,
	FaCertificate,
	FaExclamationTriangle,
	FaPlayCircle,
	FaArrowLeft,
	FaRedo,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import API from "../services/api";

function TestTakingPage() {
	const { testId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [test, setTest] = useState(null);
	const [attempt, setAttempt] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [previousAttempts, setPreviousAttempts] = useState([]);
	const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(true);
	const [userAttempts, setUserAttempts] = useState([]);
	const [startingTest, setStartingTest] = useState(false);

	// Fetch test info and user's attempts first
	useEffect(() => {
		fetchTestInfo();
	}, [testId]);

	const fetchTestInfo = async () => {
		setLoading(true);
		setError("");
		try {
			const [testRes, attemptsRes] = await Promise.all([
				API.getTest(testId),
				API.getUserAttempts(testId),
			]);
			setTest(testRes.data.data);
			const attempts = attemptsRes.data.data || [];
			setUserAttempts(attempts);

			// Check if there's an in-progress attempt
			const inProgressAttempt = attempts.find(a => a.status === 'in_progress');
			if (inProgressAttempt) {
				// Resume the test directly
				setShowConfirmation(false);
				await resumeTest();
			} else {
				// Check if max attempts reached
				const maxAttempts = testRes.data.data.maxAttempts || 3;
				const completedAttempts = attempts.filter(a => a.status !== 'in_progress').length;
				if (completedAttempts >= maxAttempts) {
					setPreviousAttempts(attempts);
					setMaxAttemptsReached(true);
					setShowConfirmation(false);
				}
			}
		} catch (err) {
			console.error("Failed to fetch test info:", err);
			setError(err.response?.data?.error || t("test.taking.failed_to_load"));
		} finally {
			setLoading(false);
		}
	};

	const resumeTest = async () => {
		try {
			const response = await API.startTest(testId);
			setAttempt(response.data.data.attempt);
			setQuestions(response.data.data.questions);
			setTest(response.data.data.attempt.test);

			const initialAnswers = {};
			response.data.data.questions.forEach((q) => {
				initialAnswers[q.id] = null;
			});
			setAnswers(initialAnswers);
		} catch (err) {
			console.error("Failed to resume test:", err);
			setError(err.response?.data?.error || t("test.taking.failed_to_start"));
		}
	};

	// Timer countdown
	useEffect(() => {
		if (!attempt || !attempt.expiresAt) return;

		const timer = setInterval(() => {
			const now = new Date();
			const expiresAt = new Date(attempt.expiresAt);
			const diff = expiresAt - now;

			if (diff <= 0) {
				setTimeRemaining(0);
				handleSubmit();
			} else {
				setTimeRemaining(Math.floor(diff / 1000)); // seconds
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [attempt]);

	const handleStartTest = async () => {
		setStartingTest(true);
		setError("");
		try {
			const response = await API.startTest(testId);
			setAttempt(response.data.data.attempt);
			setQuestions(response.data.data.questions);
			setTest(response.data.data.attempt.test);

			// Initialize answers
			const initialAnswers = {};
			response.data.data.questions.forEach((q) => {
				initialAnswers[q.id] = null;
			});
			setAnswers(initialAnswers);
			setShowConfirmation(false);
		} catch (err) {
			console.error("Failed to start test:", err);
			const errorMessage = err.response?.data?.error || "";

			// Check if error is about max attempts reached
			if (errorMessage.toLowerCase().includes("maximum") ||
				errorMessage.toLowerCase().includes("attempt") ||
				err.response?.status === 403) {
				setPreviousAttempts(userAttempts);
				setMaxAttemptsReached(true);
				setShowConfirmation(false);
			} else {
				setError(errorMessage || t("test.taking.failed_to_start"));
			}
		} finally {
			setStartingTest(false);
		}
	};

	const handleAnswerChange = (questionId, answer) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: answer,
		}));
	};

	const handleMultipleChoiceMultipleChange = (questionId, optionIndex) => {
		setAnswers((prev) => {
			const current = prev[questionId] || [];
			const newAnswer = current.includes(optionIndex)
				? current.filter((idx) => idx !== optionIndex)
				: [...current, optionIndex];
			return {
				...prev,
				[questionId]: newAnswer,
			};
		});
	};

	const handleSubmit = async (e) => {
		if (e) e.preventDefault();

		if (!window.confirm(t("test.taking.submit_confirmation"))) {
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			const response = await API.submitTest(testId, {
				attemptId: attempt.id,
				answers,
			});

			// Navigate to results page
			navigate(`/tests/${testId}/results/${attempt.id}`);
		} catch (err) {
			console.error("Failed to submit test:", err);
			setError(err.response?.data?.error || t("test.taking.failed_to_submit"));
			setSubmitting(false);
		}
	};

	const formatTime = (seconds) => {
		if (seconds === null) return "";
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center"
				>
					<FaSpinner className="animate-spin text-brand-lavender mx-auto h-12 w-12 mb-4" />
					<span className="text-base-content text-lg">{t("test.taking.starting")}</span>
				</motion.div>
			</div>
		);
	}

	if (error && !attempt && !maxAttemptsReached && !showConfirmation) {
		return (
			<div className="max-w-4xl mx-auto p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-md"
				>
					{error}
				</motion.div>
			</div>
		);
	}

	// Show confirmation screen before starting test
	if (showConfirmation && test && !maxAttemptsReached) {
		const completedAttempts = userAttempts.filter(a => a.status !== 'in_progress').length;
		const remainingAttempts = (test.maxAttempts || 3) - completedAttempts;

		return (
			<div className="relative min-h-screen">
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

				<div className="relative z-10 max-w-2xl mx-auto p-4 md:p-8">
					{/* Test Info Card */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-neutral rounded-2xl border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] p-8 mb-6"
					>
						<div className="flex items-center gap-4 mb-6">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center">
								<FaGraduationCap className="text-white text-3xl" />
							</div>
							<div>
								<h1 className="text-3xl font-black text-base-content">{test.title}</h1>
								{test.description && (
									<p className="text-base-content/70 mt-1">{test.description}</p>
								)}
							</div>
						</div>

						{/* Test Details */}
						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 p-4 rounded-xl border-2 border-brand-lavender/30">
								<div className="flex items-center gap-2 mb-1">
									<FaBook className="text-brand-lavender" />
									<span className="text-sm font-bold text-base-content/70">{t("test.confirmation.questions")}</span>
								</div>
								<p className="text-2xl font-black text-base-content">{test.numberOfQuestions || "?"}</p>
							</div>
							<div className="bg-gradient-to-br from-brand-coral/10 to-brand-yellow/10 p-4 rounded-xl border-2 border-brand-coral/30">
								<div className="flex items-center gap-2 mb-1">
									<FaStar className="text-brand-coral" />
									<span className="text-sm font-bold text-base-content/70">{t("test.confirmation.passing_score")}</span>
								</div>
								<p className="text-2xl font-black text-base-content">{test.passingScore}%</p>
							</div>
							{test.timeLimit && (
								<div className="bg-gradient-to-br from-brand-yellow/10 to-brand-lavender/10 p-4 rounded-xl border-2 border-brand-yellow/30">
									<div className="flex items-center gap-2 mb-1">
										<FaClock className="text-brand-yellow" />
										<span className="text-sm font-bold text-base-content/70">{t("test.confirmation.time_limit")}</span>
									</div>
									<p className="text-2xl font-black text-base-content">{test.timeLimit} {t("test.confirmation.minutes")}</p>
								</div>
							)}
							<div className={`p-4 rounded-xl border-2 ${
								remainingAttempts > 1
									? "bg-green-50 border-green-300"
									: remainingAttempts === 1
										? "bg-yellow-50 border-yellow-300"
										: "bg-red-50 border-red-300"
							}`}>
								<div className="flex items-center gap-2 mb-1">
									<FaRedo className={remainingAttempts > 1 ? "text-green-600" : remainingAttempts === 1 ? "text-yellow-600" : "text-red-600"} />
									<span className="text-sm font-bold text-base-content/70">{t("test.confirmation.attempts_remaining")}</span>
								</div>
								<p className="text-2xl font-black text-base-content">{remainingAttempts} / {test.maxAttempts || 3}</p>
							</div>
						</div>

						{/* Certificate Badge */}
						{test.issuesCertificate && (
							<div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-yellow/20 to-brand-coral/20 rounded-xl border-2 border-brand-yellow/40 mb-6">
								<FaCertificate className="text-brand-yellow text-2xl" />
								<p className="font-bold text-base-content">{t("test.confirmation.certificate_info")}</p>
							</div>
						)}
					</motion.div>

					{/* Warning Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-yellow-50 rounded-2xl border-2 border-yellow-400 p-6 mb-6"
					>
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
								<FaExclamationTriangle className="text-white text-xl" />
							</div>
							<div>
								<h3 className="text-lg font-black text-yellow-800 mb-2">{t("test.confirmation.warning_title")}</h3>
								<ul className="space-y-2 text-yellow-700">
									<li className="flex items-start gap-2">
										<span className="font-bold">•</span>
										<span>{t("test.confirmation.warning_1")}</span>
									</li>
									{test.timeLimit && (
										<li className="flex items-start gap-2">
											<span className="font-bold">•</span>
											<span>{t("test.confirmation.warning_2", { minutes: test.timeLimit })}</span>
										</li>
									)}
									<li className="flex items-start gap-2">
										<span className="font-bold">•</span>
										<span>{t("test.confirmation.warning_3")}</span>
									</li>
									{remainingAttempts === 1 && (
										<li className="flex items-start gap-2 font-bold text-red-600">
											<span>•</span>
											<span>{t("test.confirmation.warning_last_attempt")}</span>
										</li>
									)}
								</ul>
							</div>
						</div>
					</motion.div>

					{/* Error Message */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6"
						>
							{error}
						</motion.div>
					)}

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="flex flex-col sm:flex-row gap-4"
					>
						<button
							onClick={() => navigate(-1)}
							className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-base-200 hover:bg-base-300 text-base-content font-bold rounded-full transition-all"
						>
							<FaArrowLeft />
							{t("test.confirmation.go_back")}
						</button>
						<button
							onClick={handleStartTest}
							disabled={startingTest}
							className="flex-1 flex items-center justify-center gap-2 px-8 py-4 text-lg font-black text-white bg-gradient-to-r from-brand-lavender to-brand-coral rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{startingTest ? (
								<>
									<FaSpinner className="animate-spin" />
									{t("test.confirmation.starting")}
								</>
							) : (
								<>
									<FaPlayCircle />
									{t("test.confirmation.start_test")}
								</>
							)}
						</button>
					</motion.div>
				</div>
			</div>
		);
	}

	// Show previous attempts when max attempts reached
	if (maxAttemptsReached && previousAttempts.length > 0) {
		const bestAttempt = previousAttempts.reduce((best, current) =>
			(Number(current.score) || 0) > (Number(best.score) || 0) ? current : best
		, previousAttempts[0]);

		// Calculate pass status based on score vs passingScore
		const isPassed = (attempt) => {
			const score = Number(attempt.score) || 0;
			const passingScore = Number(attempt.passingScore) || Number(test?.passingScore) || 70;
			return score >= passingScore;
		};
		const isWaitingForGrading = (attempt) => attempt.status === 'completed';
		const isGraded = (attempt) => attempt.status === 'graded';
		const hasPassed = previousAttempts.some(a => isGraded(a) && isPassed(a));

		return (
			<div className="relative min-h-screen">
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

				<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] p-6 mb-8"
					>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center">
								<FaHistory className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-3xl font-black text-base-content">{test?.title}</h1>
								<p className="text-base-content/60">{t("test.taking.all_attempts_used")}</p>
							</div>
						</div>

						{/* Summary Stats */}
						<div className="flex flex-wrap gap-4 text-sm mb-6">
							<div className="flex items-center gap-2 bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 px-4 py-2 rounded-full border-2 border-brand-lavender/30">
								<FaBook className="text-brand-lavender" />
								<span className="font-bold text-base-content">
									{t("test.taking.total_attempts")}: <span className="text-brand-lavender">{previousAttempts.length}/{test?.maxAttempts || 3}</span>
								</span>
							</div>
							<div className="flex items-center gap-2 bg-gradient-to-br from-brand-coral/10 to-brand-yellow/10 px-4 py-2 rounded-full border-2 border-brand-coral/30">
								<FaStar className="text-brand-coral" />
								<span className="font-bold text-base-content">
									{t("test.taking.best_score")}: <span className="text-brand-coral">{bestAttempt?.score != null ? Number(bestAttempt.score).toFixed(1) : 0}%</span>
								</span>
							</div>
							<div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold ${
								hasPassed
									? "bg-green-100 border-green-400 text-green-700"
									: "bg-red-100 border-red-400 text-red-700"
							}`}>
								{hasPassed ? <FaCheckCircle /> : <FaTimesCircle />}
								<span>{hasPassed ? t("test.taking.passed") : t("test.taking.not_passed")}</span>
							</div>
						</div>

						{/* Certificate Info */}
						{test?.issuesCertificate && hasPassed && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="p-4 bg-gradient-to-r from-brand-yellow/20 to-brand-coral/20 rounded-xl border-2 border-brand-yellow/40 flex items-center gap-3"
							>
								<FaCertificate className="text-brand-yellow text-2xl" />
								<div>
									<p className="font-bold text-base-content">{t("test.taking.certificate_earned")}</p>
									<Link to="/certificates" className="text-brand-coral hover:underline text-sm font-medium">
										{t("test.taking.view_certificates")} →
									</Link>
								</div>
							</motion.div>
						)}
					</motion.div>

					{/* Attempts List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
							<FaHistory className="text-brand-lavender" />
							{t("test.taking.your_attempts")}
						</h2>

						<div className="space-y-4">
							{previousAttempts.map((attempt, index) => (
								<motion.div
									key={attempt.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`bg-neutral rounded-xl border-2 p-5 transition-all hover:shadow-lg ${
										isWaitingForGrading(attempt)
											? "border-yellow-300 shadow-[4px_4px_0px_#eab308]"
											: isPassed(attempt)
												? "border-green-300 shadow-[4px_4px_0px_#22c55e]"
												: "border-red-300 shadow-[4px_4px_0px_#ef4444]"
									}`}
								>
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
										<div className="flex items-center gap-4">
											<div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white ${
												isWaitingForGrading(attempt)
													? "bg-gradient-to-br from-yellow-400 to-yellow-600"
													: isPassed(attempt)
														? "bg-gradient-to-br from-green-400 to-green-600"
														: "bg-gradient-to-br from-red-400 to-red-600"
											}`}>
												#{index + 1}
											</div>
											<div>
												<div className="flex items-center gap-2 mb-1">
													<span className="text-2xl font-black text-base-content">
														{isWaitingForGrading(attempt) ? "-" : `${attempt.score != null ? Number(attempt.score).toFixed(1) : 0}%`}
													</span>
													<span className={`px-3 py-1 rounded-full text-xs font-bold ${
														isWaitingForGrading(attempt)
															? "bg-yellow-100 text-yellow-700"
															: isPassed(attempt)
																? "bg-green-100 text-green-700"
																: "bg-red-100 text-red-700"
													}`}>
														{isWaitingForGrading(attempt)
															? t("test.taking.waiting_for_grading")
															: isPassed(attempt)
																? t("test.taking.passed")
																: t("test.taking.failed")}
													</span>
												</div>
												<p className="text-sm text-base-content/60">
													{new Date(attempt.completedAt || attempt.createdAt).toLocaleString()}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="text-right mr-4">
												<p className="text-sm text-base-content/60">{t("test.taking.passing_score")}</p>
												<p className="font-bold text-base-content">{attempt.passingScore || test?.passingScore}%</p>
											</div>
											<Link
												to={`/tests/${testId}/results/${attempt.id}`}
												className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
											>
												<FaEye />
												{t("test.taking.view_results")}
											</Link>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Back Button */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="mt-8 text-center"
					>
						<button
							onClick={() => navigate(-1)}
							className="px-6 py-3 bg-base-200 hover:bg-base-300 text-base-content font-bold rounded-full transition-all"
						>
							← {t("test.taking.go_back")}
						</button>
					</motion.div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen">
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
					className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-lavender/10 blur-3xl"
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
					className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl"
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

			{/* Content */}
			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
				{/* Test Header */}
				<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] p-6 mb-8"
			>
				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center">
						<FaGraduationCap className="text-white text-2xl" />
					</div>
					<h1 className="text-3xl font-black text-base-content">{test?.title || t("test.taking.test")}</h1>
				</div>
				{test?.description && (
					<p className="text-base-content/80 mb-4">{test.description}</p>
				)}
				<div className="flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2 bg-gradient-to-br from-brand-lavender/10 to-brand-coral/10 px-4 py-2 rounded-full border-2 border-brand-lavender/30">
						<FaBook className="text-brand-lavender" />
						<span className="font-bold text-base-content">
							{t("test.taking.questions")}: <span className="text-brand-lavender">{questions.length}</span>
						</span>
					</div>
					<div className="flex items-center gap-2 bg-gradient-to-br from-brand-coral/10 to-brand-yellow/10 px-4 py-2 rounded-full border-2 border-brand-coral/30">
						<FaStar className="text-brand-coral" />
						<span className="font-bold text-base-content">
							{t("test.taking.passing_score")}: <span className="text-brand-coral">{attempt?.passingScore}%</span>
						</span>
					</div>
					{timeRemaining !== null && (
						<div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold ${
							timeRemaining < 300
								? "bg-red-100 border-red-400 text-red-700"
								: "bg-green-100 border-green-400 text-green-700"
						}`}>
							<FaClock />
							<span>{t("test.taking.time_remaining")}: {formatTime(timeRemaining)}</span>
						</div>
					)}
				</div>
			</motion.div>

			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-md mb-6"
				>
					{error}
				</motion.div>
			)}

			{/* Questions */}
			<form onSubmit={handleSubmit}>
				<div className="space-y-6">
					{questions.map((question, index) => (
						<motion.div
							key={question.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-neutral rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A] p-6"
						>
							<div className="mb-4">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral text-white flex items-center justify-center font-bold text-sm">
											{index + 1}
										</div>
										<h3 className="text-lg font-bold text-base-content">
											{t("test.taking.question")} {index + 1}
										</h3>
									</div>
									<span className="px-3 py-1 bg-brand-yellow/20 border-2 border-brand-yellow/40 text-brand-yellow rounded-full text-sm font-bold">
										{question.points} {t("test.taking.pts")}
									</span>
								</div>
								<div className="text-base-content text-lg leading-relaxed prose prose-lg max-w-none">
									<ReactMarkdown>{question.questionText}</ReactMarkdown>
								</div>
							</div>

							{/* Multiple Choice Single */}
							{question.questionType === "multiple_choice_single" && question.options && (
								<div className="space-y-3">
									{question.options.map((option, idx) => (
										<label
											key={idx}
											className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
												answers[question.id] === idx
													? "border-brand-lavender bg-brand-lavender/10"
													: "border-base-content/20 hover:border-brand-lavender/50 hover:bg-base-100"
											}`}
										>
											<input
												type="radio"
												name={`question-${question.id}`}
												value={idx}
												checked={answers[question.id] === idx}
												onChange={() => handleAnswerChange(question.id, idx)}
												className="mr-3 h-5 w-5 text-brand-lavender accent-brand-lavender"
											/>
											<span className="text-base-content font-medium">{option}</span>
										</label>
									))}
								</div>
							)}

							{/* Multiple Choice Multiple */}
							{question.questionType === "multiple_choice_multiple" && question.options && (
								<div className="space-y-3">
									<p className="text-sm text-brand-coral font-bold mb-3 flex items-center gap-2">
										<FaCheckCircle />
										{t("test.taking.select_all_that_apply")}
									</p>
									{question.options.map((option, idx) => (
										<label
											key={idx}
											className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
												Array.isArray(answers[question.id]) && answers[question.id].includes(idx)
													? "border-brand-coral bg-brand-coral/10"
													: "border-base-content/20 hover:border-brand-coral/50 hover:bg-base-100"
											}`}
										>
											<input
												type="checkbox"
												checked={Array.isArray(answers[question.id]) && answers[question.id].includes(idx)}
												onChange={() => handleMultipleChoiceMultipleChange(question.id, idx)}
												className="mr-3 h-5 w-5 text-brand-coral accent-brand-coral rounded"
											/>
											<span className="text-base-content font-medium">{option}</span>
										</label>
									))}
								</div>
							)}

							{/* True/False */}
							{question.questionType === "true_false" && (
								<div className="space-y-3">
									<label
										className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
											answers[question.id] === true
												? "border-green-500 bg-green-50"
												: "border-base-content/20 hover:border-green-400 hover:bg-base-100"
										}`}
									>
										<input
											type="radio"
											name={`question-${question.id}`}
											value="true"
											checked={answers[question.id] === true}
											onChange={() => handleAnswerChange(question.id, true)}
											className="mr-3 h-5 w-5 text-green-500 accent-green-500"
										/>
										<span className="text-base-content font-bold">{t("test.taking.true")}</span>
									</label>
									<label
										className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
											answers[question.id] === false
												? "border-red-500 bg-red-50"
												: "border-base-content/20 hover:border-red-400 hover:bg-base-100"
										}`}
									>
										<input
											type="radio"
											name={`question-${question.id}`}
											value="false"
											checked={answers[question.id] === false}
											onChange={() => handleAnswerChange(question.id, false)}
											className="mr-3 h-5 w-5 text-red-500 accent-red-500"
										/>
										<span className="text-base-content font-bold">{t("test.taking.false")}</span>
									</label>
								</div>
							)}

							{/* Short Answer */}
							{question.questionType === "short_answer" && (
								<textarea
									value={answers[question.id] || ""}
									onChange={(e) => handleAnswerChange(question.id, e.target.value)}
									rows="4"
									placeholder={t("test.taking.enter_answer_placeholder")}
									className="w-full px-4 py-3 border-2 border-base-content/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-lavender focus:border-brand-lavender bg-base-100 text-base-content font-medium"
								/>
							)}
						</motion.div>
					))}
				</div>

				{/* Submit Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="mt-8 flex justify-end"
				>
					<button
						type="submit"
						disabled={submitting}
						className="flex items-center gap-2 px-8 py-4 text-lg font-black text-white bg-gradient-to-r from-brand-lavender to-brand-coral rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						{submitting ? (
							<>
								<FaSpinner className="animate-spin" />
								{t("test.taking.submitting")}
							</>
						) : (
							<>
								<FaGraduationCap />
								{t("test.taking.submit_test")}
							</>
						)}
					</button>
				</motion.div>
			</form>
			</div>
		</div>
	);
}

export default TestTakingPage;
