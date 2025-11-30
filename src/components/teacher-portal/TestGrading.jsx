import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  FaArrowLeft,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSave,
  FaClipboardCheck,
  FaPercent,
  FaFilter,
} from "react-icons/fa";
import API from "../../services/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const TestGrading = () => {
  const { t } = useTranslation();
  const { courseId, testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [grades, setGrades] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchData();
  }, [testId, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch test details
      const testRes = await API.getTest(testId);
      setTest(testRes.data.data);

      // Fetch attempts for this test
      const attemptsRes = await API.getAllTestAttempts({
        testId,
        status: statusFilter,
        limit: 100,
      });
      setAttempts(attemptsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptDetails = async (attempt) => {
    try {
      setLoadingDetails(true);
      setSelectedAttempt(attempt);

      // Fetch detailed results for this attempt
      const response = await API.getTestResults(testId, attempt.id);
      setAttemptDetails(response.data.data);

      // Initialize grades from existing answers
      const initialGrades = {};
      if (response.data.data.answers) {
        response.data.data.answers.forEach((answer) => {
          initialGrades[answer.id] = {
            pointsEarned: answer.pointsEarned || 0,
            feedback: answer.feedback || "",
          };
        });
      }
      setGrades(initialGrades);
    } catch (error) {
      console.error("Failed to fetch attempt details:", error);
      alert(t("teacher.grading.load_failed"));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleGradeChange = (answerId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value,
      },
    }));
  };

  const handleSubmitGrades = async () => {
    if (!selectedAttempt) return;

    setSaving(true);
    try {
      const gradesArray = Object.entries(grades).map(([answerId, grade]) => ({
        answerId: parseInt(answerId),
        pointsEarned: parseFloat(grade.pointsEarned) || 0,
        feedback: grade.feedback || null,
      }));

      await API.gradeAttempt(testId, selectedAttempt.id, { grades: gradesArray });
      alert(t("teacher.grading.save_success"));

      // Refresh data
      setSelectedAttempt(null);
      setAttemptDetails(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save grades:", error);
      alert(error.response?.data?.error || t("teacher.grading.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status, gradedAt) => {
    if (status === "completed" && !gradedAt) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
          <FaHourglassHalf />
          {t("teacher.grading.status_pending")}
        </span>
      );
    }

    const badges = {
      in_progress: {
        color: "bg-blue-100 text-blue-800",
        icon: FaClock,
        label: t("teacher.grading.status_in_progress"),
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: FaCheckCircle,
        label: t("teacher.grading.status_completed"),
      },
      graded: {
        color: "bg-purple-100 text-purple-800",
        icon: FaClipboardCheck,
        label: t("teacher.grading.status_graded"),
      },
      expired: {
        color: "bg-red-100 text-red-800",
        icon: FaTimesCircle,
        label: t("teacher.grading.status_expired"),
      },
    };

    const badge = badges[status] || badges.completed;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}
      >
        <Icon />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">{t("teacher.grading.loading")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/teacher/courses/${courseId}/tests`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {test?.title} - {t("teacher.grading.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("teacher.grading.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-4">
          <FaFilter className="text-gray-400" />
          <Label>{t("teacher.grading.filter_status")}</Label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="pending">{t("teacher.grading.status_pending")}</option>
            <option value="completed">{t("teacher.grading.status_completed")}</option>
            <option value="graded">{t("teacher.grading.status_graded")}</option>
            <option value="in_progress">{t("teacher.grading.status_in_progress")}</option>
            <option value="">{t("teacher.grading.status_all")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attempts List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {t("teacher.grading.attempts_list", { count: attempts.length })}
          </h2>

          {attempts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaClipboardCheck className="text-5xl mx-auto mb-3 text-gray-300" />
              <p>{t("teacher.grading.no_attempts")}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {attempts.map((attempt) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => fetchAttemptDetails(attempt)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedAttempt?.id === attempt.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span className="font-medium">
                        {attempt.user?.username || t("teacher.grading.unknown_user")}
                      </span>
                    </div>
                    {getStatusBadge(attempt.status, attempt.gradedAt)}
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      {t("teacher.grading.started")}: {formatDate(attempt.startedAt)}
                    </p>
                    {attempt.submittedAt && (
                      <p>
                        {t("teacher.grading.submitted")}: {formatDate(attempt.submittedAt)}
                      </p>
                    )}
                    {attempt.score != null && (
                      <p className="flex items-center gap-1">
                        <FaPercent className="text-xs" />
                        {t("teacher.grading.score")}: {Number(attempt.score).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Grading Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {t("teacher.grading.grading_panel")}
          </h2>

          {!selectedAttempt ? (
            <div className="text-center py-12 text-gray-500">
              <FaClipboardCheck className="text-5xl mx-auto mb-3 text-gray-300" />
              <p>{t("teacher.grading.select_attempt")}</p>
            </div>
          ) : loadingDetails ? (
            <div className="text-center py-12">
              {t("teacher.grading.loading_details")}
            </div>
          ) : attemptDetails ? (
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {/* Attempt Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">{t("teacher.grading.student")}:</span>
                    <span className="ml-2 font-medium">{attemptDetails.user?.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("teacher.grading.current_score")}:</span>
                    <span className="ml-2 font-medium">
                      {attemptDetails.score != null ? Number(attemptDetails.score).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("teacher.grading.passing_score")}:</span>
                    <span className="ml-2 font-medium">{attemptDetails.passingScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("teacher.grading.points")}:</span>
                    <span className="ml-2 font-medium">
                      {attemptDetails.earnedPoints || 0} / {attemptDetails.totalPoints || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Answers to Grade */}
              <div className="space-y-4">
                {attemptDetails.answers?.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={`border-2 rounded-xl p-4 ${
                      answer.question?.questionType === "short_answer"
                        ? "border-orange-200 bg-orange-50/50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {t("teacher.grading.question")} #{index + 1}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {answer.question?.points || 0} {t("teacher.grading.pts")}
                      </span>
                    </div>

                    {/* Question Text */}
                    <div className="prose prose-sm max-w-none mb-3">
                      <ReactMarkdown>
                        {answer.question?.questionText || ""}
                      </ReactMarkdown>
                    </div>

                    {/* Student's Answer */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <Label className="text-xs text-gray-500 mb-1">
                        {t("teacher.grading.student_answer")}
                      </Label>
                      <div className="text-gray-800">
                        {answer.question?.questionType === "short_answer" ? (
                          <p className="whitespace-pre-wrap">{answer.userAnswer || "-"}</p>
                        ) : answer.question?.questionType === "true_false" ? (
                          <p>{answer.userAnswer ? t("teacher.questions.true") : t("teacher.questions.false")}</p>
                        ) : (
                          <p>
                            {Array.isArray(answer.userAnswer)
                              ? answer.userAnswer
                                  .map((idx) => answer.question?.options?.[idx])
                                  .join(", ")
                              : answer.question?.options?.[answer.userAnswer] || "-"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer (for reference) */}
                    {answer.question?.questionType !== "short_answer" && (
                      <div className="bg-green-50 rounded-lg p-3 mb-3">
                        <Label className="text-xs text-green-600 mb-1">
                          {t("teacher.grading.correct_answer")}
                        </Label>
                        <div className="text-green-800">
                          {answer.question?.questionType === "true_false" ? (
                            <p>
                              {answer.question.correctAnswer
                                ? t("teacher.questions.true")
                                : t("teacher.questions.false")}
                            </p>
                          ) : (
                            <p>
                              {Array.isArray(answer.question?.correctAnswer)
                                ? answer.question.correctAnswer
                                    .map((idx) => answer.question?.options?.[idx])
                                    .join(", ")
                                : answer.question?.options?.[answer.question?.correctAnswer] || "-"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Grading inputs for short answer */}
                    {answer.question?.questionType === "short_answer" && (
                      <>
                        {answer.question?.correctAnswer && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <Label className="text-xs text-blue-600 mb-1">
                              {t("teacher.grading.expected_answer")}
                            </Label>
                            <p className="text-blue-800 whitespace-pre-wrap">
                              {answer.question.correctAnswer}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`points-${answer.id}`}>
                              {t("teacher.grading.points_earned")} (max: {answer.question?.points})
                            </Label>
                            <Input
                              id={`points-${answer.id}`}
                              type="number"
                              min="0"
                              max={answer.question?.points || 0}
                              step="0.5"
                              value={grades[answer.id]?.pointsEarned || 0}
                              onChange={(e) =>
                                handleGradeChange(answer.id, "pointsEarned", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`feedback-${answer.id}`}>
                              {t("teacher.grading.feedback")}
                            </Label>
                            <Input
                              id={`feedback-${answer.id}`}
                              value={grades[answer.id]?.feedback || ""}
                              onChange={(e) =>
                                handleGradeChange(answer.id, "feedback", e.target.value)
                              }
                              placeholder={t("teacher.grading.feedback_placeholder")}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Auto-graded status */}
                    {answer.question?.questionType !== "short_answer" && (
                      <div className="flex items-center gap-2 text-sm">
                        {answer.isCorrect ? (
                          <>
                            <FaCheckCircle className="text-green-500" />
                            <span className="text-green-600">
                              {t("teacher.grading.correct")} (+{answer.pointsEarned || 0})
                            </span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-red-500" />
                            <span className="text-red-600">
                              {t("teacher.grading.incorrect")}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitGrades}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaSave />
                <span>
                  {saving
                    ? t("teacher.grading.saving")
                    : t("teacher.grading.save_grades")}
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TestGrading;
