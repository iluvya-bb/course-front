import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import CourseCard from "./dashboard/CourseCard";
import API, { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
	FaUserCircle,
	FaWallet,
	FaEdit,
	FaSpinner,
	FaBookOpen,
} from "react-icons/fa";
import DepositModal from "./ui/DepositModal"; // <-- 1. Import the new modal

const SettingsPage = () => {
	const { t } = useTranslation(["translation", "settings"]);
	const { user } = useAuth();
	const [wallet, setWallet] = useState(null);
	const [subscriptions, setSubscriptions] = useState([]);
	const [loadingWallet, setLoadingWallet] = useState(true);
	const [loadingSubs, setLoadingSubs] = useState(true);
	const [error, setError] = useState(null);
	const [isDepositModalOpen, setIsDepositModalOpen] = useState(false); // <-- 2. State for modal

	// --- Fetch Wallet and Subscriptions ---
	const fetchWallet = async () => {
		// <-- Separate wallet fetch
		setLoadingWallet(true);
		// Don't clear general error here, only wallet specific error if needed
		try {
			const walletRes = await API.getMyWallet();
			setWallet(walletRes?.data?.data);
		} catch (err) {
			console.error("Failed to fetch wallet:", err);
			// Set error specific to wallet or rely on general error
			if (!error)
				setError(
					err.response?.data?.error ||
						err.message ||
						t("error_fetching_data", { ns: "settings" }),
				);
		} finally {
			setLoadingWallet(false);
		}
	};

	useEffect(() => {
		const fetchSubs = async () => {
			// Separate subs fetch
			if (!user) return;
			setLoadingSubs(true);
			if (!error) setError(null); // Clear error if no wallet error occurred
			try {
				const subsRes = await API.getMySubscriptions();
				setSubscriptions(subsRes?.data?.data || []);
			} catch (err) {
				console.error("Failed to fetch subscriptions:", err);
				if (!error)
					setError(
						err.response?.data?.error ||
							err.message ||
							t("error_fetching_data", { ns: "settings" }),
					);
			} finally {
				setLoadingSubs(false);
			}
		};

		if (user) {
			fetchWallet(); // Fetch wallet when user is available
			fetchSubs(); // Fetch subs when user is available
		} else {
			// Handle case where user might log out while on the page
			setLoadingWallet(false);
			setLoadingSubs(false);
		}
	}, [user, t]); // Rerun if user changes

	const isLoading = loadingWallet || loadingSubs; // Still use combined loading for initial page render
	const avatarUrl = user?.avatar ? `${API_URL}/${user.avatar}` : null;

	const formatBalance = (balanceValue) => {
		const numBalance = parseFloat(balanceValue);
		if (!isNaN(numBalance)) {
			return numBalance.toFixed(2);
		}
		console.warn("Invalid balance value received:", balanceValue);
		return "0.00";
	};

	// --- 3. Handler to open the modal ---
	const handleAddFundsClick = () => {
		setIsDepositModalOpen(true);
	};

	// --- 4. Handler for submitting the deposit from the modal ---
	const handleDepositSubmit = async (
		amount,
		setModalLoading,
		setModalError,
	) => {
		setModalLoading(true);
		setModalError(""); // Clear modal error
		setError(""); // Clear page error
		try {
			// Assuming your API.initiateDeposit takes { amount }
			// and returns updated wallet data or confirms success
			const response = await API.initiateDeposit({ amount });

			// Option 1: Update wallet state directly from response
			// setWallet(response.data.data); // If API returns the updated wallet

			// Option 2: Refetch wallet data after successful deposit
			await fetchWallet(); // Refetch to get the latest balance

			setIsDepositModalOpen(false); // Close modal on success
		} catch (err) {
			console.error("Deposit failed:", err);
			const errorMsg =
				err.response?.data?.error || t("deposit_failed", { ns: "settings" });
			setModalError(errorMsg); // Set error *within* the modal
		} finally {
			setModalLoading(false); // Stop modal loading indicator
		}
	};

	return (
		<>
			{/* Page Title */}
			<div className="p-6 md:p-8 bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8">
				<h1 className="text-2xl md:text-3xl font-bold text-base-content">
					{t("settings.title")}
				</h1>
				<p className="mt-2 text-base-content/80 text-lg">
					{t("settings.subtitle")}
				</p>
			</div>

			{error && !isLoading && (
				<div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
					{error}
				</div>
			)}

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<FaSpinner className="animate-spin text-indigo-600 mr-3 h-8 w-8" />
					<span>{t("loading")}...</span>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Column 1: User Info & Wallet */}
					<div className="lg:col-span-1 space-y-8">
						{/* User Info Card */}
						<div className="bg-neutral p-6 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A]">
							{/* ... user info ... */}
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold text-base-content flex items-center">
									<FaUserCircle className="mr-2" />{" "}
									{t("settings.user_info_heading")}
								</h3>
								<Link to="/profile">
									<Button
										variant="ghost"
										size="sm"
										className="flex items-center text-primary hover:bg-primary/10"
									>
										<FaEdit className="mr-1 h-3 w-3" /> {t("edit")}
									</Button>
								</Link>
							</div>
							{user ? (
								<div className="space-y-2 text-base-content/90">
									{" "}
									<div className="flex items-center space-x-3">
										{" "}
										{avatarUrl ? (
											<img
												src={avatarUrl}
												alt="Avatar"
												className="h-12 w-12 rounded-full object-cover border-2 border-primary"
											/>
										) : (
											<FaUserCircle className="h-12 w-12 text-gray-400" />
										)}{" "}
										<div>
											{" "}
											<p>
												<strong>{t("settings.username")}:</strong>{" "}
												{user.username || "N/A"}
											</p>{" "}
											<p>
												<strong>{t("settings.email")}:</strong>{" "}
												{user.email || "N/A"}
											</p>{" "}
										</div>{" "}
									</div>{" "}
									{user.createdAt && (
										<p className="text-sm mt-2">
											<strong>{t("settings.member_since")}:</strong>{" "}
											{new Date(user.createdAt).toLocaleDateString()}
										</p>
									)}{" "}
								</div>
							) : (
								<p className="text-base-content/70">
									{t("user_info_unavailable")}
								</p>
							)}
						</div>

						{/* Wallet Card */}
						<div className="bg-neutral p-6 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A]">
							<h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
								<FaWallet className="mr-2" /> {t("settings.wallet_heading")}
							</h3>
							{loadingWallet ? ( // Show specific loader for wallet balance refresh
								<div className="flex items-center text-gray-500">
									<FaSpinner className="animate-spin mr-2" /> {t("loading")}...
								</div>
							) : wallet ? (
								<div className="text-base-content/90">
									<p className="text-3xl font-bold text-primary break-words">
										{formatBalance(wallet.balance)} {wallet.currency || "MNT"}
									</p>
									<p className="text-sm mt-1">
										{t("settings.current_balance")}
									</p>

									{/* --- 5. Updated Button to open modal --- */}
									<Button
										size="sm"
										className="mt-4"
										onClick={handleAddFundsClick}
										disabled
									>
										{t("settings.add_funds")}
									</Button>
									{/* Removed Link */}
									{/* -------------------------------------- */}
								</div>
							) : !error ? (
								<p className="text-base-content/70">
									{t("settings.wallet_not_found")}
								</p>
							) : null}
						</div>
					</div>

					{/* Column 2: Subscribed Courses */}
					<div className="lg:col-span-2 bg-neutral p-6 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#1A1A1A]">
						{/* ... subscribed courses ... */}
						<h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
							<FaBookOpen className="mr-2" />{" "}
							{t("settings.subscribed_courses_heading")}
						</h3>
						{loadingSubs ? (
							<div className="flex items-center text-gray-500">
								<FaSpinner className="animate-spin mr-2" /> {t("loading")}...
							</div>
						) : subscriptions.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{" "}
								{subscriptions.map((sub) =>
									sub.course ? (
										<CourseCard
											key={sub.id}
											course={{
												...sub.course,
												subscribed: true,
												progress: sub.progress ?? 0,
											}}
										/>
									) : null,
								)}{" "}
							</div>
						) : !error ? (
							<p className="text-base-content/70">
								{t("settings.no_subscribed_courses")}
							</p>
						) : null}
					</div>
				</div>
			)}

			{/* --- 6. Render the Deposit Modal --- */}
			<DepositModal
				isOpen={isDepositModalOpen}
				onClose={() => setIsDepositModalOpen(false)}
				onDeposit={handleDepositSubmit} // Pass the submit handler
			/>
			{/* --------------------------------- */}
		</>
	);
};

export default SettingsPage;
