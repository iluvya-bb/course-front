import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { login } from "../services/userService";

const LoginPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(email, password);
			navigate("/dashboard");
		} catch (error) {
			setError(error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-100 to-base-300">
			<div className="p-8 bg-neutral rounded-lg border-2 border-neutral shadow-[12px_12px_0px_#00F6FF] w-full max-w-md">
				<h2 className="text-3xl font-bold text-base-content text-center">
					{t("login.title")}
				</h2>
				<form onSubmit={handleLogin} className="space-y-4 mt-6">
					<div>
						<label htmlFor="email" className="label">
							<span className="label-text">{t("login.email")}</span>
						</label>
						<input
							id="email"
							type="email"
							placeholder={t("login.email_placeholder")}
							className="input input-bordered w-full bg-base-200"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label htmlFor="password" className="label">
							<span className="label-text">{t("login.password")}</span>
						</label>
						<input
							id="password"
							type="password"
							placeholder={t("login.password_placeholder")}
							className="input input-bordered w-full bg-base-200 rounded"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className="text-error text-sm">{error.message}</p>}
					<button type="submit" className="btn btn-primary w-full">
						{t("login.login_button")}
					</button>
				</form>
				<p className="text-center mt-4">
					Don{"'"}t have account?{" "}
					<a href="/register" className="link text">
						Register
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
