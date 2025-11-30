import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTrophy } from "react-icons/fa";

function TestResultsPage() {
	const { testId, attemptId } = useParams();
	const { t } = useTranslation();

	const [attempt, setAttempt] = useState(null);
	const [certificate, setCertificate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchResults();
	}, [testId, attemptId]);

	const fetchResults = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await API.getTestResults(testId, attemptId);
			setAttempt(response.data.data);

			// Check if certificate was issued
			if (response.data.data.certificate) {
				setCertificate(response.data.data.certificate);
			}
		} catch (err) {
			console.error("Failed to fetch results:", err);
			setError(err.response?.data?.error || t("test.results.error_load"));
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto p-8 text-center">
				<div className="text-xl">{t("test.results.loading")}</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto p-8">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			</div>
		);
	}

	const score = parseFloat(attempt.score) || 0;
	const isPassed = score >= attempt.passingScore;
	const isGraded = attempt.status === "graded";
	const isCertificateTest = attempt.test?.issuesCertificate;

	return (
		<div className="max-w-4xl mx-auto p-8">
			{/* Results Summary */}
			<div className="bg-white shadow-md rounded-lg p-8 mb-6">
				<div className="text-center mb-6">
					{isGraded ? (
						isPassed ? (
							<div>
								<FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
								<h1 className="text-3xl font-bold text-green-600 mb-2">{t("test.results.congratulations")}</h1>
								<p className="text-gray-600">{t("test.results.passed")}</p>
							</div>
						) : (
							<div>
								<FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
								<h1 className="text-3xl font-bold text-red-600 mb-2">{t("test.results.not_passed")}</h1>
								<p className="text-gray-600">{t("test.results.keep_trying")}</p>
							</div>
						)
					) : (
						<div>
							<FaClock className="text-6xl text-blue-500 mx-auto mb-4" />
							<h1 className="text-3xl font-bold text-blue-600 mb-2">{t("test.results.submitted")}</h1>
							<p className="text-gray-600">{t("test.results.being_graded")}</p>
						</div>
					)}
				</div>

				{/* Score */}
				{isGraded && (
					<div className="grid grid-cols-3 gap-6 mt-8">
						<div className="text-center p-4 bg-gray-50 rounded-lg">
							<div className="text-3xl font-bold text-indigo-600">{score.toFixed(1)}%</div>
							<div className="text-sm text-gray-600 mt-1">{t("test.results.your_score")}</div>
						</div>
						<div className="text-center p-4 bg-gray-50 rounded-lg">
							<div className="text-3xl font-bold text-gray-700">{attempt.passingScore}%</div>
							<div className="text-sm text-gray-600 mt-1">{t("test.results.passing_score")}</div>
						</div>
						<div className="text-center p-4 bg-gray-50 rounded-lg">
							<div className="text-3xl font-bold text-gray-700">
								{attempt.earnedPoints}/{attempt.totalPoints}
							</div>
							<div className="text-sm text-gray-600 mt-1">{t("test.results.points")}</div>
						</div>
					</div>
				)}

				{/* Certificate */}
				{certificate && (
					<div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<FaTrophy className="text-3xl text-yellow-600 mr-4" />
								<div>
									<h3 className="text-lg font-bold text-gray-900">{t("test.results.certificate_earned")}</h3>
									<p className="text-sm text-gray-600">
										{t("test.results.certificate_id")}: {certificate.certificateId}
									</p>
								</div>
							</div>
							<Link
								to="/certificates"
								className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
							>
								{t("test.results.view_certificate")}
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Question Breakdown - Only show detailed breakdown for non-certificate tests */}
			{isGraded && attempt.answers && !isCertificateTest && (
				<div className="bg-white shadow-md rounded-lg p-6">
					<h2 className="text-2xl font-bold mb-6">{t("test.results.question_breakdown")}</h2>
					<div className="space-y-6">
						{attempt.answers.map((answer, index) => {
							const question = answer.question;
							const isCorrect = answer.isCorrect;

							return (
								<div
									key={answer.id}
									className={`p-6 rounded-lg border-2 ${
										isCorrect === null
											? "border-gray-300 bg-gray-50"
											: isCorrect
												? "border-green-300 bg-green-50"
												: "border-red-300 bg-red-50"
									}`}
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<h3 className="font-semibold text-lg mb-2">
												{t("test.taking.question")} {index + 1}
												{isCorrect !== null && (
													isCorrect ? (
														<FaCheckCircle className="inline-block ml-2 text-green-600" />
													) : (
														<FaTimesCircle className="inline-block ml-2 text-red-600" />
													)
												)}
											</h3>
											<div className="text-gray-800 prose prose-sm max-w-none">
												<ReactMarkdown>{question.questionText}</ReactMarkdown>
											</div>
										</div>
										<div className="text-right ml-4">
											<div className="text-sm font-medium">
												{answer.pointsEarned}/{question.points} {t("test.taking.pts")}
											</div>
										</div>
									</div>

									{/* Show user's answer */}
									<div className="mt-4">
										<div className="text-sm font-medium text-gray-700 mb-1">{t("test.results.your_answer")}:</div>
										<div className="text-gray-900">
											{question.questionType === "multiple_choice_single" && question.options && (
												<div>{question.options[answer.userAnswer]}</div>
											)}
											{question.questionType === "multiple_choice_multiple" && question.options && (
												<div>
													{Array.isArray(answer.userAnswer) && answer.userAnswer.length > 0
														? answer.userAnswer.map((idx) => question.options[idx]).join(", ")
														: t("test.results.no_answer")}
												</div>
											)}
											{question.questionType === "true_false" && (
												<div>{answer.userAnswer ? t("test.taking.true") : t("test.taking.false")}</div>
											)}
											{question.questionType === "short_answer" && (
												<div className="whitespace-pre-wrap">{answer.userAnswer || t("test.results.no_answer")}</div>
											)}
										</div>
									</div>

									{/* Show correct answer for auto-graded questions */}
									{!isCorrect && question.questionType !== "short_answer" && (
										<div className="mt-3 pt-3 border-t border-gray-300">
											<div className="text-sm font-medium text-green-700 mb-1">{t("test.results.correct_answer")}:</div>
											<div className="text-gray-900">
												{question.questionType === "multiple_choice_single" && question.options && (
													<div>{question.options[question.correctAnswer]}</div>
												)}
												{question.questionType === "multiple_choice_multiple" && question.options && (
													<div>
														{Array.isArray(question.correctAnswer)
															? question.correctAnswer.map((idx) => question.options[idx]).join(", ")
															: ""}
													</div>
												)}
												{question.questionType === "true_false" && (
													<div>{question.correctAnswer ? t("test.taking.true") : t("test.taking.false")}</div>
												)}
											</div>
										</div>
									)}

									{/* Teacher feedback for short answer */}
									{answer.feedback && (
										<div className="mt-3 pt-3 border-t border-gray-300">
											<div className="text-sm font-medium text-indigo-700 mb-1">{t("test.results.teacher_feedback")}:</div>
											<div className="text-gray-900">{answer.feedback}</div>
										</div>
									)}

									{/* Explanation */}
									{question.explanation && (
										<div className="mt-3 pt-3 border-t border-gray-300">
											<div className="text-sm font-medium text-gray-700 mb-1">{t("test.results.explanation")}:</div>
											<div className="text-gray-900">{question.explanation}</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Certificate Test Summary - Show limited info for certificate tests */}
			{isGraded && isCertificateTest && (
				<div className="bg-white shadow-md rounded-lg p-6">
					<h2 className="text-2xl font-bold mb-6">{t("test.results.test_summary", { defaultValue: "Test Summary" })}</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-blue-800">
							{t("test.results.certificate_test_note", {
								defaultValue: "This is a certificate test. Detailed answers are not shown to maintain the integrity of the certification process."
							})}
						</p>
					</div>
					<div className="mt-4 text-gray-600">
						<p>{t("test.results.questions_answered", { count: attempt.answers?.length || 0, defaultValue: `You answered ${attempt.answers?.length || 0} questions.` })}</p>
					</div>
				</div>
			)}

			{/* Actions */}
			<div className="mt-8 flex justify-between">
				<Link
					to="/courses"
					className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
				>
					{t("test.results.back_to_courses")}
				</Link>
				{!isPassed && (
					<Link
						to={`/tests/${testId}`}
						className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
					>
						{t("test.results.try_again")}
					</Link>
				)}
			</div>
		</div>
	);
}

export default TestResultsPage;
