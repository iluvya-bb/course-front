import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaClipboardList,
  FaSave,
  FaQuestionCircle,
  FaCertificate,
  FaClock,
  FaCheckCircle,
  FaClipboardCheck,
  FaAward,
  FaTimes,
  FaUser,
  FaDownload,
} from "react-icons/fa";
import API from "../../services/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const TestManagement = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tests, setTests] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [certificateModal, setCertificateModal] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessonId: "",
    passingScore: 70,
    timeLimit: "",
    maxAttempts: 3,
    numberOfQuestions: 10,
    issuesCertificate: false,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseRes = await API.getCourse(courseId);
      setCourse(courseRes.data.data);

      // Fetch lessons for dropdown
      const lessonsRes = await API.getLessons({ courseId });
      setLessons(lessonsRes.data.data || []);

      // Fetch tests for this course
      const testsRes = await API.getTests({ courseId });
      setTests(testsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || "",
      lessonId: test.lessonId || "",
      passingScore: test.passingScore || 70,
      timeLimit: test.timeLimit || "",
      maxAttempts: test.maxAttempts || 3,
      numberOfQuestions: test.numberOfQuestions || 10,
      issuesCertificate: test.issuesCertificate || false,
      isActive: test.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (testId) => {
    try {
      await API.deleteTest(testId);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete test:", error);
      alert(error.response?.data?.error || t("teacher.tests.delete_failed"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const testData = {
        ...formData,
        courseId: parseInt(courseId),
        lessonId: formData.lessonId ? parseInt(formData.lessonId) : null,
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
        passingScore: parseInt(formData.passingScore),
        maxAttempts: parseInt(formData.maxAttempts),
        numberOfQuestions: parseInt(formData.numberOfQuestions),
      };

      if (editingTest) {
        await API.updateTest(editingTest.id, testData);
        alert(t("teacher.tests.update_success"));
      } else {
        await API.createTest(testData);
        alert(t("teacher.tests.create_success"));
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save test:", error);
      alert(error.response?.data?.error || t("teacher.tests.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTest(null);
    setFormData({
      title: "",
      description: "",
      lessonId: "",
      passingScore: 70,
      timeLimit: "",
      maxAttempts: 3,
      numberOfQuestions: 10,
      issuesCertificate: false,
      isActive: true,
    });
  };

  const handleViewCertificates = async (test) => {
    setCertificateModal(test);
    setLoadingCertificates(true);
    try {
      const response = await API.getTestCertificates(test.id);
      setCertificates(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      setCertificates([]);
    } finally {
      setLoadingCertificates(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await API.downloadCertificatePDF(certificateId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert(t("teacher.tests.certificates.download_failed"));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">{t("teacher.tests.loading")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/teacher/courses")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {course?.title} - {t("teacher.tests.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("teacher.tests.subtitle")}</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FaPlus />
            <span>{t("teacher.tests.add_test")}</span>
          </button>
        )}
      </div>

      {/* Test Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingTest
              ? t("teacher.tests.edit_title")
              : t("teacher.tests.create_title")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">{t("teacher.tests.test_title")} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                placeholder={t("teacher.tests.title_placeholder")}
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                {t("teacher.tests.description")}
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                placeholder={t("teacher.tests.description_placeholder")}
                className="mt-2 w-full px-4 py-3 border-2 border-neutral rounded-lg focus:border-primary focus:outline-none resize-none transition-all"
              />
            </div>

            {/* Lesson Selection */}
            <div>
              <Label htmlFor="lessonId">{t("teacher.tests.lesson")}</Label>
              <select
                id="lessonId"
                value={formData.lessonId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lessonId: e.target.value }))
                }
                className="mt-2 w-full px-4 py-3 border-2 border-neutral rounded-lg focus:border-primary focus:outline-none transition-all"
              >
                <option value="">{t("teacher.tests.course_level_test")}</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {t("teacher.tests.lesson_hint")}
              </p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Passing Score */}
              <div>
                <Label htmlFor="passingScore">
                  {t("teacher.tests.passing_score")} (%)
                </Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      passingScore: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              {/* Time Limit */}
              <div>
                <Label htmlFor="timeLimit">
                  {t("teacher.tests.time_limit")} ({t("teacher.tests.minutes")})
                </Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="0"
                  value={formData.timeLimit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeLimit: e.target.value,
                    }))
                  }
                  placeholder={t("teacher.tests.no_limit")}
                  className="mt-2"
                />
              </div>

              {/* Max Attempts */}
              <div>
                <Label htmlFor="maxAttempts">
                  {t("teacher.tests.max_attempts")}
                </Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  value={formData.maxAttempts}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxAttempts: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <Label htmlFor="numberOfQuestions">
                  {t("teacher.tests.num_questions")}
                </Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min="1"
                  value={formData.numberOfQuestions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numberOfQuestions: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.issuesCertificate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issuesCertificate: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="flex items-center gap-2">
                  <FaCertificate className="text-yellow-500" />
                  {t("teacher.tests.issues_certificate")}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  {t("teacher.tests.is_active")}
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.tests.cancel")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaSave />
                <span>
                  {saving
                    ? t("teacher.tests.saving")
                    : editingTest
                    ? t("teacher.tests.update")
                    : t("teacher.tests.create")}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tests List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("teacher.tests.list_title", { count: tests.length })}
        </h2>

        {tests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaClipboardList className="text-6xl mx-auto mb-4 text-gray-300" />
            <p>{t("teacher.tests.no_tests")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-all"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <FaClipboardList className="text-2xl text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{test.title}</h3>
                    {test.issuesCertificate && (
                      <FaCertificate
                        className="text-yellow-500"
                        title={t("teacher.tests.issues_certificate")}
                      />
                    )}
                    {!test.isActive && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {t("teacher.tests.inactive")}
                      </span>
                    )}
                  </div>
                  {test.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {test.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaQuestionCircle />
                      {test.Questions?.length || 0} {t("teacher.tests.questions")}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCheckCircle />
                      {test.passingScore}% {t("teacher.tests.to_pass")}
                    </span>
                    {test.timeLimit && (
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {test.timeLimit} {t("teacher.tests.minutes")}
                      </span>
                    )}
                    {test.Lesson && (
                      <span className="text-primary">
                        {t("teacher.tests.for_lesson")}: {test.Lesson.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link
                    to={`/teacher/courses/${courseId}/tests/${test.id}/questions`}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    title={t("teacher.tests.manage_questions")}
                  >
                    <FaQuestionCircle />
                    <span className="hidden sm:inline">
                      {t("teacher.tests.questions")}
                    </span>
                  </Link>
                  <Link
                    to={`/teacher/courses/${courseId}/tests/${test.id}/grading`}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    title={t("teacher.tests.grading")}
                  >
                    <FaClipboardCheck />
                    <span className="hidden sm:inline">
                      {t("teacher.tests.grading")}
                    </span>
                  </Link>
                  {test.issuesCertificate && (
                    <button
                      onClick={() => handleViewCertificates(test)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                      title={t("teacher.tests.view_certificates")}
                    >
                      <FaAward />
                      <span className="hidden sm:inline">
                        {t("teacher.tests.certificates_btn")}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(test)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                    title={t("teacher.tests.edit")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(test.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                    title={t("teacher.tests.delete")}
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
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
              {t("teacher.tests.delete_title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("teacher.tests.delete_confirm")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.tests.cancel")}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
              >
                {t("teacher.tests.delete")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Certificates Modal */}
      {certificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {t("teacher.tests.certificates.title")}
                </h3>
                <p className="text-gray-600 mt-1">
                  {certificateModal.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setCertificateModal(null);
                  setCertificates([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <FaTimes className="text-xl text-gray-600" />
              </button>
            </div>

            {loadingCertificates ? (
              <div className="text-center py-12 text-gray-500">
                {t("teacher.tests.certificates.loading")}
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaAward className="text-5xl mx-auto mb-3 text-gray-300" />
                <p>{t("teacher.tests.certificates.no_certificates")}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="mb-4 text-sm text-gray-600">
                  {t("teacher.tests.certificates.total", { count: certificates.length })}
                </div>
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-xl text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {cert.user?.username || cert.user?.email || t("teacher.tests.certificates.unknown_user")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cert.user?.email}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>
                            {t("teacher.tests.certificates.score")}: {Number(cert.score || 0).toFixed(1)}%
                          </span>
                          <span>
                            {t("teacher.tests.certificates.issued")}: {formatDate(cert.issuedAt)}
                          </span>
                          {cert.isRevoked && (
                            <span className="text-red-500">
                              {t("teacher.tests.certificates.revoked")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            cert.isRevoked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {cert.isRevoked
                            ? t("teacher.tests.certificates.status_revoked")
                            : t("teacher.tests.certificates.status_valid")}
                        </span>
                        <button
                          onClick={() => handleDownloadCertificate(cert.id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                          title={t("teacher.tests.certificates.download")}
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setCertificateModal(null);
                  setCertificates([]);
                }}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.tests.certificates.close")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
