import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaFilter,
} from "react-icons/fa";
import API from "../../services/api";

const BookingManagement = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [acceptPrice, setAcceptPrice] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.getMyBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  };

  const handleAccept = async (bookingId) => {
    const price = acceptPrice[bookingId];
    if (!price || price <= 0) {
      alert(t("teacher.bookings.invalid_price"));
      return;
    }

    try {
      await API.acceptBooking(bookingId, { price });
      fetchBookings();
      setAcceptPrice((prev) => ({ ...prev, [bookingId]: "" }));
    } catch (error) {
      console.error("Failed to accept booking:", error);
      alert(t("teacher.bookings.accept_failed"));
    }
  };

  const handleReject = async (bookingId) => {
    if (!confirm(t("teacher.bookings.reject_confirm"))) return;

    try {
      await API.cancelBooking(bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Failed to reject booking:", error);
      alert(t("teacher.bookings.reject_failed"));
    }
  };

  const handleComplete = async (bookingId) => {
    if (!confirm(t("teacher.bookings.complete_confirm"))) return;

    try {
      await API.completeBooking(bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Failed to complete booking:", error);
      alert(t("teacher.bookings.complete_failed"));
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    accepted: "bg-blue-100 text-blue-800 border-blue-300",
    paid: "bg-green-100 text-green-800 border-green-300",
    completed: "bg-gray-100 text-gray-800 border-gray-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  if (loading) {
    return <div className="text-center py-12">{t("teacher.bookings.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t("teacher.bookings.title")}</h1>
        <p className="text-gray-600 mt-2">
          {t("teacher.bookings.subtitle")}
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <span className="font-medium text-gray-700">{t("teacher.bookings.filter_label")}:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "accepted", "paid", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === status
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(`teacher.bookings.status_${status}`)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {t("teacher.bookings.no_bookings")}
          </h3>
          <p className="text-gray-500">
            {statusFilter === "all"
              ? t("teacher.bookings.no_requests")
              : t("teacher.bookings.no_status_bookings", { status: t(`teacher.bookings.status_${statusFilter}`) })}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {booking.startTime} - {booking.endTime} ({booking.durationMinutes} min)
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                        statusColors[booking.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t(`teacher.bookings.status_${booking.status}`).toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{t("teacher.bookings.student")}</p>
                      <p className="font-medium text-gray-800">
                        {booking.User?.username || t("teacher.bookings.unknown")}
                      </p>
                    </div>
                    {booking.studentCount && (
                      <div>
                        <p className="text-sm text-gray-500">{t("teacher.bookings.students_count")}</p>
                        <p className="font-medium text-gray-800">{booking.studentCount}</p>
                      </div>
                    )}
                    {booking.sessionCount && (
                      <div>
                        <p className="text-sm text-gray-500">{t("teacher.bookings.sessions_count")}</p>
                        <p className="font-medium text-gray-800">{booking.sessionCount}</p>
                      </div>
                    )}
                    {booking.location && (
                      <div>
                        <p className="text-sm text-gray-500">{t("teacher.bookings.location")}</p>
                        <p className="font-medium text-gray-800">{booking.location}</p>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">{t("teacher.bookings.notes")}</p>
                      <p className="text-gray-800">{booking.notes}</p>
                    </div>
                  )}

                  {booking.price && (
                    <div className="text-2xl font-bold text-primary">
                      ₮{booking.price.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:w-64 flex flex-col gap-3">
                  {booking.status === "pending" && (
                    <>
                      <div>
                        <input
                          type="number"
                          placeholder={t("teacher.bookings.set_price")}
                          value={acceptPrice[booking.id] || ""}
                          onChange={(e) =>
                            setAcceptPrice((prev) => ({
                              ...prev,
                              [booking.id]: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all"
                      >
                        <FaCheck />
                        <span>{t("teacher.bookings.accept")}</span>
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all"
                      >
                        <FaTimes />
                        <span>{t("teacher.bookings.reject")}</span>
                      </button>
                    </>
                  )}
                  {booking.status === "paid" && (
                    <button
                      onClick={() => handleComplete(booking.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-bold transition-all"
                    >
                      <FaCheckCircle />
                      <span>{t("teacher.bookings.mark_complete")}</span>
                    </button>
                  )}
                  {booking.status === "accepted" && (
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-sm text-blue-800 font-medium">
                        {t("teacher.bookings.waiting_payment")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
