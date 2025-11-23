import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button"; // Assuming these exist
import { Input } from "./ui/input"; // Assuming these exist
import { Label } from "./ui/label"; // Assuming these exist
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSpinner } from "react-icons/fa"; // Optional: for loading spinner
import ForgotPasswordModal from "./ForgotPasswordModal";
import { API_URL } from "../services/api";

const AccountPage = () => {
  // Removed onLogin prop
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth(); // Get login/register functions from context
  const navigate = useNavigate(); // Hook for navigation
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const toggleForm = () => setIsLogin(!isLogin);

  // Define handlers that call context functions
  const handleLoginSubmit = async (email, password, setError, setLoading) => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password); // Call context login
      navigate("/dashboard"); // Navigate after successful login
    } catch (err) {
      setError(err || t("login.error_generic")); // Use error from context or default
      setLoading(false);
    }
    // setLoading(false); // setLoading handled in error case
  };

  const handleRegisterSubmit = async (
    name,
    email,
    password,
    setError,
    setLoading,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await register({ username: name, email, password }); // Call context register
      navigate("/dashboard"); // Navigate after successful registration
    } catch (err) {
      setError(err || t("create_account.error_generic")); // Use error from context or default
      setLoading(false);
    }
    // setLoading(false); // setLoading handled in error case
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* ... (Titles and subtitles remain the same) ... */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content">
            {isLogin ? t("login.title") : t("create_account.title")}
          </h1>
          <p className="text-base-content/80 mt-2">
            {isLogin ? t("login.subtitle") : t("create_account.subtitle")}
          </p>
        </div>

        <div className="bg-neutral p-8 rounded-lg border-2 border-neutral shadow-[8px_8px_0px_#00F6FF]">
          {/* Pass the correct handlers down */}
          {isLogin ? (
            <LoginForm
              onSubmit={handleLoginSubmit}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          ) : (
            <SignUpForm onSubmit={handleRegisterSubmit} />
          )}
        </div>

        {/* ... (Toggle button remains the same) ... */}
        <p className="text-center text-base-content/70 mt-6">
          {isLogin
            ? t("login.no_account")
            : t("create_account.already_have_account")}{" "}
          <button
            onClick={toggleForm}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? t("login.create_one") : t("create_account.login_link")}
          </button>
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

// --- LoginForm Component ---
const LoginForm = ({ onSubmit, onForgotPassword }) => {
  // Renamed prop to onSubmit
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Call the onSubmit handler passed from AccountPage
    onSubmit(email, password, setError, setLoading);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/oauth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/auth/oauth/facebook`;
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <Label htmlFor="login-email">{t("login.email")}</Label>{" "}
        {/* Unique ID */}
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("login.email_placeholder")}
          className="mt-1"
          required
          disabled={loading}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="login-password">{t("login.password")}</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline"
            disabled={loading}
          >
            {t("login.forgot_password", {
              defaultValue: "Нууц үг мартсан?",
            })}
          </button>
        </div>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******************"
          className="mt-1"
          required
          disabled={loading}
        />
      </div>
      {error && <p className="text-error text-sm text-center">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <FaSpinner className="animate-spin mr-2" />}
        {loading ? t("login.logging_in") : t("login.login_button")}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-neutral text-base-content/70">
            {t("login.or", { defaultValue: "Эсвэл" })}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 transition"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t("login.google", { defaultValue: "Google-ээр нэвтрэх" })}
        </button>

        <button
          onClick={handleFacebookLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-[#1877F2] rounded-md hover:bg-[#166FE5] disabled:bg-gray-400 transition"
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {t("login.facebook", { defaultValue: "Facebook-ээр нэвтрэх" })}
        </button>
      </div>
    </form>
  );
};

// --- SignUpForm Component ---
const SignUpForm = ({ onSubmit }) => {
  // Renamed prop to onSubmit
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (password !== confirmPassword) {
      setError(t("create_account.error_password_match"));
      return;
    }
    // Call the onSubmit handler passed from AccountPage
    onSubmit(name, email, password, setError, setLoading);
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUp}>
      {" "}
      {/* Adjusted spacing */}
      <div>
        <Label htmlFor="signup-name">{t("create_account.name")}</Label>{" "}
        {/* Unique ID */}
        <Input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("create_account.name_placeholder")}
          className="mt-1"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="signup-email">{t("create_account.email")}</Label>{" "}
        {/* Unique ID */}
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("create_account.email_placeholder")}
          className="mt-1"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="signup-password">{t("create_account.password")}</Label>{" "}
        {/* Unique ID */}
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******************"
          className="mt-1"
          required
          minLength={6} // Example validation
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">
          {t("create_account.confirm_password")}
        </Label>{" "}
        {/* Unique ID */}
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="******************"
          className="mt-1"
          required
          minLength={6} // Example validation
          disabled={loading}
        />
      </div>
      {error && <p className="text-error text-sm text-center">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <FaSpinner className="animate-spin mr-2" />}
        {loading
          ? t("create_account.creating")
          : t("create_account.create_button")}
      </Button>
    </form>
  );
};

export default AccountPage;
