import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button"; // Assuming these exist
import { Input } from "./ui/input"; // Assuming these exist
import { Label } from "./ui/label"; // Assuming these exist
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSpinner } from "react-icons/fa"; // Optional: for loading spinner

const AccountPage = () => {
  // Removed onLogin prop
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth(); // Get login/register functions from context
  const navigate = useNavigate(); // Hook for navigation

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
            <LoginForm onSubmit={handleLoginSubmit} />
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
    </div>
  );
};

// --- LoginForm Component ---
const LoginForm = ({ onSubmit }) => {
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
        <Label htmlFor="login-password">{t("login.password")}</Label>{" "}
        {/* Unique ID */}
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
