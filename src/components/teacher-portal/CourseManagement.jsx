import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaBook,
  FaSearch,
} from "react-icons/fa";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const CourseManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search query
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await API.getCourses({ teacherId: user.teacherProfile?.id });
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await API.deleteCourse(courseId);
      // Refresh courses list
      fetchCourses();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert(error.response?.data?.error || t("teacher.courses.delete_failed"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">{t("teacher.courses.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t("teacher.courses.title")}</h1>
          <p className="text-gray-600 mt-2">
            {t("teacher.courses.subtitle")}
          </p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <FaPlus />
          <span>{t("teacher.courses.create_new")}</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("teacher.courses.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {searchQuery ? t("teacher.courses.no_courses_found") : t("teacher.courses.no_courses")}
          </h3>
          {!searchQuery && (
            <p className="text-gray-500 mb-6">
              {t("teacher.courses.create_prompt")}
            </p>
          )}
          {!searchQuery && (
            <Link
              to="/teacher/courses/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-all"
            >
              <FaPlus />
              <span>{t("teacher.courses.create_course")}</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
            >
              {/* Course Banner */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {course.bannerImage ? (
                  <img
                    src={`${API.defaults.baseURL}/${course.bannerImage}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaBook className="text-6xl text-primary/30" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {course.isSpecial && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {t("teacher.courses.special")}
                    </span>
                  )}
                  {course.isShowcased && (
                    <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {t("teacher.courses.showcased")}
                    </span>
                  )}
                  {!course.isVisible && (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {t("teacher.courses.hidden")}
                    </span>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description || t("teacher.courses.no_description")}
                </p>

                {/* Price and Stats */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="text-2xl font-bold text-primary">
                    ₮{course.price?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers />
                    <span className="text-sm">
                      {t("teacher.courses.students_count", { count: course.Subscriptions?.length || 0 })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to={`/teacher/courses/${course.id}/lessons`}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FaEye className="text-xs" />
                    <span>{t("teacher.courses.lessons")}</span>
                  </Link>
                  <Link
                    to={`/teacher/courses/${course.id}/edit`}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FaEdit className="text-xs" />
                    <span>{t("teacher.courses.edit")}</span>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(course.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FaTrash className="text-xs" />
                    <span>{t("teacher.courses.delete")}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("teacher.courses.delete_title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("teacher.courses.delete_confirm")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                {t("teacher.courses.cancel")}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
              >
                {t("teacher.courses.delete")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
