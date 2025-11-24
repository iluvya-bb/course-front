import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FaSpinner, FaCalendarAlt, FaUserTie, FaClock, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import API from "../services/api";

const BookingPage = () => {
	const { t } = useTranslation(["translation", "booking"]);
	const [teachers, setTeachers] = useState([]);
	const [selectedTeacherId, setSelectedTeacherId] = useState("");
	const [bookingTime, setBookingTime] = useState("");
	const [durationMinutes, setDurationMinutes] = useState("60");
	const [notes, setNotes] = useState("");
	const [loadingTeachers, setLoadingTeachers] = useState(true);
	const [isBooking, setIsBooking] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const fetchTeachers = async () => {
			setLoadingTeachers(true);
			setError("");
			try {
				const response = await API.getTeachers();
				setTeachers(response.data.data || []);
			} catch (err) {
				console.error("Failed to fetch teachers:", err);
				setError(t("error_fetch_teachers", { ns: "booking" }));
			} finally {
				setLoadingTeachers(false);
			}
		};
		fetchTeachers();
	}, [t]);

	const handleBookingSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		if (!selectedTeacherId || !bookingTime || !durationMinutes) {
			setError(t("error_fields_required", { ns: "booking" }));
			return;
		}

		setIsBooking(true);
		try {
			const bookingData = {
				teacherId: selectedTeacherId,
				bookingTime,
				durationMinutes: parseInt(durationMinutes, 10),
				notes: notes.trim() || null,
			};
			const response = await API.createBooking(bookingData);
			setSuccessMessage(t("booking_successful", { ns: "booking" }));
			setSelectedTeacherId("");
			setBookingTime("");
			setDurationMinutes("60");
			setNotes("");
			console.log("Booking created:", response.data.data);
		} catch (err) {
			console.error("Booking failed:", err);
			setError(
				err.response?.data?.error ||
				t("error_booking_failed", { ns: "booking" }),
			);
		} finally {
			setIsBooking(false);
		}
	};

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
					className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl"
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
					className="absolute bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-lavender/10 blur-3xl"
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
				<div className="max-w-3xl mx-auto">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-8"
					>
						<div className="flex items-center gap-4 mb-4">
							<div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center">
								<FaCalendarAlt className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent">
									{t("booking.book_teacher_title")}
								</h1>
								<p className="text-base-content/60 mt-1">
									{t("booking.book_teacher_subtitle", { defaultValue: "Өөрт тохирсон багшаа сонгоод хичээл захиалаарай" })}
								</p>
							</div>
						</div>
					</motion.div>

					{/* Error & Success Messages */}
					{error && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="p-4 mb-6 text-red-700 bg-red-100 border-2 border-red-300 rounded-xl flex items-start gap-3"
						>
							<div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
								<span className="text-red-700 font-bold text-sm">!</span>
							</div>
							<span>{error}</span>
						</motion.div>
					)}

					{successMessage && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="p-4 mb-6 text-green-700 bg-green-100 border-2 border-green-300 rounded-xl flex items-start gap-3"
						>
							<FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
							<span>{successMessage}</span>
						</motion.div>
					)}

					{/* Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-brand-lavender/20 p-8 shadow-2xl"
					>
						<form onSubmit={handleBookingSubmit} className="space-y-6">
							{/* Teacher Selection */}
							<div>
								<Label htmlFor="teacherId" className="flex items-center mb-3 text-lg font-bold text-base-content">
									<div className="w-8 h-8 rounded-full bg-brand-lavender/20 flex items-center justify-center mr-3">
										<FaUserTie className="text-brand-lavender" />
									</div>
									{t("booking.select_teacher")}
									<span className="text-red-500 ml-1">*</span>
								</Label>

								{loadingTeachers ? (
									<div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl">
										<FaSpinner className="animate-spin text-brand-lavender mr-3 text-xl" />
										<span className="text-gray-600">{t("loading_teachers", { ns: "booking" })}...</span>
									</div>
								) : (
									<motion.div whileFocus={{ scale: 1.01 }}>
										<select
											id="teacherId"
											value={selectedTeacherId}
											onChange={(e) => setSelectedTeacherId(e.target.value)}
											required
											className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-brand-lavender focus:border-transparent bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
											disabled={isBooking || teachers.length === 0}
										>
											<option value="" disabled>
												{t("booking.choose_teacher")}
											</option>
											{teachers.map((teacher) => (
												<option key={teacher.id} value={teacher.id}>
													{teacher.name} {teacher.title ? `(${teacher.title})` : ""}
												</option>
											))}
										</select>
									</motion.div>
								)}

								{!loadingTeachers && teachers.length === 0 && !error && (
									<p className="text-sm text-gray-500 mt-2 ml-1">
										{t("no_teachers_available", { ns: "booking" })}
									</p>
								)}
							</div>

							{/* Date and Time Selection */}
							<div>
								<Label htmlFor="bookingTime" className="flex items-center mb-3 text-lg font-bold text-base-content">
									<div className="w-8 h-8 rounded-full bg-brand-coral/20 flex items-center justify-center mr-3">
										<FaCalendarAlt className="text-brand-coral" />
									</div>
									{t("select_time", { ns: "booking" })}
									<span className="text-red-500 ml-1">*</span>
								</Label>
								<motion.div whileFocus={{ scale: 1.01 }}>
									<Input
										id="bookingTime"
										type="datetime-local"
										value={bookingTime}
										onChange={(e) => setBookingTime(e.target.value)}
										required
										className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-brand-coral focus:border-transparent bg-white transition-all disabled:bg-gray-100"
										disabled={isBooking}
									/>
								</motion.div>
								<p className="text-xs text-gray-500 mt-2 ml-1">
									{t("booking.time_notice", { defaultValue: "Та хүссэн огноо болон цагаа сонгоно уу" })}
								</p>
							</div>

							{/* Duration Dropdown */}
							<div>
								<Label htmlFor="duration" className="flex items-center mb-3 text-lg font-bold text-base-content">
									<div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center mr-3">
										<FaClock className="text-brand-yellow" />
									</div>
									{t("duration_minutes", { ns: "booking" })}
									<span className="text-red-500 ml-1">*</span>
								</Label>
								<motion.div whileFocus={{ scale: 1.01 }}>
									<select
										id="duration"
										value={durationMinutes}
										onChange={(e) => setDurationMinutes(e.target.value)}
										required
										className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-brand-yellow focus:border-transparent bg-white transition-all disabled:bg-gray-100"
										disabled={isBooking}
									>
										<option value="30">
											{t("duration.30", { ns: "booking", defaultValue: "30 минут" })}
										</option>
										<option value="45">
											{t("duration.45", { ns: "booking", defaultValue: "45 минут" })}
										</option>
										<option value="60">
											{t("duration.60", { ns: "booking", defaultValue: "60 минут (1 цаг)" })}
										</option>
										<option value="90">
											{t("duration.90", { ns: "booking", defaultValue: "90 минут" })}
										</option>
										<option value="120">
											{t("duration.120", { ns: "booking", defaultValue: "120 минут (2 цаг)" })}
										</option>
									</select>
								</motion.div>
							</div>

							{/* Notes */}
							<div>
								<Label htmlFor="notes" className="flex items-center mb-3 text-lg font-bold text-base-content">
									{t("notes", { ns: "booking" })}
									<span className="text-gray-400 text-sm font-normal ml-2">
										({t("optional", { defaultValue: "заавал биш" })})
									</span>
								</Label>
								<motion.div whileFocus={{ scale: 1.01 }}>
									<textarea
										id="notes"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										rows="4"
										placeholder={t("booking.notes_placeholder", { defaultValue: "Та нэмэлт мэдээлэл бичиж болно..." })}
										className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-brand-lavender focus:border-transparent bg-white transition-all resize-none disabled:bg-gray-100"
										disabled={isBooking}
									/>
								</motion.div>
							</div>

							{/* Submit Button */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="pt-4"
							>
								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
									disabled={isBooking || loadingTeachers || teachers.length === 0}
								>
									{isBooking ? (
										<span className="flex items-center justify-center">
											<FaSpinner className="animate-spin mr-3" />
											{t("booking.booking_submitting", { defaultValue: "Захиалж байна..." })}
										</span>
									) : (
										<span className="flex items-center justify-center">
											<FaPaperPlane className="mr-3" />
											{t("booking.submit_booking_request", { defaultValue: "Захиалга илгээх" })}
										</span>
									)}
								</Button>
							</motion.div>
						</form>
					</motion.div>

					{/* Info Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-8 bg-gradient-to-r from-brand-lavender/10 to-brand-coral/10 rounded-2xl p-6 border-2 border-brand-lavender/20"
					>
						<h3 className="font-bold text-lg mb-3 text-base-content">
							{t("booking.how_it_works", { defaultValue: "Хэрхэн ажилладаг вэ?" })}
						</h3>
						<ol className="space-y-2 text-sm text-base-content/80">
							<li className="flex items-start gap-3">
								<span className="w-6 h-6 rounded-full bg-brand-lavender text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">1</span>
								<span>{t("booking.step1", { defaultValue: "Багш, огноо, цагаа сонгоно" })}</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-6 h-6 rounded-full bg-brand-coral text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">2</span>
								<span>{t("booking.step2", { defaultValue: "Багш таны захиалгыг баталгаажуулна" })}</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-6 h-6 rounded-full bg-brand-yellow text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">3</span>
								<span>{t("booking.step3", { defaultValue: "Төлбөрөө төлөөд хичээлдээ орно" })}</span>
							</li>
						</ol>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default BookingPage;
