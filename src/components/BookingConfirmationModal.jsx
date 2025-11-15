import React from "react";
import { useTranslation } from "react-i18next";
import {
	FaTimes,
	FaCheckCircle,
	FaCalendarAlt,
	FaClock,
	FaMapMarkerAlt,
	FaUserTie,
	FaUsers,
	FaBook,
} from "react-icons/fa";

const BookingConfirmationModal = ({ bookingData, teacher, isOpen, onClose, onConfirm, isLoading }) => {
	const { t } = useTranslation(["translation", "booking"]);

	if (!isOpen || !bookingData) return null;

	const formatDate = (dateStr) => {
		if (!dateStr) return "-";
		return new Date(dateStr).toLocaleDateString("mn-MN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
					<div className="flex items-center gap-3">
						<FaCheckCircle className="text-2xl" />
						<h2 className="text-xl font-bold">
							{t("booking.confirm_booking", {
								defaultValue: "Захиалга баталгаажуулах",
							})}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-white hover:text-gray-200 transition"
						disabled={isLoading}
					>
						<FaTimes className="text-xl" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<p className="text-gray-700 text-sm">
						{t("booking.please_review", {
							defaultValue:
								"Захиалгын мэдээллээ шалгаад баталгаажуулна уу.",
						})}
					</p>

					{/* Teacher Info */}
					{teacher && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
									<FaUserTie className="text-white text-xl" />
								</div>
								<div>
									<div className="font-semibold text-gray-900">
										{teacher.name}
									</div>
									{teacher.specialization && (
										<div className="text-sm text-gray-600">
											{teacher.specialization}
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Booking Details */}
					<div className="space-y-3 bg-gray-50 rounded-lg p-4">
						{/* Date */}
						{bookingData.bookingDate && (
							<div className="flex items-center gap-3">
								<FaCalendarAlt className="text-indigo-600 text-lg" />
								<div>
									<div className="text-xs text-gray-500">
										{t("booking.date", { defaultValue: "Огноо" })}
									</div>
									<div className="font-medium text-gray-900">
										{formatDate(bookingData.bookingDate)}
									</div>
								</div>
							</div>
						)}

						{/* Time */}
						{bookingData.startTime && bookingData.endTime && (
							<div className="flex items-center gap-3">
								<FaClock className="text-indigo-600 text-lg" />
								<div>
									<div className="text-xs text-gray-500">
										{t("booking.time", { defaultValue: "Цаг" })}
									</div>
									<div className="font-medium text-gray-900">
										{bookingData.startTime} - {bookingData.endTime}
										{bookingData.durationMinutes && (
											<span className="text-sm text-gray-600 ml-2">
												({bookingData.durationMinutes} минут)
											</span>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Location */}
						{bookingData.location && (
							<div className="flex items-center gap-3">
								<FaMapMarkerAlt className="text-indigo-600 text-lg" />
								<div>
									<div className="text-xs text-gray-500">
										{t("booking.location", { defaultValue: "Байршил" })}
									</div>
									<div className="font-medium text-gray-900">
										{bookingData.location}
									</div>
								</div>
							</div>
						)}

						{/* Student & Session Count */}
						<div className="grid grid-cols-2 gap-4 pt-3 border-t">
							<div className="flex items-center gap-3">
								<FaUsers className="text-indigo-600" />
								<div>
									<div className="text-xs text-gray-500">
										{t("booking.student_count", {
											defaultValue: "Суралцагч",
										})}
									</div>
									<div className="font-medium text-gray-900">
										{bookingData.studentCount}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<FaBook className="text-indigo-600" />
								<div>
									<div className="text-xs text-gray-500">
										{t("booking.session_count", {
											defaultValue: "Хичээл",
										})}
									</div>
									<div className="font-medium text-gray-900">
										{bookingData.sessionCount}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Notes */}
					{bookingData.notes && (
						<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
							<div className="text-xs text-gray-500 mb-1">
								{t("booking.notes", { defaultValue: "Тэмдэглэл" })}
							</div>
							<div className="text-sm text-gray-700">
								{bookingData.notes}
							</div>
						</div>
					)}

					{/* Info Notice */}
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start gap-3">
						<div className="text-blue-600 text-lg mt-0.5">ℹ️</div>
						<div className="text-sm text-blue-900">
							{t("booking.confirmation_notice", {
								defaultValue:
									"Захиалга илгээсний дараа багш баталгаажуулах болно. Баталгаажсаны дараа төлбөр төлөх боломжтой.",
							})}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-3 p-4 border-t bg-gray-50">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
					>
						{t("booking.cancel", { defaultValue: "Цуцлах" })}
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center transition"
					>
						{isLoading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								{t("booking.submitting", { defaultValue: "Илгээж байна" })}...
							</>
						) : (
							<>
								<FaCheckCircle className="mr-2" />
								{t("booking.confirm_and_submit", {
									defaultValue: "Баталгаажуулах",
								})}
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default BookingConfirmationModal;
