import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
	FaSpinner,
	FaGraduationCap,
	FaClock,
	FaStar,
	FaCheckCircle,
	FaBook,
} from "react-icons/fa";
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

	useEffect(() => {
		startOrResumeTest();
	}, [testId]);

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

	const startOrResumeTest = async () => {
		setLoading(true);
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
		} catch (err) {
			console.error("Failed to start test:", err);
			setError(err.response?.data?.error || t("test.taking.failed_to_start"));
		} finally {
			setLoading(false);
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

	if (error && !attempt) {
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
								<p className="text-base-content text-lg leading-relaxed">{question.questionText}</p>
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
