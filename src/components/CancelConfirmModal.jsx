import React from "react";
import { useTranslation } from "react-i18next";
import { FaTimes, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const CancelConfirmModal = ({ booking, isOpen, onClose, onConfirm, isLoading }) => {
	const { t } = useTranslation(["translation", "booking"]);

	if (!isOpen || !booking) return null;

	const handleConfirm = () => {
		onConfirm(booking.id);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b bg-red-50">
					<div className="flex items-center gap-3">
						<FaExclamationTriangle className="text-2xl text-red-600" />
						<h2 className="text-xl font-bold text-gray-900">
							{t("booking.confirm_cancellation", {
								defaultValue: "Захиалга цуцлах",
							})}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition"
						disabled={isLoading}
					>
						<FaTimes className="text-xl" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<p className="text-gray-700">
						{t("booking.cancel_warning", {
							defaultValue:
								"Та захиалга цуцлахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.",
						})}
					</p>

					{/* Booking Info */}
					<div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">
								{t("booking.booking_id", { defaultValue: "Захиалгын дугаар" })}:
							</span>
							<span className="font-medium">#{booking.id}</span>
						</div>
						{booking.bookingDate && (
							<div className="flex justify-between">
								<span className="text-gray-600">
									{t("booking.date", { defaultValue: "Огноо" })}:
								</span>
								<span className="font-medium">
									{new Date(booking.bookingDate).toLocaleDateString("mn-MN")}
								</span>
							</div>
						)}
						{booking.teacher && (
							<div className="flex justify-between">
								<span className="text-gray-600">
									{t("booking.teacher", { defaultValue: "Багш" })}:
								</span>
								<span className="font-medium">{booking.teacher.name}</span>
							</div>
						)}
					</div>

					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
						<FaExclamationTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
						<p className="text-sm text-yellow-800">
							{t("booking.cancel_policy", {
								defaultValue:
									"Цуцлалтын бодлого: Хэрэв та урьдчилсан төлбөр төлсөн бол буцаан олгох боломжтой.",
							})}
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-3 p-4 border-t bg-gray-50">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
					>
						{t("booking.go_back", { defaultValue: "Буцах" })}
					</button>
					<button
						onClick={handleConfirm}
						disabled={isLoading}
						className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center transition"
					>
						{isLoading ? (
							<>
								<FaSpinner className="animate-spin mr-2" />
								{t("booking.cancelling", { defaultValue: "Цуцлаж байна" })}...
							</>
						) : (
							<>
								<FaTimes className="mr-2" />
								{t("booking.confirm_cancel", { defaultValue: "Цуцлах" })}
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CancelConfirmModal;
