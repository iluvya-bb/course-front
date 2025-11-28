import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	FaWallet,
	FaPlus,
	FaHistory,
	FaSpinner,
	FaMoneyBillWave,
	FaArrowUp,
	FaArrowDown,
} from "react-icons/fa";
import API from "../services/api";
import QPayPayment from "./QPayPayment";

const WalletPage = () => {
	const { t } = useTranslation();
	const [wallet, setWallet] = useState(null);
	const [transactions, setTransactions] = useState([]);
	const [qpayTransactions, setQpayTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeposit, setShowDeposit] = useState(false);
	const [depositAmount, setDepositAmount] = useState("");
	const [showQPay, setShowQPay] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	useEffect(() => {
		fetchWalletData();
	}, []);

	const fetchWalletData = async () => {
		setLoading(true);
		try {
			const [walletRes, transactionsRes, qpayRes] = await Promise.all([
				API.getMyWallet(),
				API.getMyTransactions({ limit: 20 }).catch(() => ({
					data: { data: [] },
				})),
				API.getMyQPayTransactions().catch(() => ({ data: { data: [] } })),
			]);

			setWallet(walletRes.data.data);
			setTransactions(transactionsRes.data.data || []);
			setQpayTransactions(qpayRes.data.data || []);
		} catch (error) {
			console.error("Failed to fetch wallet data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDepositClick = () => {
		setShowDeposit(true);
	};

	const handleDepositSubmit = (e) => {
		e.preventDefault();
		const amount = parseFloat(depositAmount);
		if (amount < 100) {
			alert(t("wallet.min_amount_error"));
			return;
		}
		setShowQPay(true);
	};

	const handleQPaySuccess = () => {
		setShowQPay(false);
		setShowDeposit(false);
		setDepositAmount("");
		// Refresh wallet data
		fetchWalletData();
	};

	const handleQPayCancel = () => {
		setShowQPay(false);
		setDepositAmount("");
	};

	const formatCurrency = (amount) => {
		return `₮${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getTransactionIcon = (type) => {
		switch (type) {
			case "deposit":
			case "credit":
				return <FaArrowDown className="text-green-500" />;
			case "withdrawal":
			case "debit":
			case "purchase":
				return <FaArrowUp className="text-red-500" />;
			default:
				return <FaMoneyBillWave className="text-gray-500" />;
		}
	};

	const getTransactionTypeLabel = (type) => {
		const labels = {
			deposit: t("wallet.deposit"),
			withdrawal: t("wallet.withdrawal"),
			credit: t("wallet.credit"),
			debit: t("wallet.debit"),
			purchase: t("wallet.purchase"),
		};
		return labels[type] || type;
	};

	const getQPayStatusBadge = (status) => {
		const badges = {
			pending: "bg-yellow-100 text-yellow-800",
			completed: "bg-green-100 text-green-800",
			failed: "bg-red-100 text-red-800",
			cancelled: "bg-gray-100 text-gray-800",
		};
		return badges[status] || "bg-gray-100 text-gray-800";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<FaSpinner className="animate-spin text-4xl text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
					<FaWallet className="text-primary" />
					{t("wallet.my_wallet")}
				</h1>
				<p className="text-gray-600 mt-2">{t("wallet.subtitle")}</p>
			</div>

			{/* Balance Card */}
			<div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-8 text-white mb-8">
				<div className="flex justify-between items-start">
					<div>
						<p className="text-white/80 text-sm mb-2">
							{t("wallet.current_balance")}
						</p>
						<h2 className="text-5xl font-bold">
							{formatCurrency(wallet?.balance || 0)}
						</h2>
					</div>
					<button
						onClick={handleDepositClick}
						className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
					>
						<FaPlus />
						{t("wallet.add_funds")}
					</button>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg shadow mb-6">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8 px-6">
						<button
							onClick={() => setActiveTab("overview")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "overview"
									? "border-primary text-primary"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
						>
							{t("wallet.overview")}
						</button>
						<button
							onClick={() => setActiveTab("transactions")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "transactions"
									? "border-primary text-primary"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
						>
							{t("wallet.transactions")}
						</button>
						<button
							onClick={() => setActiveTab("qpay")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "qpay"
									? "border-primary text-primary"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
						>
							{t("wallet.qpay_history")}
						</button>
					</nav>
				</div>

				<div className="p-6">
					{/* Overview Tab */}
					{activeTab === "overview" && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
									<p className="text-green-600 text-sm font-medium mb-2">
										{t("wallet.total_deposits")}
									</p>
									<p className="text-2xl font-bold text-green-800">
										{formatCurrency(
											qpayTransactions
												.filter((t) => t.status === "completed")
												.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
										)}
									</p>
								</div>
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
									<p className="text-blue-600 text-sm font-medium mb-2">
										{t("wallet.total_spent")}
									</p>
									<p className="text-2xl font-bold text-blue-800">
										{formatCurrency(
											transactions
												.filter((t) =>
													["withdrawal", "debit", "purchase"].includes(t.type),
												)
												.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
										)}
									</p>
								</div>
								<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
									<p className="text-purple-600 text-sm font-medium mb-2">
										{t("wallet.total_transactions")}
									</p>
									<p className="text-2xl font-bold text-purple-800">
										{transactions.length}
									</p>
								</div>
							</div>

							{/* Recent Transactions */}
							<div>
								<h3 className="text-lg font-semibold text-gray-800 mb-4">
									{t("wallet.recent_activity")}
								</h3>
								<div className="space-y-3">
									{transactions.slice(0, 5).map((txn) => (
										<div
											key={txn.id}
											className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<div className="p-2 bg-white rounded-lg">
													{getTransactionIcon(txn.type)}
												</div>
												<div>
													<p className="font-medium text-gray-800">
														{getTransactionTypeLabel(txn.type)}
													</p>
													<p className="text-sm text-gray-500">
														{txn.description || "-"}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p
													className={`font-semibold ${["deposit", "credit"].includes(txn.type) ? "text-green-600" : "text-red-600"}`}
												>
													{["deposit", "credit"].includes(txn.type) ? "+" : "-"}
													{formatCurrency(txn.amount)}
												</p>
												<p className="text-sm text-gray-500">
													{new Date(txn.createdAt).toLocaleDateString("mn-MN")}
												</p>
											</div>
										</div>
									))}
									{transactions.length === 0 && (
										<div className="text-center py-8 text-gray-500">
											{t("wallet.no_transactions")}
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Transactions Tab */}
					{activeTab === "transactions" && (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.date")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.type")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.description")}
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.amount")}
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.balance")}
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{transactions.map((txn) => (
										<tr key={txn.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(txn.createdAt).toLocaleString("mn-MN")}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													{getTransactionIcon(txn.type)}
													<span className="text-sm font-medium text-gray-900">
														{getTransactionTypeLabel(txn.type)}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{txn.description || "-"}
											</td>
											<td
												className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${["deposit", "credit"].includes(txn.type)
														? "text-green-600"
														: "text-red-600"
													}`}
											>
												{["deposit", "credit"].includes(txn.type) ? "+" : "-"}
												{formatCurrency(txn.amount)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
												{formatCurrency(txn.balanceAfter || 0)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{transactions.length === 0 && (
								<div className="text-center py-12 text-gray-500">
									{t("wallet.no_transactions")}
								</div>
							)}
						</div>
					)}

					{/* QPay Tab */}
					{activeTab === "qpay" && (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.date")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.invoice_no")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.status")}
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("wallet.amount")}
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{qpayTransactions.map((txn) => (
										<tr key={txn.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(txn.createdAt).toLocaleString("mn-MN")}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
												{txn.invoiceNo}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 text-xs font-medium rounded-full ${getQPayStatusBadge(txn.status)}`}
												>
													{txn.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
												{formatCurrency(txn.amount)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{qpayTransactions.length === 0 && (
								<div className="text-center py-12 text-gray-500">
									{t("wallet.no_qpay_transactions")}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Deposit Modal */}
			{showDeposit && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div
						className={`bg-white rounded-lg shadow-xl ${showQPay ? "max-w-2xl" : "max-w-md"} h-screen overflow-scroll w-full p-6`}
					>
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							{t("wallet.add_funds")}
						</h2>

						{!showQPay ? (
							<form onSubmit={handleDepositSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										{t("wallet.deposit_amount")} (MNT)
									</label>
									<input
										type="number"
										value={depositAmount}
										onChange={(e) => setDepositAmount(e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
										placeholder={t("wallet.enter_amount")}
										min="100"
										step="any"
										required
									/>
									<p className="text-xs text-gray-500 mt-1">
										{t("wallet.min_amount")}: 100₮
									</p>
								</div>

								<div className="flex justify-end gap-3 pt-4">
									<button
										type="button"
										onClick={() => {
											setShowDeposit(false);
											setDepositAmount("");
										}}
										className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										{t("wallet.cancel")}
									</button>
									<button
										type="submit"
										disabled={!depositAmount || parseFloat(depositAmount) < 100}
										className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{t("wallet.continue_to_payment")}
									</button>
								</div>
							</form>
						) : (
							<QPayPayment
								amount={parseFloat(depositAmount)}
								description="Wallet deposit"
								onSuccess={handleQPaySuccess}
								onCancel={handleQPayCancel}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default WalletPage;
