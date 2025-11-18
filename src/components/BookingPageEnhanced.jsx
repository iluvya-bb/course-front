import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	FaSpinner,
	FaCalendarAlt,
	FaUserTie,
	FaClock,
	FaMapMarkerAlt,
	FaInfoCircle,
} from "react-icons/fa";
import API from "../services/api";
import BookingConfirmationModal from "./BookingConfirmationModal";
import Toast from "./Toast";
import TeacherCard from "./TeacherCard";
import { getMinDate, getMaxDate, getDayName, daysUntil } from "../utils/dateUtils";

const BookingPageEnhanced = () => {
	const { t } = useTranslation(["translation", "booking"]);
	const [teachers, setTeachers] = useState([]);
	const [selectedTeacherId, setSelectedTeacherId] = useState("");
	const [bookingDate, setBookingDate] = useState("");
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [durationMinutes, setDurationMinutes] = useState("60");
	const [location, setLocation] = useState("");
	const [studentCount, setStudentCount] = useState("1");
	const [sessionCount, setSessionCount] = useState("1");
	const [notes, setNotes] = useState("");
	const [loadingTeachers, setLoadingTeachers] = useState(true);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [isBooking, setIsBooking] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	const [toast, setToast] = useState(null);

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

	// Fetch available slots when teacher and date are selected
	useEffect(() => {
		if (selectedTeacherId && bookingDate) {
			fetchAvailableSlots();
		} else {
			setAvailableSlots([]);
			setSelectedSlot("");
		}
	}, [selectedTeacherId, bookingDate, durationMinutes]);

	const fetchAvailableSlots = async () => {
		setLoadingSlots(true);
		setError("");
		try {
			const response = await API.getAvailableSlots(selectedTeacherId, {
				date: bookingDate,
				duration: parseInt(durationMinutes, 10),
			});
			setAvailableSlots(response.data.data || []);
			if (response.data.data.length === 0) {
				// Better error message with suggestions
				const dayName = getDayName(bookingDate);
				const daysAway = daysUntil(bookingDate);
				const suggestions = [];

				if (daysAway === 0) {
					suggestions.push(t("booking.try_tomorrow", { defaultValue: "Маргааш эсвэл өөр өдөр сонгоно уу" }));
				}
				suggestions.push(t("booking.try_different_duration", { defaultValue: "Өөр үргэлжлэх хугацаа сонгоно уу" }));
				suggestions.push(t("booking.try_different_teacher", { defaultValue: "Өөр багш сонгоно уу" }));

				setError(
					`${dayName} (${bookingDate}) боломжтой цаг байхгүй байна. ${suggestions.join(", ")}.`
				);
			}
		} catch (err) {
			console.error("Failed to fetch slots:", err);
			setError(
				t("booking.error_fetch_slots", {
					defaultValue: "Цагийн хуваарь татахад алдаа гарлаа.",
				}),
			);
		} finally {
			setLoadingSlots(false);
		}
	};

	const handleBookingSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		if (!selectedTeacherId || !bookingDate || !selectedSlot || !location) {
			setError(t("error_fields_required", { ns: "booking" }));
			return;
		}

		// Get selected teacher object
		const teacher = teachers.find(
			(t) => t.id === parseInt(selectedTeacherId, 10),
		);
		setSelectedTeacher(teacher);

		// Show confirmation modal
		setShowConfirmation(true);
	};

	// Calculate estimated price
	const estimatedPrice = useMemo(() => {
		if (!selectedTeacher || !selectedTeacher.hourlyRate || !durationMinutes) {
			return null;
		}
		const hours = parseInt(durationMinutes, 10) / 60;
		const sessions = parseInt(sessionCount, 10);
		return selectedTeacher.hourlyRate * hours * sessions;
	}, [selectedTeacher, durationMinutes, sessionCount]);

	const handleConfirmBooking = async () => {
		// Parse selected slot
		const [startTime, endTime] = selectedSlot.split(" - ");

		setIsBooking(true);
		setError("");

		try {
			const bookingData = {
				teacherId: parseInt(selectedTeacherId, 10),
				bookingDate,
				startTime: startTime + ":00",
				endTime: endTime + ":00",
				durationMinutes: parseInt(durationMinutes, 10),
				location: location.trim(),
				studentCount: parseInt(studentCount, 10),
				sessionCount: parseInt(sessionCount, 10),
				notes: notes.trim() || null,
			};

			const response = await API.createBooking(bookingData);
			setToast({
				message: t("booking_successful", {
					ns: "booking",
					defaultValue: "Захиалга амжилттай үүслээ!",
				}),
				type: "success",
			});
			setShowConfirmation(false);

			// Reset form
			setSelectedTeacherId("");
			setSelectedTeacher(null);
			setBookingDate("");
			setSelectedSlot("");
			setDurationMinutes("60");
			setLocation("");
			setStudentCount("1");
			setSessionCount("1");
			setNotes("");
			setAvailableSlots([]);

			console.log("Booking created:", response.data.data);
		} catch (err) {
			console.error("Booking failed:", err);
			setError(
				err.response?.data?.error ||
				t("error_booking_failed", {
					ns: "booking",
					defaultValue: "Захиалга үүсгэхэд алдаа гарлаа.",
				}),
			);
			setShowConfirmation(false);
		} finally {
			setIsBooking(false);
		}
	};

	// Handle teacher selection
	const handleTeacherSelect = (teacher) => {
		setSelectedTeacherId(teacher.id.toString());
		setSelectedTeacher(teacher);
		setSelectedSlot("");
		setAvailableSlots([]);
	};

	return (
		<div className="max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md border border-neutral">
			<h1 className="text-2xl md:text-3xl font-bold text-base-content mb-6">
				<FaCalendarAlt className="inline mr-2 mb-1" />
				{t("booking.book_teacher_title", { defaultValue: "Багш захиалах" })}
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

			<form onSubmit={handleBookingSubmit} className="space-y-5">
				{/* Teacher Selection */}
				<div>
					<Label className="flex items-center mb-3">
						<FaUserTie className="mr-2 text-gray-500" />
						{t("booking.select_teacher", { defaultValue: "Багш сонгох" })}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					{loadingTeachers ? (
						<div className="flex items-center justify-center text-gray-500 py-8">
							<FaSpinner className="animate-spin mr-2" />
							{t("loading_teachers", {
								ns: "booking",
								defaultValue: "Багш нар ачааллаж байна",
							})}
							...
						</div>
					) : teachers.length === 0 ? (
						<div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
							{t("booking.no_teachers", { defaultValue: "Багш олдсонгүй" })}
						</div>
					) : (
						<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
							{teachers.map((teacher) => (
								<TeacherCard
									key={teacher.id}
									teacher={teacher}
									selected={selectedTeacherId === teacher.id.toString()}
									onClick={handleTeacherSelect}
								/>
							))}
						</div>
					)}
				</div>

				{/* Date Selection */}
				<div>
					<Label htmlFor="bookingDate" className="flex items-center mb-2">
						<FaCalendarAlt className="mr-2 text-gray-500" />
						{t("booking.select_date", { defaultValue: "Огноо сонгох" })}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					<Input
						id="bookingDate"
						type="date"
						value={bookingDate}
						onChange={(e) => {
							setBookingDate(e.target.value);
							setSelectedSlot("");
						}}
						required
						min={getMinDate()}
						max={getMaxDate()}
						className="input input-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
						disabled={isBooking || !selectedTeacherId}
					/>
					{!selectedTeacherId && (
						<p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
							<FaInfoCircle />
							{t("booking.select_teacher_first", { defaultValue: "Эхлээд багш сонгоно уу" })}
						</p>
					)}
				</div>

				{/* Duration Selection */}
				<div>
					<Label htmlFor="duration" className="flex items-center mb-2">
						<FaClock className="mr-2 text-gray-500" />
						{t("duration_minutes", {
							ns: "booking",
							defaultValue: "Хичээлийн үргэлжлэх хугацаа",
						})}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					<select
						id="duration"
						value={durationMinutes}
						onChange={(e) => {
							setDurationMinutes(e.target.value);
							setSelectedSlot("");
						}}
						required
						className="select select-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
						disabled={isBooking || !selectedTeacherId}
					>
						<option value="30">30 минут</option>
						<option value="45">45 минут</option>
						<option value="60">60 минут (1 цаг)</option>
						<option value="90">90 минут</option>
						<option value="120">120 минут (2 цаг)</option>
					</select>
				</div>

				{/* Available Time Slots */}
				{bookingDate && selectedTeacherId && (
					<div>
						<Label className="flex items-center mb-2">
							<FaClock className="mr-2 text-gray-500" />
							{t("booking.available_slots", {
								defaultValue: "Боломжтой цагууд",
							})}
							<span className="text-red-500 ml-1">*</span>
						</Label>
						{loadingSlots ? (
							<div className="flex items-center text-gray-500 p-4 border rounded">
								<FaSpinner className="animate-spin mr-2" />
								{t("booking.loading_slots", {
									defaultValue: "Цагууд ачааллаж байна",
								})}
								...
							</div>
						) : availableSlots.length > 0 ? (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
								{availableSlots.map((slot, index) => {
									const slotValue = `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`;
									return (
										<button
											key={index}
											type="button"
											onClick={() => setSelectedSlot(slotValue)}
											className={`p-3 border rounded text-sm font-medium transition ${selectedSlot === slotValue
													? "bg-indigo-600 text-white border-indigo-600"
													: "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
												}`}
										>
											{slotValue}
										</button>
									);
								})}
							</div>
						) : (
							<p className="text-gray-500 p-4 border rounded">
								{t("booking.no_slots_today", {
									defaultValue: "Энэ өдөр боломжтой цаг байхгүй байна.",
								})}
							</p>
						)}
					</div>
				)}

				{/* Location */}
				<div>
					<Label htmlFor="location" className="flex items-center mb-2">
						<FaMapMarkerAlt className="mr-2 text-gray-500" />
						{t("booking.location", { defaultValue: "Байршил" })}
						<span className="text-red-500 ml-1">*</span>
					</Label>
					<Input
						id="location"
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
						placeholder={t("booking.location_placeholder", {
							defaultValue: "Хичээлийн байршил оруулна уу",
						})}
						className="input input-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
						disabled={isBooking}
					/>
				</div>

				{/* Student Count and Session Count */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label htmlFor="studentCount" className="mb-2 block">
							{t("booking.student_count", { defaultValue: "Суралцагчийн тоо" })}
						</Label>
						<Input
							id="studentCount"
							type="number"
							min="1"
							value={studentCount}
							onChange={(e) => setStudentCount(e.target.value)}
							className="input input-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
							disabled={isBooking}
						/>
					</div>
					<div>
						<Label htmlFor="sessionCount" className="mb-2 block">
							{t("booking.session_count", { defaultValue: "Хичээлийн тоо" })}
						</Label>
						<Input
							id="sessionCount"
							type="number"
							min="1"
							value={sessionCount}
							onChange={(e) => setSessionCount(e.target.value)}
							className="input input-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
							disabled={isBooking}
						/>
					</div>
				</div>

				{/* Notes */}
				<div>
					<Label htmlFor="notes">
						{t("notes", { ns: "booking", defaultValue: "Тэмдэглэл" })}
					</Label>
					<textarea
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows="3"
						placeholder={t("booking.notes_placeholder", {
							defaultValue: "Нэмэлт мэдээлэл...",
						})}
						className="textarea textarea-bordered w-full bg-base-200 rounded disabled:bg-gray-200"
						disabled={isBooking}
					/>
				</div>

				{/* Price Estimate */}
				{estimatedPrice && selectedSlot && (
					<div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 flex items-center gap-1">
									<FaInfoCircle className="text-green-600" />
									{t("booking.estimated_price", { defaultValue: "Тооцоолсон үнэ" })}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									{t("booking.price_may_vary", {
										defaultValue: "Багш баталгаажуулалтын үед үнэ өөрчлөгдөж болно"
									})}
								</p>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold text-green-600">
									₮{estimatedPrice.toLocaleString()}
								</p>
								<p className="text-xs text-gray-500">
									{parseInt(sessionCount, 10)} хичээл
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Submit Button */}
				<div className="pt-2">
					<Button
						type="submit"
						className="w-full btn btn-primary"
						disabled={
							isBooking ||
							loadingTeachers ||
							loadingSlots ||
							teachers.length === 0 ||
							!selectedSlot
						}
					>
						{isBooking && <FaSpinner className="animate-spin mr-2" />}
						{isBooking
							? t("booking.booking_submitting", {
								defaultValue: "Илгээж байна...",
							})
							: t("booking.submit_booking_request", {
								defaultValue: "Захиалга илгээх",
							})}
					</Button>
				</div>
			</form>

			{/* Booking Confirmation Modal */}
			<BookingConfirmationModal
				bookingData={{
					bookingDate,
					startTime: selectedSlot ? selectedSlot.split(" - ")[0] : null,
					endTime: selectedSlot ? selectedSlot.split(" - ")[1] : null,
					durationMinutes: parseInt(durationMinutes, 10),
					location,
					studentCount: parseInt(studentCount, 10),
					sessionCount: parseInt(sessionCount, 10),
					notes,
				}}
				teacher={selectedTeacher}
				isOpen={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				onConfirm={handleConfirmBooking}
				isLoading={isBooking}
			/>

			{/* Toast Notification */}
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

export default BookingPageEnhanced;
