import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
} from "react-router-dom";
import AccountPage from "./components/AccountPage"; // For Login/Signup
import DashboardPage from "./components/DashboardPage";
import SettingsPage from "./components/SettingsPage";
import LandingPage from "./components/LandingPage";
import BookingPageEnhanced from "./components/BookingPageEnhanced";
import MyBookingsPage from "./components/MyBookingsPage";
import MainLayout from "./components/MainLayout";
import CoursePage from "./components/CoursePage";
import PrivateRoute from "./components/PrivateRoute"; // Protects routes needing login
import ProfilePage from "./components/ProfilePage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import NotFoundPage from "./components/NotFoundPage";
import AuthCallbackPage from "./components/AuthCallbackPage";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

// Teacher Portal Components
import TeacherLayout from "./components/teacher-portal/TeacherLayout";
import TeacherDashboard from "./components/teacher-portal/TeacherDashboard";
import CourseManagement from "./components/teacher-portal/CourseManagement";
import CourseForm from "./components/teacher-portal/CourseForm";
import LessonManagement from "./components/teacher-portal/LessonManagement";
import BookingManagement from "./components/teacher-portal/BookingManagement";
import AvailabilityScheduler from "./components/teacher-portal/AvailabilityScheduler";

function App() {
	return (
		<Router>
			<AuthProvider>
				{" "}
				{/* Wrap the entire app */}
				<Routes>
					{/* --- Public Routes --- */}
					<Route path="/" element={<LandingPage />} />
					{/* Use AccountPage for both Login and Register */}
					<Route path="/account" element={<AccountPage />} />
					<Route path="/login" element={<AccountPage />} />
					<Route path="/register" element={<AccountPage />} />
					{/* Reset Password Route */}
					<Route path="/reset-password" element={<ResetPasswordPage />} />
				{/* OAuth Callback Route */}
				<Route path="/auth/callback" element={<AuthCallbackPage />} />

					{/* --- Private Routes (Require Login) --- */}
					{/* Wrap protected routes with PrivateRoute */}
					<Route element={<PrivateRoute />}>
						{/* Use MainLayout for authenticated user pages */}
						<Route element={<MainLayout />}>
							{/* User Dashboard is the default after login */}
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/settings" element={<SettingsPage />} />
							<Route path="/book" element={<BookingPageEnhanced />} />
							<Route path="/my-bookings" element={<MyBookingsPage />} />
							<Route path="/course/:courseId" element={<CoursePage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Route>
					</Route>

					{/* --- Teacher Portal Routes (Teachers Only) --- */}
					<Route element={<PrivateRoute allowedRoles={['teacher', 'admin']} />}>
						<Route element={<TeacherLayout />}>
							<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
							<Route path="/teacher/courses" element={<CourseManagement />} />
							<Route path="/teacher/courses/new" element={<CourseForm />} />
							<Route path="/teacher/courses/:courseId/edit" element={<CourseForm />} />
							<Route path="/teacher/courses/:courseId/lessons" element={<LessonManagement />} />
							<Route path="/teacher/bookings" element={<BookingManagement />} />
							<Route path="/teacher/availability" element={<AvailabilityScheduler />} />
						</Route>
					</Route>

					{/* 404 Not Found route */}
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
