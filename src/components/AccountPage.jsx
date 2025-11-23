import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button"; // Assuming these exist
import { Input } from "./ui/input"; // Assuming these exist
import { Label } from "./ui/label"; // Assuming these exist
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSpinner } from "react-icons/fa"; // Optional: for loading spinner
import ForgotPasswordModal from "./ForgotPasswordModal";
import { API_URL } from "../services/api";

const AccountPage = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleLoginSubmit = async (email, password, setError, setLoading) => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err || t("login.error_generic"));
      setLoading(false);
    }
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
      await register({ username: name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err || t("create_account.error_generic"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-brand-cream/10 to-brand-lavender/5">
        {/* Morphing blobs */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #7776bc 0%, transparent 70%)",
            filter: "blur(80px)",
            x: smoothMouseX,
            y: smoothMouseY,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #ff764d 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #ddec51 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #7776bc 1px, transparent 1px),
              linear-gradient(to bottom, #7776bc 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-lavender/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Title with gradient animation */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl md:text-6xl font-black mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(isLogin ? t("login.title") : t("create_account.title"))
              .split("")
              .map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(110deg, #7776bc 0%, #9b87d4 25%, #ff764d 50%, #9b87d4 75%, #7776bc 100%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "50% 0%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.015,
                    ease: "easeOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
          </motion.h1>
          <motion.p
            className="text-base-content/70 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isLogin ? t("login.subtitle") : t("create_account.subtitle")}
          </motion.p>
        </div>

        {/* Form Container with glass morphism */}
        <motion.div
          className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px rgba(119, 118, 188, 0.2)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(135deg, rgba(119, 118, 188, 0.15), rgba(255, 118, 77, 0.15), rgba(221, 236, 81, 0.15))",
            }}
            animate={{
              background: [
                "linear-gradient(135deg, rgba(119, 118, 188, 0.15), rgba(255, 118, 77, 0.15), rgba(221, 236, 81, 0.15))",
                "linear-gradient(135deg, rgba(255, 118, 77, 0.15), rgba(221, 236, 81, 0.15), rgba(119, 118, 188, 0.15))",
                "linear-gradient(135deg, rgba(221, 236, 81, 0.15), rgba(119, 118, 188, 0.15), rgba(255, 118, 77, 0.15))",
                "linear-gradient(135deg, rgba(119, 118, 188, 0.15), rgba(255, 118, 77, 0.15), rgba(221, 236, 81, 0.15))",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10">
            {isLogin ? (
              <LoginForm
                onSubmit={handleLoginSubmit}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            ) : (
              <SignUpForm onSubmit={handleRegisterSubmit} />
            )}
          </div>
        </motion.div>

        {/* Toggle button */}
        <motion.p
          className="text-center text-base-content/70 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isLogin
            ? t("login.no_account")
            : t("create_account.already_have_account")}{" "}
          <motion.button
            onClick={toggleForm}
            className="font-bold relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className="text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #7776bc 0%, #ff764d 50%, #7776bc 100%)",
                backgroundSize: "200% 100%",
                backgroundPosition: "50% 0%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {isLogin ? t("login.create_one") : t("create_account.login_link")}
            </span>
          </motion.button>
        </motion.p>
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
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Label htmlFor="login-email" className="text-base-content font-semibold">
          {t("login.email")}
        </Label>
        <motion.div whileFocus={{ scale: 1.01 }} className="mt-1">
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.email_placeholder")}
            className="bg-white/10 border-white/20 focus:border-brand-lavender focus:ring-brand-lavender/50 transition-all duration-300"
            required
            disabled={loading}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="login-password" className="text-base-content font-semibold">
            {t("login.password")}
          </Label>
          <motion.button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-transparent"
            style={{
              backgroundImage: "linear-gradient(110deg, #7776bc, #ff764d)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
            whileHover={{ scale: 1.05 }}
            disabled={loading}
          >
            {t("login.forgot_password", { defaultValue: "Нууц үг мартсан?" })}
          </motion.button>
        </div>
        <motion.div whileFocus={{ scale: 1.01 }} className="mt-1">
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******************"
            className="bg-white/10 border-white/20 focus:border-brand-lavender focus:ring-brand-lavender/50 transition-all duration-300"
            required
            disabled={loading}
          />
        </motion.div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-error text-sm text-center font-semibold bg-error/10 p-3 rounded-lg"
        >
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full relative overflow-hidden group"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #7776bc, #ff764d)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brand-coral via-brand-yellow to-brand-coral opacity-0 group-hover:opacity-100"
              style={{ backgroundSize: "200% 100%" }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10 flex items-center justify-center">
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? t("login.logging_in") : t("login.login_button")}
            </span>
          </Button>
        </motion.div>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-transparent text-base-content/70 font-medium">
            {t("login.or", { defaultValue: "Эсвэл" })}
          </span>
        </div>
      </div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold text-gray-700 bg-white rounded-xl border-2 border-white/20 shadow-lg transition-all"
          whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t("login.google", { defaultValue: "Google-ээр нэвтрэх" })}
        </motion.button>

        <motion.button
          onClick={handleFacebookLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold text-white bg-[#1877F2] rounded-xl shadow-lg transition-all"
          whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 30px rgba(24, 119, 242, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {t("login.facebook", { defaultValue: "Facebook-ээр нэвтрэх" })}
        </motion.button>
      </motion.div>
    </form>
  );
};

// --- SignUpForm Component ---
const SignUpForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(t("create_account.error_password_match"));
      return;
    }
    onSubmit(name, email, password, setError, setLoading);
  };

  const formFields = [
    {
      id: "signup-name",
      label: t("create_account.name"),
      type: "text",
      value: name,
      onChange: setName,
      placeholder: t("create_account.name_placeholder"),
      delay: 0.1,
    },
    {
      id: "signup-email",
      label: t("create_account.email"),
      type: "email",
      value: email,
      onChange: setEmail,
      placeholder: t("create_account.email_placeholder"),
      delay: 0.15,
    },
    {
      id: "signup-password",
      label: t("create_account.password"),
      type: "password",
      value: password,
      onChange: setPassword,
      placeholder: "******************",
      minLength: 6,
      delay: 0.2,
    },
    {
      id: "confirm-password",
      label: t("create_account.confirm_password"),
      type: "password",
      value: confirmPassword,
      onChange: setConfirmPassword,
      placeholder: "******************",
      minLength: 6,
      delay: 0.25,
    },
  ];

  return (
    <form className="space-y-5" onSubmit={handleSignUp}>
      {formFields.map((field) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: field.delay }}
        >
          <Label htmlFor={field.id} className="text-base-content font-semibold">
            {field.label}
          </Label>
          <motion.div whileFocus={{ scale: 1.01 }} className="mt-1">
            <Input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="bg-white/10 border-white/20 focus:border-brand-coral focus:ring-brand-coral/50 transition-all duration-300"
              required
              minLength={field.minLength}
              disabled={loading}
            />
          </motion.div>
        </motion.div>
      ))}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-error text-sm text-center font-semibold bg-error/10 p-3 rounded-lg"
        >
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full relative overflow-hidden group"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #ff764d, #ddec51)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-lavender opacity-0 group-hover:opacity-100"
              style={{ backgroundSize: "200% 100%" }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10 flex items-center justify-center text-white font-bold">
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? t("create_account.creating") : t("create_account.create_button")}
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
};

export default AccountPage;
