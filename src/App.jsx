import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
} from "react-router-dom";
import AccountPage from "./components/AccountPage"; // For Login/Signup
import DashboardPage from "./components/DashboardPage";
import LandingPage from "./components/LandingPage";
import BookingPageEnhanced from "./components/BookingPageEnhanced";
import MyBookingsPage from "./components/MyBookingsPage";
import MainLayout from "./components/MainLayout";
import CoursePage from "./components/CoursePage";
import PrivateRoute from "./components/PrivateRoute"; // Protects routes needing login
import ProfilePage from "./components/ProfilePage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import ChangePasswordPage from "./components/ChangePasswordPage";
import NotFoundPage from "./components/NotFoundPage";
import AuthCallbackPage from "./components/AuthCallbackPage";
import TestTakingPage from "./components/TestTakingPage";
import TestResultsPage from "./components/TestResultsPage";
import CertificatesPage from "./components/CertificatesPage";
import CertificateValidationPage from "./components/CertificateValidationPage";
import CertificateViewPage from "./components/CertificateViewPage";
import TeacherApplicationPage from "./components/TeacherApplicationPage";
import WalletPage from "./components/WalletPage";
import PromocodePage from "./components/PromocodePage";
import PackagesPage from "./components/PackagesPage";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

// Teacher Portal Components
import TeacherLayout from "./components/teacher-portal/TeacherLayout";
import TeacherDashboard from "./components/teacher-portal/TeacherDashboard";
import CourseManagement from "./components/teacher-portal/CourseManagement";
import CourseForm from "./components/teacher-portal/CourseForm";
import LessonManagement from "./components/teacher-portal/LessonManagement";
import TestManagement from "./components/teacher-portal/TestManagement";
import QuestionManagement from "./components/teacher-portal/QuestionManagement";
import TestGrading from "./components/teacher-portal/TestGrading";
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

					{/* --- Certificate Routes (Public) --- */}
					<Route
						path="/certificates/validate"
						element={<CertificateValidationPage />}
					/>
					<Route
						path="/certificates/:certificateId"
						element={<CertificateViewPage />}
					/>

					{/* --- Private Routes (Require Login) --- */}
					{/* Wrap protected routes with PrivateRoute */}
					<Route element={<PrivateRoute />}>
						{/* Use MainLayout for authenticated user pages */}
						<Route element={<MainLayout />}>
							{/* User Dashboard is the default after login */}
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/book" element={<BookingPageEnhanced />} />
							<Route path="/my-bookings" element={<MyBookingsPage />} />
							<Route path="/course/:courseId" element={<CoursePage />} />
							<Route path="/profile" element={<ProfilePage />} />
							<Route path="/change-password" element={<ChangePasswordPage />} />
							{/* Test and Certificate Routes */}
							<Route path="/tests/:testId" element={<TestTakingPage />} />
							<Route
								path="/tests/:testId/results/:attemptId"
								element={<TestResultsPage />}
							/>
							<Route path="/certificates" element={<CertificatesPage />} />
							{/* Wallet */}
							<Route path="/wallet" element={<WalletPage />} />
							{/* Promocode */}
							<Route path="/promocode" element={<PromocodePage />} />
							{/* Packages */}
							<Route path="/packages" element={<PackagesPage />} />
							{/* Teacher Application */}
							<Route
								path="/apply-teacher"
								element={<TeacherApplicationPage />}
							/>
						</Route>
					</Route>

					{/* --- Teacher Portal Routes (Teachers Only) --- */}
					<Route element={<PrivateRoute allowedRoles={["teacher", "admin"]} />}>
						<Route element={<TeacherLayout />}>
							<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
							<Route path="/teacher/courses" element={<CourseManagement />} />
							<Route path="/teacher/courses/new" element={<CourseForm />} />
							<Route
								path="/teacher/courses/:courseId/edit"
								element={<CourseForm />}
							/>
							<Route
								path="/teacher/courses/:courseId/lessons"
								element={<LessonManagement />}
							/>
							<Route
								path="/teacher/courses/:courseId/tests"
								element={<TestManagement />}
							/>
							<Route
								path="/teacher/courses/:courseId/tests/:testId/questions"
								element={<QuestionManagement />}
							/>
							<Route
								path="/teacher/courses/:courseId/tests/:testId/grading"
								element={<TestGrading />}
							/>
							<Route path="/teacher/bookings" element={<BookingManagement />} />
							<Route
								path="/teacher/availability"
								element={<AvailabilityScheduler />}
							/>
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
