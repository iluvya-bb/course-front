import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaSave, FaArrowLeft, FaImage } from "react-icons/fa";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isEditMode = !!courseId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    categoryIds: [], // For multiple categories
    subscriptionDurationDays: "",
    isSpecial: false,
    isVisible: false, // Always false for teacher-created courses - requires admin approval
    isShowcased: false,
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCategories = async () => {
    try {
      const response = await API.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await API.getCourse(courseId);
      const course = response.data.data;

      // Extract category IDs from the categories array if available
      const existingCategoryIds = course.categories
        ? course.categories.map(cat => cat.id)
        : (course.categoryId ? [course.categoryId] : []);

      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        categoryId: course.categoryId || "",
        categoryIds: existingCategoryIds, // Pre-fill with existing categories
        subscriptionDurationDays: course.subscriptionDurationDays || "",
        isSpecial: course.isSpecial || false,
        isVisible: course.isVisible !== false,
        isShowcased: course.isShowcased || false,
      });
      if (course.bannerImage) {
        setBannerPreview(`${API.defaults.baseURL}/${course.bannerImage}`);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      alert(t("teacher.course_form.load_failed"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const categoryIds = prev.categoryIds || [];
      const isSelected = categoryIds.includes(categoryId);

      const newCategoryIds = isSelected
        ? categoryIds.filter(id => id !== categoryId)
        : [...categoryIds, categoryId];

      return {
        ...prev,
        categoryIds: newCategoryIds,
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("teacherId", user.teacherProfile?.id);
      if (formData.categoryId) data.append("categoryId", formData.categoryId);

      // Append categoryIds for multiple categories
      if (formData.categoryIds && formData.categoryIds.length > 0) {
        data.append("categoryIds", JSON.stringify(formData.categoryIds));
      }
      if (formData.subscriptionDurationDays) {
        data.append("subscriptionDurationDays", formData.subscriptionDurationDays);
      }
      data.append("isSpecial", formData.isSpecial);
      data.append("isVisible", formData.isVisible);
      data.append("isShowcased", formData.isShowcased);
      if (bannerFile) {
        data.append("bannerImage", bannerFile);
      }

      if (isEditMode) {
        await API.updateCourse(courseId, data);
      } else {
        await API.createCourse(data);
      }

      navigate("/teacher/courses");
    } catch (error) {
      console.error("Failed to save course:", error);
      alert(error.response?.data?.error || t("teacher.course_form.save_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/teacher/courses")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditMode ? t("teacher.course_form.edit_title") : t("teacher.course_form.create_title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? t("teacher.course_form.edit_subtitle") : t("teacher.course_form.create_subtitle")}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Image */}
          <div>
            <Label htmlFor="bannerImage">{t("teacher.course_form.banner")}</Label>
            <div className="mt-2">
              {bannerPreview ? (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={bannerPreview}
                    alt={t("teacher.course_form.banner_preview")}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview(null);
                    }}
                    className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
                  >
                    {t("teacher.course_form.remove")}
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-all bg-gray-50">
                  <FaImage className="text-5xl text-gray-400 mb-4" />
                  <span className="text-gray-600">{t("teacher.course_form.upload_banner")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">{t("teacher.course_form.title_label")}</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder={t("teacher.course_form.title_placeholder")}
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">{t("teacher.course_form.description_label")}</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder={t("teacher.course_form.description_placeholder")}
              className="mt-2 w-full px-4 py-3 border-2 border-neutral rounded-lg focus:border-primary focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price">{t("teacher.course_form.price")}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="categoryIds">
                {t("teacher.course_form.category")} (Multiple)
                {formData.categoryIds.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {formData.categoryIds.length} selected
                  </span>
                )}
              </Label>
              <div className="mt-2 border-2 border-neutral rounded-lg p-3 bg-gray-50 space-y-2 max-h-48 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((category) => {
                    const categoryName = typeof category.name === "object"
                      ? category.name[i18n.language] || category.name.en || category.name.mn
                      : category.name;
                    const isSelected = formData.categoryIds.includes(category.id);

                    return (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={isSelected}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {categoryName}
                        </label>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No categories available</p>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Duration */}
          <div>
            <Label htmlFor="subscriptionDurationDays">
              {t("teacher.course_form.duration")}
            </Label>
            <Input
              id="subscriptionDurationDays"
              name="subscriptionDurationDays"
              type="number"
              value={formData.subscriptionDurationDays}
              onChange={handleInputChange}
              placeholder={t("teacher.course_form.duration_placeholder")}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              {t("teacher.course_form.duration_help")}
            </p>
          </div>

          {/* Approval Notice */}
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-800 mb-1">
                  {t("teacher.course_form.approval_title")}
                </h4>
                <p className="text-sm text-yellow-700">
                  {t("teacher.course_form.approval_message")}
                </p>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isSpecial"
                name="isSpecial"
                checked={formData.isSpecial}
                onChange={handleInputChange}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <Label htmlFor="isSpecial" className="cursor-pointer mb-0">
                {t("teacher.course_form.special")}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isShowcased"
                name="isShowcased"
                checked={formData.isShowcased}
                onChange={handleInputChange}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <Label htmlFor="isShowcased" className="cursor-pointer mb-0">
                {t("teacher.course_form.showcased")}
              </Label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/teacher/courses")}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
            >
              {t("teacher.course_form.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <FaSave />
              <span>{loading ? t("teacher.course_form.saving") : isEditMode ? t("teacher.course_form.update") : t("teacher.course_form.create")}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CourseForm;
