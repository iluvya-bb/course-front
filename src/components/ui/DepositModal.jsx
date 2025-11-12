import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { FaTimes, FaSpinner, FaWallet } from "react-icons/fa";

const DepositModal = ({ isOpen, onClose, onDeposit }) => {
	const { t } = useTranslation(["translation", "settings"]); // Use relevant namespaces
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Reset state when modal opens/closes
	useEffect(() => {
		if (!isOpen) {
			setAmount("");
			setLoading(false);
			setError("");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleAmountChange = (e) => {
		// Allow only numbers and optionally one decimal point
		const value = e.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
			setAmount(value);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const depositAmount = parseFloat(amount);
		if (isNaN(depositAmount) || depositAmount <= 0) {
			setError(t("error_invalid_amount", { ns: "settings" }));
			return;
		}
		// Call the handler passed from SettingsPage
		onDeposit(depositAmount, setLoading, setError);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			<div
				className="bg-base-100 p-6 rounded-lg shadow-lg max-w-sm w-full border-2 border-neutral relative"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					disabled={loading}
					className="absolute top-3 right-3 text-base-content/50 hover:text-error transition-colors"
					aria-label={t("close")}
				>
					<FaTimes size={18} />
				</button>

				<h2 className="text-xl font-bold text-base-content mb-4 flex items-center">
					<FaWallet className="mr-2" /> {t("settings.add_funds")}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="depositAmount">
							{t("deposit_amount", { ns: "settings" })} (MNT)
						</Label>
						<Input
							id="depositAmount"
							type="number" // Use number, but validation handles decimals/negatives
							value={amount}
							onChange={handleAmountChange}
							placeholder={t("enter_amount", { ns: "settings" })}
							required
							min="1" // Example minimum
							step="any" // Allow decimals
							className="input input-bordered w-full bg-base-200 rounded disabled:bg-gray-200 mt-1"
							disabled={loading}
						/>
					</div>

					{error && <p className="text-error text-sm text-center">{error}</p>}

					<div className="flex justify-end space-x-3 pt-2">
						<Button
							type="button" // Important: type="button" to prevent form submission
							variant="ghost"
							onClick={onClose}
							disabled={loading}
						>
							{t("cancel")}
						</Button>
						<Button
							type="submit"
							disabled={loading || !amount || parseFloat(amount) <= 0}
							className="flex items-center"
						>
							{loading && (
								<FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
							)}
							{loading
								? t("processing")
								: t("confirm_deposit", { ns: "settings" })}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default DepositModal;
