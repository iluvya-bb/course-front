import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import {
	FaSpinner,
	FaBox,
	FaBook,
	FaCheck,
	FaShoppingCart,
	FaPercent,
	FaTags,
} from "react-icons/fa";

const PackagesPage = () => {
	const { t } = useTranslation();
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [purchasing, setPurchasing] = useState(false);
	const [purchaseError, setPurchaseError] = useState(null);
	const [purchaseSuccess, setPurchaseSuccess] = useState(null);

	useEffect(() => {
		fetchPackages();
	}, []);

	const fetchPackages = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await API.getPackages();
			setPackages(response.data.data || []);
		} catch (err) {
			console.error("Failed to fetch packages:", err);
			setError(err.response?.data?.error || "Failed to load packages");
		} finally {
			setLoading(false);
		}
	};

	const handlePurchase = async (packageId) => {
		setPurchasing(true);
		setPurchaseError(null);
		setPurchaseSuccess(null);
		try {
			const response = await API.purchasePackage(packageId);
			setPurchaseSuccess(response.data.message || "Package purchased successfully!");
			setSelectedPackage(null);
			// Refresh packages to update owned status
			await fetchPackages();
		} catch (err) {
			console.error("Failed to purchase package:", err);
			setPurchaseError(err.response?.data?.error || "Failed to purchase package");
		} finally {
			setPurchasing(false);
		}
	};

	const formatPrice = (price) => {
		if (price === null || price === undefined) return "0₮";
		return `${price.toLocaleString()}₮`;
	};

	if (loading) {
		return (
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
			<div
				className="fixed inset-0 overflow-hidden pointer-events-none"
				style={{ top: "5rem" }}
			>
				<motion.div
					className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-lavender/10 blur-3xl"
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
					className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl"
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
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-12"
				>
					<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-lavender/10 via-brand-coral/10 to-brand-yellow/10 border-2 border-brand-lavender/20 backdrop-blur-sm">
						<motion.div
							className="absolute top-0 right-0 w-64 h-64 bg-brand-coral/20 rounded-full blur-3xl"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.5, 0.3],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
							}}
						/>

						<div className="relative z-1 p-8 md:p-12">
							<div className="max-w-3xl">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-brand-lavender/20 mb-6"
								>
									<FaTags className="text-brand-coral" />
									<span className="font-semibold text-brand-lavender">
										Хэмнэлтийн багцууд
									</span>
								</motion.div>

								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent"
								>
									Хичээлийн багцууд
								</motion.h1>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="text-lg md:text-xl text-base-content/80 mb-6 leading-relaxed"
								>
									Багцаар авбал илүү хямд! Та аль хэдийн эзэмшсэн хичээлүүдийг хасч тооцно.
								</motion.p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Success/Error Messages */}
				<AnimatePresence>
					{purchaseSuccess && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-green-700 flex items-center gap-3"
						>
							<FaCheck className="text-green-500" />
							{purchaseSuccess}
						</motion.div>
					)}
					{purchaseError && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700"
						>
							{purchaseError}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Packages Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
				>
					<AnimatePresence mode="popLayout">
						{packages.map((pkg, index) => (
							<motion.div
								key={pkg.id}
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: -20 }}
								transition={{ delay: index * 0.05, duration: 0.3 }}
							>
								<PackageCard
									pkg={pkg}
									formatPrice={formatPrice}
									onSelect={() => setSelectedPackage(pkg)}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>

				{packages.length === 0 && (
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
							<FaBox className="text-4xl text-brand-lavender" />
						</motion.div>
						<p className="text-2xl font-bold text-base-content mb-2">
							Одоогоор багц байхгүй байна
						</p>
						<p className="text-base-content/60">
							Удахгүй шинэ багцууд гарна
						</p>
					</motion.div>
				)}
			</div>

			{/* Purchase Modal */}
			<PurchaseModal
				pkg={selectedPackage}
				formatPrice={formatPrice}
				onConfirm={() => handlePurchase(selectedPackage?.id)}
				onCancel={() => setSelectedPackage(null)}
				purchasing={purchasing}
			/>
		</div>
	);
};

const PackageCard = ({ pkg, formatPrice, onSelect }) => {
	const pricing = pkg.pricing || {};
	const allOwned = pricing.allCoursesOwned || pricing.neededCoursesCount === 0;
	const hasDiscount = (pricing.ownedValue || 0) > 0;

	return (
		<motion.div
			whileHover={{ y: -8, scale: 1.02 }}
			className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-brand-lavender/20 shadow-lg hover:shadow-2xl transition-all duration-300"
		>
			{/* Discount Badge */}
			{pkg.discountValue > 0 && (
				<div className="absolute top-4 right-4 z-10">
					<div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold shadow-lg">
						<FaPercent className="text-xs" />
						{pkg.discountType === "percentage"
							? `${pkg.discountValue}% хямдрал`
							: `${formatPrice(pkg.discountValue)} хямдрал`}
					</div>
				</div>
			)}

			<div className="p-6">
				{/* Package Icon */}
				<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center mb-4">
					<FaBox className="text-white text-2xl" />
				</div>

				{/* Title & Description */}
				<h3 className="text-xl font-bold text-base-content mb-2">{pkg.title}</h3>
				{pkg.description && (
					<p className="text-base-content/60 text-sm mb-4 line-clamp-2">
						{pkg.description}
					</p>
				)}

				{/* Courses List */}
				<div className="mb-4">
					<div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
						<FaBook className="text-brand-lavender" />
						<span>{pkg.courses?.length || 0} хичээл багтсан</span>
					</div>
					<div className="space-y-2 max-h-32 overflow-y-auto">
						{pkg.courses?.map((course) => {
							const isOwned = pricing.ownedCourses?.includes(course.id);
							return (
								<div
									key={course.id}
									className={`flex items-center justify-between text-sm p-2 rounded-lg ${
										isOwned
											? "bg-green-100 text-green-700"
											: "bg-gray-50 text-base-content"
									}`}
								>
									<span className="truncate flex-1">{course.title}</span>
									{isOwned ? (
										<span className="flex items-center gap-1 text-xs font-semibold">
											<FaCheck /> Эзэмшсэн
										</span>
									) : (
										<span className="text-xs font-semibold">
											{formatPrice(course.price)}
										</span>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Pricing */}
				<div className="border-t border-brand-lavender/20 pt-4 space-y-2">
					{/* Original Price */}
					<div className="flex justify-between text-sm text-base-content/60">
						<span>Нийт үнэ:</span>
						<span className={hasDiscount ? "line-through" : ""}>
							{formatPrice(pricing.totalValue)}
						</span>
					</div>

					{/* Owned Value Deduction */}
					{(pricing.ownedValue || 0) > 0 && (
						<div className="flex justify-between text-sm text-green-600">
							<span>Эзэмшсэн ({pricing.ownedCoursesCount || 0} хичээл):</span>
							<span>-{formatPrice(pricing.ownedValue)}</span>
						</div>
					)}

					{/* Package Discount */}
					{(pricing.packageDiscount || 0) > 0 && !allOwned && (
						<div className="flex justify-between text-sm text-green-600">
							<span>Багцын хямдрал:</span>
							<span>-{formatPrice(pricing.packageDiscount)}</span>
						</div>
					)}

					{/* Final Price */}
					<div className="flex justify-between items-center pt-2 border-t border-brand-lavender/10">
						<span className="font-bold text-base-content">Төлөх дүн:</span>
						<span className="text-2xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
							{formatPrice(pricing.finalPrice)}
						</span>
					</div>

					{/* Savings */}
					{(pricing.totalSavings || 0) > 0 && !allOwned && (
						<div className="text-center text-sm text-green-600 font-semibold">
							Та {formatPrice(pricing.totalSavings)} хэмнэнэ!
						</div>
					)}
				</div>

				{/* Action Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={onSelect}
					disabled={allOwned}
					className={`w-full mt-4 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
						allOwned
							? "bg-gray-200 text-gray-500 cursor-not-allowed"
							: "bg-gradient-to-r from-brand-lavender to-brand-coral text-white shadow-lg hover:shadow-xl"
					}`}
				>
					{allOwned ? (
						<>
							<FaCheck />
							Бүгдийг эзэмшсэн
						</>
					) : (
						<>
							<FaShoppingCart />
							Худалдаж авах
						</>
					)}
				</motion.button>
			</div>
		</motion.div>
	);
};

const PurchaseModal = ({ pkg, formatPrice, onConfirm, onCancel, purchasing }) => {
	if (!pkg) return null;

	const pricing = pkg.pricing || {};
	const ownedCourseIds = new Set(pricing.ownedCourses || []);
	const neededCourses = pkg.courses?.filter((c) => !ownedCourseIds.has(c.id)) || [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onCancel}
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
			/>

			{/* Modal */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.9, y: 20 }}
				className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
			>
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-2xl font-bold text-base-content">{pkg.title}</h2>
					<p className="text-base-content/60 text-sm mt-1">
						Худалдан авалтаа баталгаажуулна уу
					</p>
				</div>

				<div className="p-6 max-h-[50vh] overflow-y-auto">
					<h3 className="font-semibold text-base-content mb-3">
						Авах хичээлүүд ({neededCourses.length}):
					</h3>
					<div className="space-y-2">
						{neededCourses.map((course) => (
							<div
								key={course.id}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
							>
								<span className="text-sm text-base-content">{course.title}</span>
								<span className="text-sm font-semibold text-brand-lavender">
									{formatPrice(course.price)}
								</span>
							</div>
						))}
					</div>

					<div className="mt-6 p-4 bg-gradient-to-r from-brand-lavender/10 to-brand-coral/10 rounded-xl">
						<div className="flex justify-between items-center">
							<span className="font-bold text-base-content">Нийт төлөх:</span>
							<span className="text-2xl font-black bg-gradient-to-r from-brand-lavender to-brand-coral bg-clip-text text-transparent">
								{formatPrice(pricing.finalPrice)}
							</span>
						</div>
						{(pricing.totalSavings || 0) > 0 && (
							<p className="text-sm text-green-600 mt-2 text-center font-semibold">
								Та {formatPrice(pricing.totalSavings)} хэмнэж байна!
							</p>
						)}
					</div>
				</div>

				<div className="p-6 border-t border-gray-100 flex gap-3">
					<button
						onClick={onCancel}
						disabled={purchasing}
						className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-bold text-base-content hover:bg-gray-50 transition-colors"
					>
						Болих
					</button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onConfirm}
						disabled={purchasing}
						className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-lavender to-brand-coral text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
					>
						{purchasing ? (
							<>
								<FaSpinner className="animate-spin" />
								Уншиж байна...
							</>
						) : (
							<>
								<FaShoppingCart />
								Баталгаажуулах
							</>
						)}
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
};

export default PackagesPage;
