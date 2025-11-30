import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaQuestionCircle,
  FaCheckCircle,
  FaTimes,
  FaListOl,
  FaCheckSquare,
  FaToggleOn,
  FaAlignLeft,
  FaEye,
} from "react-icons/fa";
import API, { API_URL } from "../../services/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const QUESTION_TYPES = [
  { value: "multiple_choice_single", icon: FaListOl, color: "blue" },
  { value: "multiple_choice_multiple", icon: FaCheckSquare, color: "purple" },
  { value: "true_false", icon: FaToggleOn, color: "green" },
  { value: "short_answer", icon: FaAlignLeft, color: "orange" },
];

const QuestionManagement = () => {
  const { t } = useTranslation();
  const { courseId, testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState({
    questionText: "",
    questionType: "multiple_choice_single",
    options: ["", "", "", ""],
    correctAnswer: [],
    points: 1,
    explanation: "",
  });

  // Image upload function for SimpleMDE
  const imageUploadFunction = (file, onSuccess, onError) => {
    const data = new FormData();
    data.append("image", file);

    API.uploadEditorImage(data)
      .then((response) => {
        const url = `${API_URL}/${response.data.data.url}`;
        onSuccess(url);
      })
      .catch((err) => {
        console.error("Image upload failed:", err);
        onError(new Error("Image upload failed"));
      });
  };

  // Editor options with image upload enabled
  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      uploadImage: true,
      imageUploadFunction: imageUploadFunction,
      placeholder: t("teacher.questions.editor_placeholder"),
      autosave: {
        enabled: false,
      },
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
    };
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [testId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch test details
      const testRes = await API.getTest(testId);
      setTest(testRes.data.data);

      // Fetch questions for this test
      const questionsRes = await API.getQuestions({ testId });
      setQuestions(questionsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options || ["", "", "", ""],
      correctAnswer: Array.isArray(question.correctAnswer)
        ? question.correctAnswer.map(String)
        : [String(question.correctAnswer)],
      points: question.points || 1,
      explanation: question.explanation || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    try {
      await API.deleteQuestion(questionId);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert(
        error.response?.data?.error || t("teacher.questions.delete_failed")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data based on question type
      let correctAnswer = formData.correctAnswer;
      let options = formData.options;

      if (formData.questionType === "true_false") {
        options = null;
        correctAnswer = formData.correctAnswer[0] === "true";
      } else if (formData.questionType === "short_answer") {
        options = null;
        correctAnswer = formData.correctAnswer[0] || "";
      } else {
        // Filter empty options
        options = formData.options.filter((opt) => opt.trim() !== "");
        // Convert correct answer indices to numbers
        correctAnswer = formData.correctAnswer.map((idx) => parseInt(idx));
      }

      const questionData = {
        testId: parseInt(testId),
        questionText: formData.questionText,
        questionType: formData.questionType,
        options,
        correctAnswer,
        points: parseInt(formData.points),
        explanation: formData.explanation || null,
      };

      if (editingQuestion) {
        await API.updateQuestion(editingQuestion.id, questionData);
        alert(t("teacher.questions.update_success"));
      } else {
        await API.createQuestion(questionData);
        alert(t("teacher.questions.create_success"));
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save question:", error);
      alert(error.response?.data?.error || t("teacher.questions.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
    setShowPreview(false);
    setFormData({
      questionText: "",
      questionType: "multiple_choice_single",
      options: ["", "", "", ""],
      correctAnswer: [],
      points: 1,
      explanation: "",
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    // Also remove from correct answers if selected
    const newCorrectAnswer = formData.correctAnswer
      .filter((idx) => idx !== index.toString())
      .map((idx) =>
        parseInt(idx) > index ? (parseInt(idx) - 1).toString() : idx
      );
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    const indexStr = index.toString();
    if (formData.questionType === "multiple_choice_single") {
      setFormData((prev) => ({ ...prev, correctAnswer: [indexStr] }));
    } else {
      // multiple_choice_multiple
      setFormData((prev) => {
        const newCorrect = prev.correctAnswer.includes(indexStr)
          ? prev.correctAnswer.filter((i) => i !== indexStr)
          : [...prev.correctAnswer, indexStr];
        return { ...prev, correctAnswer: newCorrect };
      });
    }
  };

  const onQuestionTextChange = (value) => {
    setFormData((prev) => ({ ...prev, questionText: value }));
  };

  const getQuestionTypeInfo = (type) => {
    return QUESTION_TYPES.find((t) => t.value === type) || QUESTION_TYPES[0];
  };

  if (loading) {
    return (
      <div className="text-center py-12">{t("teacher.questions.loading")}</div>
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
              {test?.title} - {t("teacher.questions.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("teacher.questions.subtitle")}
            </p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FaPlus />
            <span>{t("teacher.questions.add_question")}</span>
          </button>
        )}
      </div>

      {/* Question Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingQuestion
                ? t("teacher.questions.edit_title")
                : t("teacher.questions.create_title")}
            </h2>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showPreview
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaEye />
              {t("teacher.questions.preview")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Type */}
            <div>
              <Label>{t("teacher.questions.question_type")} *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {QUESTION_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.questionType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          questionType: type.value,
                          correctAnswer: [],
                        }));
                      }}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon
                        className={`text-2xl ${
                          isSelected ? "text-primary" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary" : "text-gray-600"
                        }`}
                      >
                        {t(`teacher.questions.types.${type.value}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && formData.questionText && (
              <div className="border-2 border-primary/30 rounded-xl p-6 bg-primary/5">
                <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                  <FaEye />
                  {t("teacher.questions.preview")}
                </div>
                <div className="prose max-w-none prose-indigo bg-white p-4 rounded-lg">
                  <ReactMarkdown>{formData.questionText}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Question Text - SimpleMDE Editor */}
            <div>
              <Label>{t("teacher.questions.question_text")} *</Label>
              <p className="text-sm text-gray-500 mb-2">
                {t("teacher.questions.editor_hint")}
              </p>
              <SimpleMdeReact
                id="questionText"
                value={formData.questionText}
                onChange={onQuestionTextChange}
                options={editorOptions}
              />
            </div>

            {/* Options for Multiple Choice */}
            {(formData.questionType === "multiple_choice_single" ||
              formData.questionType === "multiple_choice_multiple") && (
              <div>
                <Label>{t("teacher.questions.options")} *</Label>
                <p className="text-sm text-gray-500 mb-2">
                  {formData.questionType === "multiple_choice_single"
                    ? t("teacher.questions.select_one_correct")
                    : t("teacher.questions.select_multiple_correct")}
                </p>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCorrectAnswerChange(index)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          formData.correctAnswer.includes(index.toString())
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 hover:border-green-300"
                        }`}
                      >
                        {formData.correctAnswer.includes(index.toString()) && (
                          <FaCheckCircle />
                        )}
                      </button>
                      <span className="text-sm text-gray-600 w-8 font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`${t("teacher.questions.option")} ${
                          String.fromCharCode(65 + index)
                        }`}
                        className="flex-1"
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                >
                  <FaPlus />
                  {t("teacher.questions.add_option")}
                </button>
              </div>
            )}

            {/* True/False Options */}
            {formData.questionType === "true_false" && (
              <div>
                <Label>{t("teacher.questions.correct_answer")} *</Label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        correctAnswer: ["true"],
                      }))
                    }
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                      formData.correctAnswer[0] === "true"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {t("teacher.questions.true")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        correctAnswer: ["false"],
                      }))
                    }
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                      formData.correctAnswer[0] === "false"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {t("teacher.questions.false")}
                  </button>
                </div>
              </div>
            )}

            {/* Short Answer */}
            {formData.questionType === "short_answer" && (
              <div>
                <Label htmlFor="shortAnswer">
                  {t("teacher.questions.expected_answer")}
                </Label>
                <p className="text-sm text-gray-500 mb-2">
                  {t("teacher.questions.short_answer_hint")}
                </p>
                <Input
                  id="shortAnswer"
                  value={formData.correctAnswer[0] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      correctAnswer: [e.target.value],
                    }))
                  }
                  placeholder={t(
                    "teacher.questions.expected_answer_placeholder"
                  )}
                  className="mt-2"
                />
              </div>
            )}

            {/* Points and Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points">{t("teacher.questions.points")}</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, points: e.target.value }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="explanation">
                  {t("teacher.questions.explanation")}
                </Label>
                <Input
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      explanation: e.target.value,
                    }))
                  }
                  placeholder={t("teacher.questions.explanation_placeholder")}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.questions.cancel")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaSave />
                <span>
                  {saving
                    ? t("teacher.questions.saving")
                    : editingQuestion
                    ? t("teacher.questions.update")
                    : t("teacher.questions.create")}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("teacher.questions.list_title", { count: questions.length })}
        </h2>

        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaQuestionCircle className="text-6xl mx-auto mb-4 text-gray-300" />
            <p>{t("teacher.questions.no_questions")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => {
              const typeInfo = getQuestionTypeInfo(question.questionType);
              const TypeIcon = typeInfo.icon;
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TypeIcon className="text-xl text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {t(
                            `teacher.questions.types.${question.questionType}`
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {question.points} {t("teacher.questions.pts")}
                        </span>
                      </div>
                      {/* Preview the question text as markdown */}
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown>
                          {question.questionText.length > 200
                            ? question.questionText.substring(0, 200) + "..."
                            : question.questionText}
                        </ReactMarkdown>
                      </div>
                      {question.options && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {question.options.map((opt, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 text-xs rounded ${
                                question.correctAnswer?.includes(i)
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </span>
                          ))}
                        </div>
                      )}
                      {question.questionType === "true_false" && (
                        <p className="mt-2 text-sm">
                          <span className="text-gray-500">
                            {t("teacher.questions.answer")}:{" "}
                          </span>
                          <span
                            className={
                              question.correctAnswer
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {question.correctAnswer
                              ? t("teacher.questions.true")
                              : t("teacher.questions.false")}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(question)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                        title={t("teacher.questions.edit")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(question.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                        title={t("teacher.questions.delete")}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("teacher.questions.delete_title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("teacher.questions.delete_confirm")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.questions.cancel")}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
              >
                {t("teacher.questions.delete")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
