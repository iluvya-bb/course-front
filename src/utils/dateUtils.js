/**
 * Date formatting utilities for consistent date display across the app
 */

/**
 * Format date to Mongolian locale long format
 * @param {string|Date} dateStr - Date to format
 * @returns {string} Formatted date (e.g., "2024 оны 1-р сарын 15")
 */
export const formatDateLong = (dateStr) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("mn-MN", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

/**
 * Format date to short format
 * @param {string|Date} dateStr - Date to format
 * @returns {string} Formatted date (e.g., "2024-01-15")
 */
export const formatDateShort = (dateStr) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("mn-MN");
};

/**
 * Format time to HH:MM format
 * @param {string} timeStr - Time string (e.g., "14:30:00")
 * @returns {string} Formatted time (e.g., "14:30")
 */
export const formatTime = (timeStr) => {
	if (!timeStr) return "-";
	return timeStr.substring(0, 5);
};

/**
 * Format date and time together
 * @param {string|Date} dateStr - Date
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (dateStr, startTime, endTime) => {
	const date = formatDateLong(dateStr);
	if (startTime && endTime) {
		return `${date}, ${formatTime(startTime)} - ${formatTime(endTime)}`;
	}
	return date;
};

/**
 * Get minimum bookable date (today)
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getMinDate = () => {
	return new Date().toISOString().split("T")[0];
};

/**
 * Get maximum bookable date (90 days from now)
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getMaxDate = () => {
	const date = new Date();
	date.setDate(date.getDate() + 90);
	return date.toISOString().split("T")[0];
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateStr - Date to check
 * @returns {boolean}
 */
export const isPastDate = (dateStr) => {
	const date = new Date(dateStr);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return date < today;
};

/**
 * Get day of week name
 * @param {string|Date} dateStr - Date
 * @returns {string} Day name in Mongolian
 */
export const getDayName = (dateStr) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("mn-MN", { weekday: "long" });
};

/**
 * Calculate days until date
 * @param {string|Date} dateStr - Target date
 * @returns {number} Number of days
 */
export const daysUntil = (dateStr) => {
	const target = new Date(dateStr);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	target.setHours(0, 0, 0, 0);
	const diffTime = target - today;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
