import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button"; // Assuming UI components exist
import { Input } from "./ui/input"; // Assuming Input exists
import { Label } from "./ui/label"; // Assuming Label exists
import { FaSpinner, FaCalendarAlt, FaUserTie, FaClock } from "react-icons/fa"; // Added FaClock
import API from "../services/api"; // Your API service

const BookingPage = () => {
	const { t } = useTranslation(["translation", "booking"]);
	const [teachers, setTeachers] = useState([]);
	const [selectedTeacherId, setSelectedTeacherId] = useState("");
	const [bookingTime, setBookingTime] = useState("");
	// --- FIX: Change default duration state to string if using select ---
	const [durationMinutes, setDurationMinutes] = useState("60"); // Default duration as string
	// -----------------------------------------------------------------
	const [notes, setNotes] = useState("");
	const [loadingTeachers, setLoadingTeachers] = useState(true);
	const [isBooking, setIsBooking] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	// Fetch teachers on mount (no changes needed here)
	useEffect(() => {
		const fetchTeachers = async () => {
			/* ... */
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

	// Handle form submission (ensure durationMinutes is sent as a number)
	const handleBookingSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		if (!selectedTeacherId || !bookingTime || !durationMinutes) {
			// Added check for duration
			setError(t("error_fields_required", { ns: "booking" }));
			return;
		}

		setIsBooking(true);
		try {
			const bookingData = {
				teacherId: selectedTeacherId,
				bookingTime,
				// --- FIX: Ensure durationMinutes is parsed to integer ---
				durationMinutes: parseInt(durationMinutes, 10),
				// -------------------------------------------------------
				notes: notes.trim() || null, // Send null if notes are empty
			};
			const response = await API.createBooking(bookingData);
			setSuccessMessage(t("booking_successful", { ns: "booking" }));
			setSelectedTeacherId("");
			setBookingTime("");
			setDurationMinutes("60"); // Reset to default string
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
		<div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md border border-neutral">
			<h1 className="text-2xl md:text-3xl font-bold text-base-content mb-6">
				<FaCalendarAlt className="inline mr-2 mb-1" />{" "}
				{t("booking.book_teacher_title")}
			</h1>

			{/* Error & Success Messages */}
			{error && (
				<div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
					{error}
				</div>
			)}
			{successMessage && (
				<div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-300 rounded-md">
					{successMessage}
				</div>
			)}

			<form onSubmit={handleBookingSubmit} className="space-y-4">
				{/* Teacher Selection */}
				<div>
					<Label htmlFor="teacherId" className="flex items-center mb-1">
						<FaUserTie className="mr-2 text-gray-500" />{" "}
						{t("booking.select_teacher")}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					{loadingTeachers ? (
						<div className="flex items-center text-gray-500">
							<FaSpinner className="animate-spin mr-2" />{" "}
							{t("loading_teachers", { ns: "booking" })}...
						</div>
					) : (
						<select
							id="teacherId"
							value={selectedTeacherId}
							onChange={(e) => setSelectedTeacherId(e.target.value)}
							required
							className="select select-bordered w-full bg-base-200 rounded disabled:bg-gray-200" // Adjusted class for select
							disabled={isBooking || teachers.length === 0}
						>
							<option value="" disabled>
								{t("choose_teacher", { ns: "booking" })}
							</option>
							{teachers.map((teacher) => (
								<option key={teacher.id} value={teacher.id}>
									{teacher.name} {teacher.title ? `(${teacher.title})` : ""}
								</option>
							))}
						</select>
					)}
					{!loadingTeachers && teachers.length === 0 && !error && (
						<p className="text-sm text-gray-500 mt-1">
							{t("no_teachers_available", { ns: "booking" })}
						</p>
					)}
				</div>

				{/* Date and Time Selection */}
				<div>
					<Label htmlFor="bookingTime">
						{t("select_time", { ns: "booking" })}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					<Input
						id="bookingTime"
						type="datetime-local"
						value={bookingTime}
						onChange={(e) => setBookingTime(e.target.value)}
						required
						className="input input-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
						disabled={isBooking}
						// min={new Date().toISOString().slice(0, 16)} // Optional: prevent past dates
					/>
					<p className="text-xs text-gray-500 mt-1">
						{t("booking.time_notice")}
					</p>
				</div>

				{/* --- FIX: Duration Dropdown --- */}
				<div>
					<Label htmlFor="duration" className="flex items-center mb-1">
						<FaClock className="mr-2 text-gray-500" />{" "}
						{t("duration_minutes", { ns: "booking" })}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					<select
						id="duration"
						value={durationMinutes}
						onChange={(e) => setDurationMinutes(e.target.value)}
						required
						className="select select-bordered w-full bg-base-200 rounded disabled:bg-gray-200" // Use select styles
						disabled={isBooking}
					>
						{/* Define common duration options */}
						<option value="30">
							{t("duration.30", { ns: "booking", defaultValue: "30 минут" })}
						</option>
						<option value="45">
							{t("duration.45", { ns: "booking", defaultValue: "45 минут" })}
						</option>
						<option value="60">
							{t("duration.60", {
								ns: "booking",
								defaultValue: "60 минут (1 цаг)",
							})}
						</option>
						<option value="90">
							{t("duration.90", { ns: "booking", defaultValue: "90 минут" })}
						</option>
						<option value="120">
							{t("duration.120", {
								ns: "booking",
								defaultValue: "120 минут (2 цаг)",
							})}
						</option>
					</select>
				</div>
				{/* --------------------------- */}

				{/* Notes (Optional) */}
				<div>
					<Label htmlFor="notes">{t("notes", { ns: "booking" })}</Label>
					<textarea
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows="3"
						placeholder={t("booking.notes_placeholder")}
						className="textarea textarea-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
						disabled={isBooking}
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-2">
					<Button
						type="submit"
						className="w-full btn btn-primary"
						disabled={isBooking || loadingTeachers || teachers.length === 0}
					>
						{isBooking && <FaSpinner className="animate-spin mr-2" />}
						{isBooking
							? t("booking.booking_submitting")
							: t("booking.submit_booking_request")}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default BookingPage;
