import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner, FaCalendarAlt, FaClock, FaTimes, FaMoneyBillWave, FaMapMarkerAlt, FaUserTie, FaInfoCircle, FaFilter, FaSort } from "react-icons/fa";
import API from "../services/api";
import PaymentModal from "./PaymentModal";
import BookingCardSkeleton from "./BookingCardSkeleton";
import Toast from "./Toast";
import CancelConfirmModal from "./CancelConfirmModal";
import { formatDateLong } from "../utils/dateUtils";

const MyBookingsPage = () => {
	const { t } = useTranslation(["translation", "booking"]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionLoading, setActionLoading] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [toast, setToast] = useState(null);
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("date-desc");
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [bookingToCancel, setBookingToCancel] = useState(null);

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

	const handleOpenCancel = (booking) => {
		setBookingToCancel(booking);
		setShowCancelModal(true);
	};

	const handleConfirmCancel = async (bookingId) => {
		setActionLoading(bookingId);
		try {
			await API.cancelBooking(bookingId);
			setToast({
				message: t("booking.cancel_successful", { defaultValue: "Захиалга амжилттай цуцлагдлаа!" }),
				type: "success",
			});
			setShowCancelModal(false);
			setBookingToCancel(null);
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

	// Filter and sort bookings
	const filteredAndSortedBookings = useMemo(() => {
		let result = [...bookings];

		// Apply status filter
		if (statusFilter !== "all") {
			result = result.filter((booking) => booking.status === statusFilter);
		}

		// Apply sorting
		result.sort((a, b) => {
			switch (sortBy) {
				case "date-desc":
					return new Date(b.bookingDate) - new Date(a.bookingDate);
				case "date-asc":
					return new Date(a.bookingDate) - new Date(b.bookingDate);
				case "created-desc":
					return new Date(b.createdAt) - new Date(a.createdAt);
				case "created-asc":
					return new Date(a.createdAt) - new Date(b.createdAt);
				case "price-desc":
					return (b.price || 0) - (a.price || 0);
				case "price-asc":
					return (a.price || 0) - (b.price || 0);
				default:
					return 0;
			}
		});

		return result;
	}, [bookings, statusFilter, sortBy]);

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

	// Status count for filter badges
	const statusCounts = useMemo(() => {
		const counts = {
			all: bookings.length,
			pending: 0,
			accepted: 0,
			paid: 0,
			completed: 0,
			cancelled: 0,
		};
		bookings.forEach((booking) => {
			if (counts[booking.status] !== undefined) {
				counts[booking.status]++;
			}
		});
		return counts;
	}, [bookings]);

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

			{/* Filters and Sort Controls */}
			{bookings.length > 0 && (
				<div className="mb-6 space-y-4">
					{/* Status Filter Tabs */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
						<div className="flex items-center gap-2 mb-2">
							<FaFilter className="text-gray-500" />
							<span className="text-sm font-medium text-gray-700">
								{t("booking.filter_by_status", { defaultValue: "Төлөвөөр шүүх" })}
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{[
								{ key: "all", label: t("booking.all", { defaultValue: "Бүгд" }) },
								{ key: "pending", label: t("booking.status_pending", { defaultValue: "Хүлээгдэж буй" }) },
								{ key: "accepted", label: t("booking.status_accepted", { defaultValue: "Баталгаажсан" }) },
								{ key: "paid", label: t("booking.status_paid", { defaultValue: "Төлөгдсөн" }) },
								{ key: "completed", label: t("booking.status_completed", { defaultValue: "Дууссан" }) },
								{ key: "cancelled", label: t("booking.status_cancelled", { defaultValue: "Цуцлагдсан" }) },
							].map((status) => (
								<button
									key={status.key}
									onClick={() => setStatusFilter(status.key)}
									className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
										statusFilter === status.key
											? "bg-indigo-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{status.label}
									<span className="ml-1.5 text-xs opacity-75">({statusCounts[status.key] || 0})</span>
								</button>
							))}
						</div>
					</div>

					{/* Sort Control */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
						<div className="flex items-center gap-3">
							<FaSort className="text-gray-500" />
							<span className="text-sm font-medium text-gray-700">
								{t("booking.sort_by", { defaultValue: "Эрэмблэх" })}:
							</span>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							>
								<option value="date-desc">{t("booking.newest_booking_date", { defaultValue: "Огноогоор (шинэ эхэндээ)" })}</option>
								<option value="date-asc">{t("booking.oldest_booking_date", { defaultValue: "Огноогоор (хуучин эхэндээ)" })}</option>
								<option value="created-desc">{t("booking.newest_created", { defaultValue: "Үүсгэсэн огноогоор (шинэ)" })}</option>
								<option value="created-asc">{t("booking.oldest_created", { defaultValue: "Үүсгэсэн огноогоор (хуучин)" })}</option>
								<option value="price-desc">{t("booking.highest_price", { defaultValue: "Үнээр (өндрөөс нам руу)" })}</option>
								<option value="price-asc">{t("booking.lowest_price", { defaultValue: "Үнээр (намаас өндөр рүү)" })}</option>
							</select>
						</div>
					</div>

					{/* Results count */}
					<div className="text-sm text-gray-600">
						{t("booking.showing_bookings", { defaultValue: "Нийт" })}: {filteredAndSortedBookings.length} {t("booking.bookings", { defaultValue: "захиалга" })}
					</div>
				</div>
			)}

			{bookings.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
					<FaCalendarAlt className="mx-auto text-5xl mb-4 text-gray-300" />
					<p className="text-lg">{t("booking.no_bookings", { defaultValue: "Танд захиалга байхгүй байна." })}</p>
				</div>
			) : filteredAndSortedBookings.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
					<FaInfoCircle className="mx-auto text-5xl mb-4 text-gray-300" />
					<p className="text-lg">{t("booking.no_bookings_filter", { defaultValue: "Шүүлтүүрт тохирох захиалга олдсонгүй." })}</p>
					<button
						onClick={() => setStatusFilter("all")}
						className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
					>
						{t("booking.clear_filters", { defaultValue: "Шүүлтүүр арилгах" })}
					</button>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2">
					{filteredAndSortedBookings.map((booking) => (
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
												{formatDateLong(booking.bookingDate)}
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
										onClick={() => handleOpenCancel(booking)}
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

			{/* Cancel Confirmation Modal */}
			<CancelConfirmModal
				booking={bookingToCancel}
				isOpen={showCancelModal}
				onClose={() => {
					setShowCancelModal(false);
					setBookingToCancel(null);
				}}
				onConfirm={handleConfirmCancel}
				isLoading={actionLoading === bookingToCancel?.id}
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
