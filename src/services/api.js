import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

const axiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Request interceptor to attach Authorization header
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
		}
		return Promise.reject(error);
	},
);

const API = {
	// Expose base URL for image/file paths
	defaults: {
		baseURL: API_URL,
	},

	// --- Auth ---
	login: (email, password) =>
		axiosInstance.post("/users/login", { email, password }),
	register: (data) => axiosInstance.post("/users/register", data),
	signout: () => axiosInstance.get("/users/signout"),
	getMe: () => axiosInstance.get("/auth/me"),
	updateProfile: (data) => axiosInstance.put("/auth/me", data),
	getMyBookings: () => axiosInstance.get("/auth/bookings"),
	forgotPassword: (email) =>
		axiosInstance.post("/users/forgot-password", { email }),
	resetPassword: (token, newPassword) =>
		axiosInstance.post("/users/reset-password", { token, password: newPassword }),
	validateResetToken: (token) =>
		axiosInstance.post("/users/validate-reset-token", { token }),

	// --- Users (from user.js) ---
	getUsers: (params) => axiosInstance.get("/users", { params }),
	getUser: (id) => axiosInstance.get(`/users/${id}`),
	updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
	deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
	subscribeUserToCourse: (data) => axiosInstance.post("/users/subscribe", data),

	// --- Stats ---
	getDashboardStats: () => axiosInstance.get("/stats"),

	// --- Courses ---
	getAllCourses: () => axiosInstance.get("/courses"),
	getCourses: (params) => axiosInstance.get("/courses", { params }),
	getCourse: (id) => axiosInstance.get(`/courses/${id}`),
	createCourse: (data) => axiosInstance.post("/courses", data),
	updateCourse: (id, data) => axiosInstance.put(`/courses/${id}`, data),
	deleteCourse: (id) => axiosInstance.delete(`/courses/${id}`),
	getSubscribedUsers: (id) => axiosInstance.get(`/courses/${id}/subscriptions`),
	subscribeUsersToCourse: (id, userIds) =>
		axiosInstance.post(`/courses/${id}/subscriptions`, { userIds }),

	createSubscription: (
		courseId,
		data, // Accepts 'data'
	) => axiosInstance.post(`/courses/${courseId}/subscribe`, data),
	getMySubscriptions: () => axiosInstance.get("/auth/subscription"),
	getAllSubscriptions: (params) =>
		axiosInstance.get("/subscriptions", { params }),

	// --- Lessons (from lesson.js) ---
	getLessons: (params) => axiosInstance.get("/lessons", { params }),
	createLesson: (data) => axiosInstance.post("/lessons", data),
	getLesson: (id) => axiosInstance.get(`/lessons/${id}`),
	updateLesson: (id, data) => axiosInstance.put(`/lessons/${id}`, data),
	deleteLesson: (id) => axiosInstance.delete(`/lessons/${id}`),
	markLessonAsComplete: (id) => axiosInstance.post(`/lessons/${id}/complete`),
	streamVideo: (id) => axiosInstance.get(`/lessons/${id}/stream`),

	// --- Lesson Publication Workflow ---
	requestLessonPublication: (id) =>
		axiosInstance.post(`/lessons/${id}/request-publish`),
	approveLessonPublication: (id) =>
		axiosInstance.post(`/lessons/${id}/approve-publish`),
	rejectLessonPublication: (id, reason) =>
		axiosInstance.post(`/lessons/${id}/reject-publish`, { reason }),
	getPendingLessons: () => axiosInstance.get("/lessons/pending-approval"),

	// --- Exercises (from exercise.js) ---
	getExercises: (params) => axiosInstance.get("/exercises", { params }),
	createExercise: (data) => axiosInstance.post("/exercises", data),
	getExercise: (id) => axiosInstance.get(`/exercises/${id}`),
	updateExercise: (id, data) => axiosInstance.put(`/exercises/${id}`, data),
	deleteExercise: (id) => axiosInstance.delete(`/exercises/${id}`),
	submitExercise: (id, data) =>
		axiosInstance.post(`/exercises/${id}/submit`, data),

	// --- Parameters (from parameter.js) ---
	getParameters: (params) => axiosInstance.get("/parameters", { params }),
	createParameter: (data) => axiosInstance.post("/parameters", data),
	getParameter: (key) => axiosInstance.get(`/parameters/${key}`),
	updateParameter: (key, data) => axiosInstance.put(`/parameters/${key}`, data),
	deleteParameter: (key) => axiosInstance.delete(`/parameters/${key}`),

	// --- Teachers (from teacher.js) ---
	getTeachers: (params) => axiosInstance.get("/teachers", { params }),
	createTeacher: (data) => axiosInstance.post("/teachers", data),
	getTeacher: (id) => axiosInstance.get(`/teachers/${id}`),
	updateTeacher: (id, data) => axiosInstance.put(`/teachers/${id}`, data),
	deleteTeacher: (id) => axiosInstance.delete(`/teachers/${id}`),

	// --- Bookings (from booking.js) ---
	getBookings: (params) => axiosInstance.get("/bookings", { params }),
	createBooking: (data) => axiosInstance.post("/bookings", data),
	getBooking: (id) => axiosInstance.get(`/bookings/${id}`),
	acceptBooking: (id, data) => axiosInstance.put(`/bookings/${id}/accept`, data),
	payForBooking: (id, data) => axiosInstance.put(`/bookings/${id}/pay`, data),
	cancelBooking: (id) => axiosInstance.put(`/bookings/${id}/cancel`),
	completeBooking: (id) => axiosInstance.put(`/bookings/${id}/complete`),

	// --- Teacher Availability ---
	getTeacherAvailability: (teacherId) =>
		axiosInstance.get(`/teachers/${teacherId}/availability`),
	setTeacherAvailability: (teacherId, data) =>
		axiosInstance.post(`/teachers/${teacherId}/availability`, data),
	getTeacherBlockedDates: (teacherId) =>
		axiosInstance.get(`/teachers/${teacherId}/blocked-dates`),
	addTeacherBlockedDate: (teacherId, data) =>
		axiosInstance.post(`/teachers/${teacherId}/blocked-dates`, data),
	removeTeacherBlockedDate: (teacherId, blockId) =>
		axiosInstance.delete(`/teachers/${teacherId}/blocked-dates/${blockId}`),
	getAvailableSlots: (teacherId, params) =>
		axiosInstance.get(`/teachers/${teacherId}/available-slots`, { params }),
	checkAvailability: (teacherId, params) =>
		axiosInstance.get(`/teachers/${teacherId}/check-availability`, { params }),

	// --- Promo Codes (from promocode.js) ---
	validatePromoCode: (data) => axiosInstance.post("/promocodes/validate", data),
	getPromoCodes: (params) => axiosInstance.get("/promocodes", { params }),
	createPromoCode: (data) => axiosInstance.post("/promocodes", data),
	getPromoCode: (id) => axiosInstance.get(`/promocodes/${id}`),
	updatePromoCode: (id, data) => axiosInstance.put(`/promocodes/${id}`, data),
	deletePromoCode: (id) => axiosInstance.delete(`/promocodes/${id}`),

	// --- Wallet (from wallet.js) ---
	getMyWallet: () => axiosInstance.get("/wallet/me"),
	initiateDeposit: (data) => axiosInstance.post("/wallet/deposit", data),
	redeemGiftCard: (data) => axiosInstance.post("/wallet/redeem-card", data),

	// --- Categories ---
	getCategories: (params) => axiosInstance.get("/categories", { params }),
	getCategory: (id) => axiosInstance.get(`/categories/${id}`),

	// --- Testimonials ---
	getTestimonials: (params) => axiosInstance.get("/testimonials", { params }),
	getTestimonial: (id) => axiosInstance.get(`/testimonials/${id}`),

	// --- Parameters ---
	getParameters: (params) => axiosInstance.get("/parameters", { params }),

	// --- Tests ---
	getTests: (params) => axiosInstance.get("/tests", { params }),
	getTest: (id) => axiosInstance.get(`/tests/${id}`),
	createTest: (data) => axiosInstance.post("/tests", data),
	updateTest: (id, data) => axiosInstance.put(`/tests/${id}`, data),
	deleteTest: (id) => axiosInstance.delete(`/tests/${id}`),
	startTest: (id) => axiosInstance.post(`/tests/${id}/start`),
	submitTest: (id, data) => axiosInstance.post(`/tests/${id}/submit`, data),
	getTestResults: (testId, attemptId) =>
		axiosInstance.get(`/tests/${testId}/results/${attemptId}`),
	getUserAttempts: (testId) => axiosInstance.get(`/tests/${testId}/attempts`),

	// --- Questions ---
	getQuestions: (params) => axiosInstance.get("/questions", { params }),
	getQuestion: (id) => axiosInstance.get(`/questions/${id}`),
	createQuestion: (data) => axiosInstance.post("/questions", data),
	updateQuestion: (id, data) => axiosInstance.put(`/questions/${id}`, data),
	deleteQuestion: (id) => axiosInstance.delete(`/questions/${id}`),
	gradeQuestion: (id, data) => axiosInstance.post(`/questions/${id}/grade`, data),

	// --- Certificates ---
	getMyCertificates: () => axiosInstance.get("/certificates"),
	getCertificate: (certificateId) =>
		axiosInstance.get(`/certificates/${certificateId}`),
	validateCertificates: (email) =>
		axiosInstance.post("/certificates/validate", { email }),
	revokeCertificate: (id, data) =>
		axiosInstance.put(`/certificates/${id}/revoke`, data),
	sendCertificateEmail: (id) =>
		axiosInstance.post(`/certificates/${id}/send`),
	generateCertificatePDF: (id) =>
		axiosInstance.post(`/certificates/${id}/generate-pdf`),
	getAllCertificates: (params) =>
		axiosInstance.get("/certificates/admin/all", { params }),

	// --- Teacher Applications ---
	submitTeacherApplication: (data) =>
		axiosInstance.post("/teacher-applications", data),
	getMyTeacherApplication: () =>
		axiosInstance.get("/teacher-applications/my-application"),
	getTeacherApplications: (params) =>
		axiosInstance.get("/teacher-applications", { params }),
	getTeacherApplication: (id) =>
		axiosInstance.get(`/teacher-applications/${id}`),
	approveTeacherApplication: (id) =>
		axiosInstance.post(`/teacher-applications/${id}/approve`),
	rejectTeacherApplication: (id, data) =>
		axiosInstance.post(`/teacher-applications/${id}/reject`, data),
	updateTeacherApplicationNotes: (id, data) =>
		axiosInstance.put(`/teacher-applications/${id}/notes`, data),
};

export default API;
