import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountPage from "./components/AccountPage";
import DashboardPage from "./components/DashboardPage";
import SettingsPage from "./components/SettingsPage";
import LandingPage from "./components/LandingPage";
import BookingPage from "./components/BookingPage";
import MainLayout from "./components/MainLayout";
import CoursePage from "./components/CoursePage";
import LoginPage from "./components/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboardPage from "./components/AdminDashboardPage";
import AdminRoute from "./components/AdminRoute";
import RegisterPage from "./components/RegisterPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/" element={<PrivateRoute />}>
					<Route path="/" element={<MainLayout />}>
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="settings" element={<SettingsPage />} />
						<Route path="book" element={<BookingPage />} />
						<Route path="course/:courseId" element={<CoursePage />} />
						<Route path="account" element={<AccountPage />} />
						<Route path="admin" element={<AdminRoute />}>
							<Route path="admin/dashboard" element={<AdminDashboardPage />} />
						</Route>
					</Route>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
