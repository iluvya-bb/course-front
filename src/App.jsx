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
import BookingPage from "./components/BookingPage";
import MainLayout from "./components/MainLayout";
import CoursePage from "./components/CoursePage";
import LoginPage from "./components/LoginPage"; // Likely replaced by AccountPage
import RegisterPage from "./components/RegisterPage"; // Likely replaced by AccountPage
import PrivateRoute from "./components/PrivateRoute"; // Protects routes needing login
import ProfilePage from "./components/ProfilePage";
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
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* --- Private Routes (Require Login) --- */}
					{/* Wrap protected routes with PrivateRoute */}
					<Route element={<PrivateRoute />}>
						{/* Use MainLayout for authenticated user pages */}
						<Route element={<MainLayout />}>
							{/* User Dashboard is the default after login */}
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/course" element={<DashboardPage />} />
							<Route path="/settings" element={<SettingsPage />} />
							<Route path="/book" element={<BookingPage />} />
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
