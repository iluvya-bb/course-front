import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { register } from "../services/userService";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-100 to-base-300">
      <div className="p-8 bg-neutral rounded-lg border-2 border-neutral shadow-[12px_12px_0px_#00F6FF] w-full max-w-md">
        <h2 className="text-3xl font-bold text-base-content text-center">
          {t("register.title")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="label">
              <span className="label-text">{t("register.name")}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-base-200"
              placeholder={t("register.name_placeholder")}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">{t("register.email")}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-base-200"
              placeholder={t("register.email_placeholder")}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">{t("register.password")}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-base-200"
              placeholder={t("register.password_placeholder")}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            {t("register.register_button")}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="link link-primary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;