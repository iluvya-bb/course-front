import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

function AuthCallbackPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const { t } = useTranslation();
	const [error, setError] = useState("");

	useEffect(() => {
		const handleCallback = async () => {
			const token = searchParams.get("token");
			const errorParam = searchParams.get("error");

			if (errorParam) {
				setError(
					errorParam === "authentication_failed"
						? t("auth.error_failed", {
								defaultValue: "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.",
						  })
						: t("auth.error_server", {
								defaultValue: "Серверийн алдаа гарлаа. Дахин оролдоно уу.",
						  }),
				);
				setTimeout(() => navigate("/account"), 3000);
				return;
			}

			if (!token) {
				setError(
					t("auth.error_no_token", {
						defaultValue: "Токен олдсонгүй. Дахин нэвтэрч үзнэ үү.",
					}),
				);
				setTimeout(() => navigate("/account"), 3000);
				return;
			}

			try {
				// Save token to localStorage
				localStorage.setItem("token", token);

				// Fetch user data
				const userResponse = await API.getMe();
				setUser(userResponse.data.data);

				// Navigate to dashboard
				navigate("/dashboard");
			} catch (err) {
				console.error("Error during OAuth callback:", err);
				setError(
					t("auth.error_user_data", {
						defaultValue: "Хэрэглэгчийн мэдээлэл татахад алдаа гарлаа.",
					}),
				);
				localStorage.removeItem("token");
				setTimeout(() => navigate("/account"), 3000);
			}
		};

		handleCallback();
	}, [searchParams, navigate, setUser, t]);

	return (
		<div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-neutral rounded-lg border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] text-center">
				{error ? (
					<>
						<h2 className="text-2xl font-bold text-error">
							{t("auth.error_title", { defaultValue: "Алдаа гарлаа" })}
						</h2>
						<p className="text-base-content/80">{error}</p>
						<p className="text-sm text-base-content/60">
							{t("auth.redirecting", {
								defaultValue:
									"Та автоматаар нэвтрэх хуудас руу шилжих болно...",
							})}
						</p>
					</>
				) : (
					<>
						<h2 className="text-2xl font-bold text-base-content">
							{t("auth.logging_in", { defaultValue: "Нэвтэрч байна..." })}
						</h2>
						<div className="flex justify-center">
							<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
						</div>
						<p className="text-base-content/70">
							{t("auth.please_wait", { defaultValue: "Түр хүлээнэ үү" })}
						</p>
					</>
				)}
			</div>
		</div>
	);
}

export default AuthCallbackPage;
