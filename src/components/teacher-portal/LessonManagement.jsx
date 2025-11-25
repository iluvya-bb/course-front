import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaVideo,
  FaImage,
  FaSave,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import API from "../../services/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const LessonManagement = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    wysiwygContent: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      setLoading(true);
      const courseRes = await API.getCourse(courseId);
      setCourse(courseRes.data.data);
      setLessons(courseRes.data.data.Lessons || []);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      content: lesson.content || "",
      wysiwygContent: lesson.wysiwygContent || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (lessonId) => {
    if (!confirm(t("teacher.lessons.delete_confirm"))) return;

    try {
      await API.deleteLesson(lessonId);
      fetchCourseAndLessons();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      alert(t("teacher.lessons.delete_failed"));
    }
  };

  const handleRequestPublication = async (lessonId) => {
    if (!confirm(t("teacher.lessons.publish_confirm"))) return;

    try {
      await API.requestLessonPublication(lessonId);
      alert(t("teacher.lessons.publish_success"));
      fetchCourseAndLessons();
    } catch (error) {
      console.error("Failed to request publication:", error);
      alert(error.response?.data?.error || t("teacher.lessons.publish_failed"));
    }
  };

  const getPublicationStatusBadge = (status) => {
    const badges = {
      draft: {
        color: "bg-gray-100 text-gray-800",
        icon: FaEdit,
        label: t("teacher.lessons.status_draft"),
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: FaClock,
        label: t("teacher.lessons.status_pending"),
      },
      approved: {
        color: "bg-green-100 text-green-800",
        icon: FaCheckCircle,
        label: t("teacher.lessons.status_published"),
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: FaTimesCircle,
        label: t("teacher.lessons.status_rejected"),
      },
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        <Icon />
        {badge.label}
      </span>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();
      data.append("courseId", courseId);
      data.append("title", formData.title);
      if (formData.content) data.append("content", formData.content);
      if (formData.wysiwygContent) data.append("wysiwygContent", formData.wysiwygContent);
      if (videoFile) data.append("video", videoFile);
      if (bannerFile) data.append("bannerImage", bannerFile);

      if (editingLesson) {
        await API.updateLesson(editingLesson.id, data);
      } else {
        await API.createLesson(data);
      }

      setShowForm(false);
      setEditingLesson(null);
      setFormData({ title: "", content: "", wysiwygContent: "" });
      setVideoFile(null);
      setBannerFile(null);
      fetchCourseAndLessons();
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert(error.response?.data?.error || t("teacher.lessons.save_failed"));
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingLesson(null);
    setFormData({ title: "", content: "", wysiwygContent: "" });
    setVideoFile(null);
    setBannerFile(null);
  };

  if (loading) {
    return <div className="text-center py-12">{t("teacher.lessons.loading")}</div>;
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
              {course?.title} - {t("teacher.lessons.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("teacher.lessons.subtitle")}</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FaPlus />
            <span>{t("teacher.lessons.add_lesson")}</span>
          </button>
        )}
      </div>

      {/* Lesson Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingLesson ? t("teacher.lessons.edit_title") : t("teacher.lessons.create_title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t("teacher.lessons.lesson_title")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                placeholder={t("teacher.lessons.title_placeholder")}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content">{t("teacher.lessons.content_label")}</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                placeholder={t("teacher.lessons.content_placeholder")}
                className="mt-2 w-full px-4 py-3 border-2 border-neutral rounded-lg focus:border-primary focus:outline-none resize-none transition-all"
              />
            </div>

            <div>
              <Label htmlFor="video">{t("teacher.lessons.video")} {editingLesson ? t("teacher.lessons.video_optional") : "*"}</Label>
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required={!editingLesson}
                className="mt-2 w-full px-4 py-3 border-2 border-neutral rounded-lg focus:border-primary focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
              />
              {videoFile && (
                <p className="text-sm text-green-600 mt-2">{t("teacher.lessons.selected")}: {videoFile.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="banner">{t("teacher.lessons.banner")}</Label>
              <input
                id="banner"
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
                className="mt-2 w-full px-4 py-3 border-2 border-neutral rounded-lg focus:border-primary focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
              />
              {bannerFile && (
                <p className="text-sm text-green-600 mt-2">{t("teacher.lessons.selected")}: {bannerFile.name}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.lessons.cancel")}
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
              >
                <FaSave />
                <span>{uploading ? t("teacher.lessons.uploading") : editingLesson ? t("teacher.lessons.update") : t("teacher.lessons.create")}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lessons List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("teacher.lessons.list_title", { count: lessons.length })}</h2>

        {lessons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaVideo className="text-6xl mx-auto mb-4 text-gray-300" />
            <p>{t("teacher.lessons.no_lessons")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-all"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  {lesson.bannerImage ? (
                    <img
                      src={`${API.defaults.baseURL}/${lesson.bannerImage}`}
                      alt={lesson.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaVideo className="text-2xl text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                    {getPublicationStatusBadge(lesson.publicationStatus || "draft")}
                  </div>
                  {lesson.content && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {lesson.content}
                    </p>
                  )}
                  {lesson.rejectionReason && (
                    <p className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                      <strong>{t("teacher.lessons.rejection_reason")}:</strong> {lesson.rejectionReason}
                    </p>
                  )}
                  {lesson.transcodingStatus && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t("teacher.lessons.transcoding")}: {lesson.transcodingStatus}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {(lesson.publicationStatus === "draft" || lesson.publicationStatus === "rejected") && (
                    <button
                      onClick={() => handleRequestPublication(lesson.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
                      title={t("teacher.lessons.request_publish_title")}
                    >
                      <FaPaperPlane />
                      <span className="hidden sm:inline">{t("teacher.lessons.request_publish")}</span>
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonManagement;
