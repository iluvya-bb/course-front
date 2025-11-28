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
  FaInfoCircle,
} from "react-icons/fa";
import API from "../../services/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import DirectVideoUpload from "./DirectVideoUpload";
import TranscodingStatus from "./TranscodingStatus";

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
  const [videoS3Key, setVideoS3Key] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [createdLessonId, setCreatedLessonId] = useState(null);
  const [transcodingStatus, setTranscodingStatus] = useState(null);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseRes = await API.getCourse(courseId);
      setCourse(courseRes.data.data);

      // Fetch lessons separately
      const lessonsRes = await API.getLessons({ courseId: courseId });
      setLessons(lessonsRes.data.data || []);

      console.log("Fetched lessons:", lessonsRes.data.data);
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
    setCreatedLessonId(lesson.id);
    setTranscodingStatus(lesson.transcodingStatus);
    setShowForm(true);
  };

  const handleVideoUploadComplete = (s3Key) => {
    console.log("Video uploaded to S3:", s3Key);
    setVideoS3Key(s3Key);
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
      if (!videoS3Key && !editingLesson) {
        alert(t("teacher.lessons.video_upload.no_file"));
        setUploading(false);
        return;
      }

      // Create lesson with S3 video
      const lessonData = {
        courseId: courseId,
        title: formData.title,
        content: formData.content,
        wysiwygContent: formData.wysiwygContent,
        videoS3Key: videoS3Key,
      };

      const response = await API.createLessonWithS3Video(lessonData);
      const lesson = response.data.data;

      console.log("Lesson created:", lesson);
      setCreatedLessonId(lesson.id);
      setTranscodingStatus("pending");

      // Now trigger transcoding
      try {
        await API.startTranscoding({
          lessonId: lesson.id,
          s3Key: videoS3Key,
        });
        setTranscodingStatus("processing");
        alert(t("teacher.lessons.video_upload.upload_complete"));
      } catch (transcodingError) {
        console.error("Failed to start transcoding:", transcodingError);
        alert(t("teacher.lessons.transcoding.failed_msg"));
      }
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert(error.response?.data?.error || t("teacher.lessons.save_failed"));
    } finally {
      setUploading(false);
    }
  };

  const handleTranscodingComplete = () => {
    console.log("Transcoding completed!");
    setTranscodingStatus("completed");
    // Reset form and reload lessons after a short delay
    setTimeout(() => {
      setShowForm(false);
      setEditingLesson(null);
      setFormData({ title: "", content: "", wysiwygContent: "" });
      setVideoS3Key(null);
      setBannerFile(null);
      setCreatedLessonId(null);
      setTranscodingStatus(null);
      fetchCourseAndLessons();
    }, 2000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingLesson(null);
    setFormData({ title: "", content: "", wysiwygContent: "" });
    setVideoS3Key(null);
    setBannerFile(null);
    setCreatedLessonId(null);
    setTranscodingStatus(null);
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

          {/* Info Banner */}
          {!editingLesson && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-start space-x-3">
              <FaInfoCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm text-blue-900">
                <strong>{t("teacher.lessons.video_upload.upload")}:</strong>{" "}
                {t("teacher.lessons.transcoding.processing_msg")}
              </div>
            </div>
          )}

          {/* Show Transcoding Status if lesson is created */}
          {createdLessonId && transcodingStatus && (
            <div className="mb-6">
              <TranscodingStatus
                lessonId={createdLessonId}
                onComplete={handleTranscodingComplete}
              />
            </div>
          )}

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

            {/* Direct Video Upload Component */}
            {!editingLesson && !createdLessonId && (
              <div className="mb-6">
                <DirectVideoUpload
                  onUploadComplete={handleVideoUploadComplete}
                  onError={(err) => console.error("Video upload error:", err)}
                />
              </div>
            )}

            {/* Submit Button */}
            {!createdLessonId && (
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
                  disabled={uploading || (!videoS3Key && !editingLesson)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaSave />
                  <span>{uploading ? t("teacher.lessons.uploading") : editingLesson ? t("teacher.lessons.update") : t("teacher.lessons.create")}</span>
                </button>
              </div>
            )}

            {createdLessonId && transcodingStatus === "completed" && (
              <div className="text-center text-green-600 font-semibold py-4">
                {t("teacher.lessons.transcoding.completed_msg")}
              </div>
            )}
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
