import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner, FaCalendarAlt, FaClock, FaTimes, FaMoneyBillWave, FaMapMarkerAlt, FaUserTie, FaInfoCircle } from "react-icons/fa";
import API from "../services/api";
import PaymentModal from "./PaymentModal";
import BookingCardSkeleton from "./BookingCardSkeleton";
import Toast from "./Toast";

const MyBookingsPage = () => {
	const { t } = useTranslation(["translation", "booking"]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionLoading, setActionLoading] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [toast, setToast] = useState(null);

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await API.getMyBookings();
			setBookings(response.data.data || []);
		} catch (err) {
			console.error("Failed to fetch bookings:", err);
			setError(t("booking.error_fetch_bookings", { defaultValue: "Захиалгууд татахад алдаа гарлаа." }));
		} finally {
			setLoading(false);
		}
	};

	const handleOpenPayment = (booking) => {
		setSelectedBooking(booking);
		setShowPaymentModal(true);
	};

	const handlePaymentSuccess = () => {
		setShowPaymentModal(false);
		setSelectedBooking(null);
		setToast({
			message: t("booking.payment_successful", { defaultValue: "Төлбөр амжилттай төлөгдлөө!" }),
			type: "success",
		});
		fetchBookings();
	};

	const handleCancel = async (bookingId) => {
		if (!window.confirm(t("booking.confirm_cancel", { defaultValue: "Захиалгыг цуцлахдаа итгэлтэй байна уу?" }))) {
			return;
		}

		setActionLoading(bookingId);
		try {
			await API.cancelBooking(bookingId);
			setToast({
				message: t("booking.cancel_successful", { defaultValue: "Захиалга амжилттай цуцлагдлаа!" }),
				type: "success",
			});
			fetchBookings();
		} catch (err) {
			console.error("Cancel failed:", err);
			setToast({
				message: err.response?.data?.error || t("booking.cancel_failed", { defaultValue: "Захиалга цуцлахад алдаа гарлаа." }),
				type: "error",
			});
		} finally {
			setActionLoading(null);
		}
	};

	const getStatusBadge = (status) => {
		const badges = {
			pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
			accepted: "bg-blue-100 text-blue-800 border-blue-300",
			paid: "bg-green-100 text-green-800 border-green-300",
			completed: "bg-gray-100 text-gray-800 border-gray-300",
			cancelled: "bg-red-100 text-red-800 border-red-300",
		};
		const labels = {
			pending: t("booking.status_pending", { defaultValue: "Хүлээгдэж буй" }),
			accepted: t("booking.status_accepted", { defaultValue: "Баталгаажсан" }),
			paid: t("booking.status_paid", { defaultValue: "Төлөгдсөн" }),
			completed: t("booking.status_completed", { defaultValue: "Дууссан" }),
			cancelled: t("booking.status_cancelled", { defaultValue: "Цуцлагдсан" }),
		};
		return (
			<span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
				{labels[status] || status}
			</span>
		);
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "-";
		return new Date(dateStr).toLocaleDateString('mn-MN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	if (loading) {
		return (
			<div className="max-w-6xl mx-auto p-4 md:p-6">
				<h1 className="text-2xl md:text-3xl font-bold text-base-content mb-6 flex items-center">
					<FaCalendarAlt className="mr-3" />
					{t("booking.my_bookings", { defaultValue: "Миний захиалгууд" })}
				</h1>
				<div className="grid gap-6 md:grid-cols-2">
					<BookingCardSkeleton />
					<BookingCardSkeleton />
					<BookingCardSkeleton />
					<BookingCardSkeleton />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
				{error}
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-4 md:p-6">
			<h1 className="text-2xl md:text-3xl font-bold text-base-content mb-6 flex items-center">
				<FaCalendarAlt className="mr-3" />
				{t("booking.my_bookings", { defaultValue: "Миний захиалгууд" })}
			</h1>

			{bookings.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
					<FaCalendarAlt className="mx-auto text-5xl mb-4 text-gray-300" />
					<p className="text-lg">{t("booking.no_bookings", { defaultValue: "Танд захиалга байхгүй байна." })}</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2">
					{bookings.map((booking) => (
						<div
							key={booking.id}
							className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
						>
							{/* Header */}
							<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-bold">
										{t("booking.booking_id", { defaultValue: "Захиалга" })} #{booking.id}
									</h3>
									{getStatusBadge(booking.status)}
								</div>
							</div>

							{/* Content */}
							<div className="p-4 space-y-3">
								{/* Teacher Info */}
								{booking.teacher && (
									<div className="flex items-start pb-3 border-b">
										<FaUserTie className="mr-3 mt-1 text-indigo-600 text-xl" />
										<div className="flex-1">
											<div className="font-semibold text-gray-900">
												{booking.teacher.name}
											</div>
											{booking.teacher.specialization && (
												<div className="text-sm text-gray-600">
													{booking.teacher.specialization}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Date & Time */}
								{booking.bookingDate && (
									<div className="flex items-start">
										<FaCalendarAlt className="mr-3 mt-1 text-indigo-600" />
										<div>
											<div className="font-medium text-gray-900">
												{formatDate(booking.bookingDate)}
											</div>
											{booking.startTime && booking.endTime && (
												<div className="text-sm text-gray-600 flex items-center mt-1">
													<FaClock className="mr-1" />
													{booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}
													{booking.durationMinutes && ` (${booking.durationMinutes} мин)`}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Location */}
								{booking.location && (
									<div className="flex items-center text-gray-700">
										<FaMapMarkerAlt className="mr-3 text-indigo-600" />
										<span>{booking.location}</span>
									</div>
								)}

								{/* Details */}
								<div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
									<div>
										<span className="text-gray-600">{t("booking.student_count", { defaultValue: "Суралцагч" })}:</span>
										<span className="ml-2 font-medium">{booking.studentCount || 0}</span>
									</div>
									<div>
										<span className="text-gray-600">{t("booking.session_count", { defaultValue: "Хичээл" })}:</span>
										<span className="ml-2 font-medium">{booking.sessionCount || 0}</span>
									</div>
								</div>

								{/* Price */}
								{booking.price && (
									<div className="flex items-center justify-between pt-2 border-t">
										<span className="text-gray-600">{t("booking.price", { defaultValue: "Үнэ" })}:</span>
										<span className="text-xl font-bold text-green-600">
											₮{booking.price.toLocaleString()}
										</span>
									</div>
								)}

								{/* Notes */}
								{booking.notes && (
									<div className="pt-2 border-t">
										<span className="text-xs text-gray-600">{t("booking.notes", { defaultValue: "Тэмдэглэл" })}:</span>
										<p className="text-sm text-gray-700 mt-1">{booking.notes}</p>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="p-4 bg-gray-50 border-t flex gap-2 justify-end">
								{booking.status === "accepted" && (
									<button
										onClick={() => handleOpenPayment(booking)}
										disabled={actionLoading === booking.id}
										className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
									>
										{actionLoading === booking.id ? (
											<FaSpinner className="animate-spin mr-2" />
										) : (
											<FaMoneyBillWave className="mr-2" />
										)}
										{t("booking.pay", { defaultValue: "Төлбөр төлөх" })}
									</button>
								)}

								{booking.status !== "completed" && booking.status !== "cancelled" && (
									<button
										onClick={() => handleCancel(booking.id)}
										disabled={actionLoading === booking.id}
										className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{actionLoading === booking.id ? (
											<FaSpinner className="animate-spin mr-2" />
										) : (
											<FaTimes className="mr-2" />
										)}
										{t("booking.cancel", { defaultValue: "Цуцлах" })}
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Payment Modal */}
			<PaymentModal
				booking={selectedBooking}
				isOpen={showPaymentModal}
				onClose={() => setShowPaymentModal(false)}
				onSuccess={handlePaymentSuccess}
			/>

			{/* Toast Notification */}
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					duration={3000}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
};

export default MyBookingsPage;
