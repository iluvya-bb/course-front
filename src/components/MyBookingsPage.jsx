import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaCalendarAlt, FaClock, FaTimes, FaMoneyBillWave, FaMapMarkerAlt, FaUserTie, FaInfoCircle, FaFilter, FaSort, FaCheckCircle } from "react-icons/fa";
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

	const filteredAndSortedBookings = useMemo(() => {
		let result = [...bookings];

		if (statusFilter !== "all") {
			result = result.filter((booking) => booking.status === statusFilter);
		}

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
			pending: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300", icon: FaClock },
			accepted: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", icon: FaCheckCircle },
			paid: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", icon: FaCheckCircle },
			completed: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", icon: FaCheckCircle },
			cancelled: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", icon: FaTimes },
		};
		const labels = {
			pending: t("booking.status_pending", { defaultValue: "Хүлээгдэж буй" }),
			accepted: t("booking.status_accepted", { defaultValue: "Баталгаажсан" }),
			paid: t("booking.status_paid", { defaultValue: "Төлөгдсөн" }),
			completed: t("booking.status_completed", { defaultValue: "Дууссан" }),
			cancelled: t("booking.status_cancelled", { defaultValue: "Цуцлагдсан" }),
		};

		const badge = badges[status] || badges.pending;
		const Icon = badge.icon;

		return (
			<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
				<Icon className="text-sm" />
				{labels[status] || status}
			</span>
		);
	};

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
			<div className="relative -mx-4 sm:-mx-6 -my-8 min-h-[calc(100vh-6rem)]">
				<div className="relative z-10 px-4 sm:px-6 py-8">
					<div className="flex justify-center items-center min-h-[60vh]">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							className="text-center"
						>
							<FaSpinner className="animate-spin text-brand-lavender mx-auto h-12 w-12 mb-4" />
							<span className="text-base-content text-lg">{t("loading")}...</span>
						</motion.div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="p-6 text-red-600 bg-red-100 rounded-xl border-2 border-red-300"
			>
				<strong>Error:</strong> {error}
			</motion.div>
		);
	}

	return (
		<div className="relative -mx-4 sm:-mx-6 -my-8 min-h-[calc(100vh-6rem)]">
			{/* Grid Background */}
			<div
				className="fixed inset-0 opacity-[0.08] pointer-events-none"
				style={{
					backgroundImage: `
						linear-gradient(to right, #7776bc 1px, transparent 1px),
						linear-gradient(to bottom, #7776bc 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
					top: "5rem",
				}}
			/>

			{/* Animated gradient blobs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ top: "5rem" }}>
				<motion.div
					className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						x: [0, 50, 0],
						y: [0, 30, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl"
					animate={{
						scale: [1, 1.3, 1],
						x: [0, -50, 0],
						y: [0, -30, 0],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 px-4 sm:px-6 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<div className="flex items-center gap-4 mb-4">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center">
							<FaCalendarAlt className="text-white text-xl" />
						</div>
						<h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent">
							{t("booking.my_bookings", { defaultValue: "Миний захиалгууд" })}
						</h1>
					</div>

					{/* Stats Summary */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="grid grid-cols-2 md:grid-cols-5 gap-4"
					>
						{[
							{ key: "pending", label: t("booking.status_pending", { defaultValue: "Хүлээгдэж буй" }), color: "yellow" },
							{ key: "accepted", label: t("booking.status_accepted", { defaultValue: "Баталгаажсан" }), color: "blue" },
							{ key: "paid", label: t("booking.status_paid", { defaultValue: "Төлөгдсөн" }), color: "green" },
							{ key: "completed", label: t("booking.status_completed", { defaultValue: "Дууссан" }), color: "gray" },
							{ key: "cancelled", label: t("booking.status_cancelled", { defaultValue: "Цуцлагдсан" }), color: "red" },
						].map((stat) => (
							<div key={stat.key} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200">
								<div className="text-2xl font-bold text-base-content">{statusCounts[stat.key] || 0}</div>
								<div className="text-xs text-base-content/60 mt-1">{stat.label}</div>
							</div>
						))}
					</motion.div>
				</motion.div>

				{/* Filters */}
				{bookings.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mb-8 space-y-4"
					>
						{/* Status Filter */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-brand-lavender/20">
							<div className="flex items-center gap-3 mb-4">
								<FaFilter className="text-brand-lavender text-lg" />
								<span className="text-lg font-bold text-base-content">
									{t("booking.filter_by_status", { defaultValue: "Төлөвөөр шүүх" })}
								</span>
							</div>
							<div className="flex flex-wrap gap-3">
								{[
									{ key: "all", label: t("booking.all", { defaultValue: "Бүгд" }) },
									{ key: "pending", label: t("booking.status_pending", { defaultValue: "Хүлээгдэж буй" }) },
									{ key: "accepted", label: t("booking.status_accepted", { defaultValue: "Баталгаажсан" }) },
									{ key: "paid", label: t("booking.status_paid", { defaultValue: "Төлөгдсөн" }) },
									{ key: "completed", label: t("booking.status_completed", { defaultValue: "Дууссан" }) },
									{ key: "cancelled", label: t("booking.status_cancelled", { defaultValue: "Цуцлагдсан" }) },
								].map((status) => (
									<motion.button
										key={status.key}
										onClick={() => setStatusFilter(status.key)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
											statusFilter === status.key
												? "bg-gradient-to-r from-brand-lavender to-brand-coral text-white shadow-lg"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										{status.label}
										<span className="ml-2 opacity-75">({statusCounts[status.key] || 0})</span>
									</motion.button>
								))}
							</div>
						</div>

						{/* Sort Control */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-brand-lavender/20">
							<div className="flex items-center gap-3">
								<FaSort className="text-brand-coral text-lg" />
								<span className="text-lg font-bold text-base-content">
									{t("booking.sort_by", { defaultValue: "Эрэмблэх" })}:
								</span>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-lavender focus:border-transparent bg-white"
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
					</motion.div>
				)}

				{/* Bookings Grid */}
				{bookings.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-20"
					>
						<motion.div
							animate={{ y: [0, -10, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-lavender/20 to-brand-coral/20 flex items-center justify-center"
						>
							<FaCalendarAlt className="text-4xl text-brand-lavender" />
						</motion.div>
						<p className="text-2xl font-bold text-base-content mb-2">
							{t("booking.no_bookings", { defaultValue: "Танд захиалга байхгүй байна." })}
						</p>
					</motion.div>
				) : filteredAndSortedBookings.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-20"
					>
						<FaInfoCircle className="mx-auto text-6xl mb-6 text-brand-coral" />
						<p className="text-2xl font-bold text-base-content mb-4">
							{t("booking.no_bookings_filter", { defaultValue: "Шүүлтүүрт тохирох захиалга олдсонгүй." })}
						</p>
						<motion.button
							onClick={() => setStatusFilter("all")}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-6 py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-full font-bold shadow-lg"
						>
							{t("booking.clear_filters", { defaultValue: "Шүүлтүүр арилгах" })}
						</motion.button>
					</motion.div>
				) : (
					<motion.div
						className="grid gap-6 md:grid-cols-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<AnimatePresence mode="popLayout">
							{filteredAndSortedBookings.map((booking, index) => (
								<motion.div
									key={booking.id}
									initial={{ opacity: 0, scale: 0.9, y: 20 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.9, y: -20 }}
									transition={{ delay: index * 0.05 }}
									whileHover={{ y: -5 }}
									className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-brand-lavender/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
								>
									{/* Header */}
									<div className="bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow p-5">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-black text-white">
												{t("booking.booking_id", { defaultValue: "Захиалга" })} #{booking.id}
											</h3>
											{getStatusBadge(booking.status)}
										</div>
									</div>

									{/* Content */}
									<div className="p-6 space-y-4">
										{/* Teacher Info */}
										{booking.teacher && (
											<div className="flex items-start pb-4 border-b-2 border-gray-100">
												<div className="w-12 h-12 rounded-full bg-brand-lavender/20 flex items-center justify-center mr-4">
													<FaUserTie className="text-brand-lavender text-xl" />
												</div>
												<div className="flex-1">
													<div className="font-bold text-gray-900 text-lg">
														{booking.teacher.name}
													</div>
													{booking.teacher.specialization && (
														<div className="text-sm text-gray-600 mt-1">
															{booking.teacher.specialization}
														</div>
													)}
												</div>
											</div>
										)}

										{/* Date & Time */}
										{booking.bookingDate && (
											<div className="flex items-start">
												<FaCalendarAlt className="text-brand-coral text-lg mr-3 mt-1" />
												<div>
													<div className="font-semibold text-gray-900">
														{formatDateLong(booking.bookingDate)}
													</div>
													{booking.startTime && booking.endTime && (
														<div className="text-sm text-gray-600 flex items-center mt-1">
															<FaClock className="mr-2" />
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
												<FaMapMarkerAlt className="text-brand-yellow text-lg mr-3" />
												<span className="font-medium">{booking.location}</span>
											</div>
										)}

										{/* Details Grid */}
										<div className="grid grid-cols-2 gap-4 py-4 border-t-2 border-gray-100">
											<div className="text-center">
												<div className="text-2xl font-bold text-brand-lavender">{booking.studentCount || 0}</div>
												<div className="text-xs text-gray-600 mt-1">{t("booking.student_count", { defaultValue: "Суралцагч" })}</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-brand-coral">{booking.sessionCount || 0}</div>
												<div className="text-xs text-gray-600 mt-1">{t("booking.session_count", { defaultValue: "Хичээл" })}</div>
											</div>
										</div>

										{/* Price */}
										{booking.price && (
											<div className="flex items-center justify-between py-4 border-t-2 border-gray-100">
												<span className="text-gray-600 font-medium">{t("booking.price", { defaultValue: "Үнэ" })}:</span>
												<span className="text-2xl font-black text-green-600">
													₮{booking.price.toLocaleString()}
												</span>
											</div>
										)}

										{/* Notes */}
										{booking.notes && (
											<div className="py-4 border-t-2 border-gray-100">
												<span className="text-xs font-semibold text-gray-600 uppercase">{t("booking.notes", { defaultValue: "Тэмдэглэл" })}</span>
												<p className="text-sm text-gray-700 mt-2">{booking.notes}</p>
											</div>
										)}
									</div>

									{/* Actions */}
									<div className="p-4 bg-gray-50 border-t-2 flex gap-3 justify-end">
										{booking.status === "accepted" && (
											<motion.button
												onClick={() => handleOpenPayment(booking)}
												disabled={actionLoading === booking.id}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
											>
												{actionLoading === booking.id ? (
													<FaSpinner className="animate-spin mr-2" />
												) : (
													<FaMoneyBillWave className="mr-2" />
												)}
												{t("booking.pay", { defaultValue: "Төлбөр төлөх" })}
											</motion.button>
										)}

										{booking.status !== "completed" && booking.status !== "cancelled" && (
											<motion.button
												onClick={() => handleOpenCancel(booking)}
												disabled={actionLoading === booking.id}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
											>
												{actionLoading === booking.id ? (
													<FaSpinner className="animate-spin mr-2" />
												) : (
													<FaTimes className="mr-2" />
												)}
												{t("booking.cancel", { defaultValue: "Цуцлах" })}
											</motion.button>
										)}
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</motion.div>
				)}
			</div>

			{/* Modals */}
			<PaymentModal
				booking={selectedBooking}
				isOpen={showPaymentModal}
				onClose={() => setShowPaymentModal(false)}
				onSuccess={handlePaymentSuccess}
			/>

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
