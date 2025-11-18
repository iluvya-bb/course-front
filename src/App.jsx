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
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

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

					{/* --- Private Routes (Require Login) --- */}
					{/* Wrap protected routes with PrivateRoute */}
					<Route element={<PrivateRoute />}>
						{/* Use MainLayout for authenticated user pages */}
						<Route element={<MainLayout />}>
							{/* User Dashboard is the default after login */}
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/course" element={<DashboardPage />} />
							<Route path="/settings" element={<SettingsPage />} />
							<Route path="/book" element={<BookingPageEnhanced />} />
							<Route path="/my-bookings" element={<MyBookingsPage />} />
							<Route path="/course/:courseId" element={<CoursePage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Route>
					</Route>

					{/* Optional: Add a 404 Not Found route */}
					{/* <Route path="*" element={<NotFoundPage />} /> */}
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
