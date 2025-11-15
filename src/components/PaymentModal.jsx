import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	FaSpinner,
	FaTimes,
	FaWallet,
	FaMoneyBillWave,
	FaTag,
	FaCheckCircle,
} from "react-icons/fa";
import API from "../services/api";

const PaymentModal = ({ booking, isOpen, onClose, onSuccess }) => {
	const { t } = useTranslation(["translation", "booking"]);
	const [wallet, setWallet] = useState(null);
	const [promoCode, setPromoCode] = useState("");
	const [promoValidation, setPromoValidation] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState("wallet"); // wallet or cash
	const [loading, setLoading] = useState(false);
	const [validatingPromo, setValidatingPromo] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (isOpen) {
			fetchWallet();
			setPromoCode("");
			setPromoValidation(null);
			setError("");
		}
	}, [isOpen]);

	const fetchWallet = async () => {
		try {
			const response = await API.getMyWallet();
			setWallet(response.data.data);
		} catch (err) {
			console.error("Failed to fetch wallet:", err);
			setWallet(null);
		}
	};

	const handleValidatePromo = async () => {
		if (!promoCode.trim()) {
			setPromoValidation(null);
			return;
		}

		setValidatingPromo(true);
		setError("");

		try {
			const response = await API.validatePromoCode({
				code: promoCode,
				bookingId: booking.id,
			});

			setPromoValidation(response.data.data);
		} catch (err) {
			console.error("Promo validation failed:", err);
			setError(
				err.response?.data?.error ||
					t("booking.invalid_promo", {
						defaultValue: "Промо код буруу байна.",
					})
			);
			setPromoValidation(null);
		} finally {
			setValidatingPromo(false);
		}
	};

	const handlePayment = async () => {
		setLoading(true);
		setError("");

		try {
			const paymentData = {
				promoCode: promoCode.trim() || null,
				paymentMethod,
			};

			await API.payForBooking(booking.id, paymentData);

			if (onSuccess) {
				onSuccess();
			}
			onClose();
		} catch (err) {
			console.error("Payment failed:", err);
			setError(
				err.response?.data?.error ||
					t("booking.payment_failed", {
						defaultValue: "Төлбөр төлөхөд алдаа гарлаа.",
					})
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen || !booking) return null;

	const originalPrice = booking.price || 0;
	const discount = promoValidation?.discount || 0;
	const finalPrice = Math.max(0, originalPrice - discount);
	const hasEnoughBalance = wallet && wallet.balance >= finalPrice;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-bold text-gray-900">
						{t("booking.payment", { defaultValue: "Төлбөр төлөх" })}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition"
						disabled={loading}
					>
						<FaTimes className="text-xl" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 space-y-4">
					{/* Error Message */}
					{error && (
						<div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
							{error}
						</div>
					)}

					{/* Booking Details */}
					<div className="bg-gray-50 rounded-lg p-4 space-y-2">
						<h3 className="font-semibold text-gray-900">
							{t("booking.booking_details", {
								defaultValue: "Захиалгын дэлгэрэнгүй",
							})}
						</h3>
						<div className="text-sm space-y-1 text-gray-700">
							<div className="flex justify-between">
								<span>
									{t("booking.booking_id", { defaultValue: "Дугаар" })}:
								</span>
								<span className="font-medium">#{booking.id}</span>
							</div>
							{booking.bookingDate && (
								<div className="flex justify-between">
									<span>{t("booking.date", { defaultValue: "Огноо" })}:</span>
									<span className="font-medium">
										{new Date(booking.bookingDate).toLocaleDateString("mn-MN")}
									</span>
								</div>
							)}
							{booking.startTime && booking.endTime && (
								<div className="flex justify-between">
									<span>{t("booking.time", { defaultValue: "Цаг" })}:</span>
									<span className="font-medium">
										{booking.startTime.substring(0, 5)} -{" "}
										{booking.endTime.substring(0, 5)}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Wallet Balance */}
					{wallet && (
						<div
							className={`border rounded-lg p-4 ${
								hasEnoughBalance
									? "bg-green-50 border-green-200"
									: "bg-yellow-50 border-yellow-200"
							}`}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<FaWallet
										className={
											hasEnoughBalance ? "text-green-600" : "text-yellow-600"
										}
									/>
									<span className="font-medium text-gray-900">
										{t("booking.wallet_balance", {
											defaultValue: "Хэтэвчний үлдэгдэл",
										})}
									</span>
								</div>
								<span className="text-lg font-bold text-gray-900">
									₮{wallet.balance.toLocaleString()}
								</span>
							</div>
							{!hasEnoughBalance && (
								<p className="text-xs text-yellow-700 mt-2">
									{t("booking.insufficient_balance", {
										defaultValue:
											"Хэтэвчний үлдэгдэл хүрэлцэхгүй байна. Бэлнээр төлнө үү.",
									})}
								</p>
							)}
						</div>
					)}

					{/* Promo Code */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<FaTag className="inline mr-2 text-gray-500" />
							{t("booking.promo_code", {
								defaultValue: "Промо код (optional)",
							})}
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={promoCode}
								onChange={(e) => {
									setPromoCode(e.target.value.toUpperCase());
									setPromoValidation(null);
								}}
								placeholder="PROMO123"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								disabled={loading}
							/>
							<button
								onClick={handleValidatePromo}
								disabled={loading || validatingPromo || !promoCode.trim()}
								className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{validatingPromo ? (
									<FaSpinner className="animate-spin" />
								) : (
									t("booking.apply", { defaultValue: "Хэрэглэх" })
								)}
							</button>
						</div>
						{promoValidation && (
							<div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
								<FaCheckCircle />
								<span>
									{t("booking.discount", { defaultValue: "Хөнгөлөлт" })}:{" "}
									₮{discount.toLocaleString()}
								</span>
							</div>
						)}
					</div>

					{/* Payment Method */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t("booking.payment_method", {
								defaultValue: "Төлбөрийн хэлбэр",
							})}
						</label>
						<div className="space-y-2">
							<label
								className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
									paymentMethod === "wallet"
										? "border-indigo-500 bg-indigo-50"
										: "border-gray-300 hover:border-indigo-300"
								} ${!hasEnoughBalance ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<input
									type="radio"
									name="paymentMethod"
									value="wallet"
									checked={paymentMethod === "wallet"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									disabled={!hasEnoughBalance || loading}
									className="mr-3"
								/>
								<FaWallet className="mr-2 text-indigo-600" />
								<span className="font-medium">
									{t("booking.use_wallet", {
										defaultValue: "Хэтэвчээр төлөх",
									})}
								</span>
							</label>
							<label
								className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
									paymentMethod === "cash"
										? "border-indigo-500 bg-indigo-50"
										: "border-gray-300 hover:border-indigo-300"
								}`}
							>
								<input
									type="radio"
									name="paymentMethod"
									value="cash"
									checked={paymentMethod === "cash"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									disabled={loading}
									className="mr-3"
								/>
								<FaMoneyBillWave className="mr-2 text-green-600" />
								<span className="font-medium">
									{t("booking.use_cash", { defaultValue: "Бэлнээр төлөх" })}
								</span>
							</label>
						</div>
					</div>

					{/* Price Summary */}
					<div className="bg-gray-50 rounded-lg p-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">
								{t("booking.original_price", {
									defaultValue: "Анхны үнэ",
								})}
								:
							</span>
							<span className="font-medium">
								₮{originalPrice.toLocaleString()}
							</span>
						</div>
						{discount > 0 && (
							<div className="flex justify-between text-sm text-green-600">
								<span>
									{t("booking.discount", { defaultValue: "Хөнгөлөлт" })}:
								</span>
								<span className="font-medium">
									-₮{discount.toLocaleString()}
								</span>
							</div>
						)}
						<div className="flex justify-between text-lg font-bold border-t pt-2">
							<span>
								{t("booking.total", { defaultValue: "Нийт" })}:
							</span>
							<span className="text-indigo-600">
								₮{finalPrice.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-3 p-4 border-t bg-gray-50">
					<button
						onClick={onClose}
						disabled={loading}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{t("booking.cancel", { defaultValue: "Цуцлах" })}
					</button>
					<button
						onClick={handlePayment}
						disabled={
							loading || (paymentMethod === "wallet" && !hasEnoughBalance)
						}
						className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
					>
						{loading ? (
							<>
								<FaSpinner className="animate-spin mr-2" />
								{t("booking.processing", { defaultValue: "Боловсруулж байна" })}
								...
							</>
						) : (
							<>
								<FaMoneyBillWave className="mr-2" />
								{t("booking.confirm_payment", {
									defaultValue: "Төлбөр төлөх",
								})}
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
