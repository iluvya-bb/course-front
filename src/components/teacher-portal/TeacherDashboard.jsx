import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaBook,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaPlus,
  FaChartLine,
  FaClock,
} from "react-icons/fa";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeBookings: 0,
    totalEarnings: 0,
    courseEarnings: 0,
    bookingEarnings: 0,
    pendingBookings: 0,
  });
  const [courses, setCourses] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch courses with subscription counts (optimized single API call)
      const coursesRes = await API.getCoursesWithStats({ teacherId: user.teacherProfile?.id });
      const coursesData = coursesRes.data.data || [];
      setCourses(coursesData.slice(0, 3)); // Show only 3 recent courses

      // Fetch bookings for this teacher only
      const bookingsRes = await API.getBookingsTeacher();
      const bookingsData = bookingsRes.data.data || [];
      setRecentBookings(bookingsData.slice(0, 5));

      // Fetch course earnings from CompanyTransaction
      let courseEarnings = 0;
      try {
        const earningsRes = await API.getMyTeacherEarnings();
        courseEarnings = parseFloat(earningsRes.data.data.totalEarnings) || 0;
      } catch (earningsError) {
        console.error("Failed to fetch course earnings:", earningsError);
        // If teacher earnings endpoint fails, continue with 0
      }

      // Calculate stats
      const totalCourses = coursesData.length;

      // Count total students across all courses (now using pre-computed counts)
      const totalStudents = coursesData.reduce((sum, course) => sum + (course.studentCount || 0), 0);

      const activeBookings = bookingsData.filter(
        (b) => b.status === "accepted" || b.status === "paid"
      ).length;

      const pendingBookings = bookingsData.filter(
        (b) => b.status === "pending"
      ).length;

      // Calculate booking earnings (from private tutoring)
      const bookingEarnings = bookingsData
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + (b.price || 0), 0);

      // Total earnings = course sales + booking earnings
      const totalEarnings = courseEarnings + bookingEarnings;

      setStats({
        totalCourses,
        totalStudents,
        activeBookings,
        totalEarnings,
        courseEarnings,
        bookingEarnings,
        pendingBookings,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t("teacher.dashboard.total_courses"),
      value: stats.totalCourses,
      icon: FaBook,
      gradient: "from-blue-500 to-blue-600",
      link: "/teacher/courses",
    },
    {
      title: t("teacher.dashboard.total_students"),
      value: stats.totalStudents,
      icon: FaUsers,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: t("teacher.dashboard.active_bookings"),
      value: stats.activeBookings,
      icon: FaCalendarCheck,
      gradient: "from-purple-500 to-purple-600",
      link: "/teacher/bookings",
    },
    {
      title: t("teacher.dashboard.total_earnings"),
      value: `₮${stats.totalEarnings.toLocaleString()}`,
      icon: FaMoneyBillWave,
      gradient: "from-yellow-500 to-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">{t("teacher.dashboard.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {t("teacher.dashboard.welcome", { name: user?.username })}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("teacher.dashboard.subtitle")}
          </p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <FaPlus />
          <span>{t("teacher.dashboard.new_course")}</span>
        </Link>
      </div>

      {/* Pending Bookings Alert */}
      {stats.pendingBookings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
        >
          <div className="flex items-center">
            <FaClock className="text-yellow-600 text-2xl mr-3" />
            <div>
              <p className="font-bold text-yellow-800">
                {t("teacher.dashboard.pending_alert", {
                  count: stats.pendingBookings,
                  plural: stats.pendingBookings > 1 ? "s" : ""
                })}
              </p>
              <Link to="/teacher/bookings" className="text-yellow-700 underline text-sm">
                {t("teacher.dashboard.view_respond")}
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const CardWrapper = stat.link ? Link : 'div';
          const wrapperProps = stat.link ? { to: stat.link } : {};

          return (
            <CardWrapper key={index} {...wrapperProps}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-lg text-white ${
                  stat.link ? 'hover:shadow-2xl transform hover:scale-105 cursor-pointer' : ''
                } transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <Icon className="text-3xl" />
                  </div>
                </div>
              </motion.div>
            </CardWrapper>
          );
        })}
      </div>

      {/* Recent Courses and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t("teacher.dashboard.my_courses")}</h2>
            <Link
              to="/teacher/courses"
              className="text-primary hover:text-secondary font-medium text-sm"
            >
              {t("teacher.dashboard.view_all")}
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaBook className="text-5xl mx-auto mb-4 text-gray-300" />
              <p>{t("teacher.dashboard.no_courses")}</p>
              <Link
                to="/teacher/courses/new"
                className="text-primary hover:underline mt-2 inline-block"
              >
                {t("teacher.dashboard.create_first")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/teacher/courses/${course.id}/lessons`}
                  className="block p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    {course.bannerImage && (
                      <img
                        src={`${API.defaults.baseURL}/${course.bannerImage}`}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        ₮{course.price?.toLocaleString()}
                      </p>
                    </div>
                    {course.isSpecial && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                        {t("teacher.courses.special")}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t("teacher.dashboard.recent_bookings")}</h2>
            <Link
              to="/teacher/bookings"
              className="text-primary hover:text-secondary font-medium text-sm"
            >
              {t("teacher.dashboard.view_all")}
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaCalendarCheck className="text-5xl mx-auto mb-4 text-gray-300" />
              <p>{t("teacher.dashboard.no_bookings")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.startTime} - {booking.endTime}
                      </p>
                      {booking.notes && (
                        <p className="text-xs text-gray-500 mt-1">{booking.notes}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t(`teacher.bookings.status.${booking.status}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
