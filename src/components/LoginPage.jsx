import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { FaSpinner } from "react-icons/fa"; // Optional: for loading spinner

const LoginPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	// Get the login function directly from the context
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			// Call the login function from AuthContext
			await login(email, password);
			navigate("/dashboard"); // Navigate on success
		} catch (err) {
			console.error("Login failed:", err);
			// The error thrown by context's login function is used directly
			setError(err || t("login.error_generic"));
		} finally {
			// Always set loading to false after attempt
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-100 to-base-300">
			<div className="p-8 bg-neutral rounded-lg border-2 border-neutral shadow-[12px_12px_0px_#00F6FF] w-full max-w-md">
				<h2 className="text-3xl font-bold text-base-content text-center mb-6">
					{t("login.title")}
				</h2>
				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label htmlFor="email" className="label">
							<span className="label-text">{t("login.email")}</span>
						</label>
						<input
							id="email"
							type="email"
							placeholder={t("login.email_placeholder")}
							className="input input-bordered w-full bg-base-200 rounded"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					<div>
						<label htmlFor="password" className="label">
							<span className="label-text">{t("login.password")}</span>
						</label>
						<input
							id="password"
							type="password"
							placeholder="******************"
							className="input input-bordered w-full bg-base-200 rounded"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					{error && <p className="text-error text-sm text-center">{error}</p>}
					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={loading}
					>
						{loading && <FaSpinner className="animate-spin mr-2" />}
						{loading ? t("login.logging_in") : t("login.login_button")}
					</button>
				</form>
				<p className="text-center text-sm text-base-content/70 mt-4">
					{t("login.no_account")}{" "}
					<Link to="/register" className="link text-primary hover:underline">
						{t("login.create_one")}
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
