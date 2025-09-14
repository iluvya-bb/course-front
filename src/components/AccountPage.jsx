
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "framer-motion";

const AccountPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content">
            {isLogin ? t("login.title") : t("create_account.title")}
          </h1>
          <p className="text-base-content/80 mt-2">
            {isLogin
              ? t("login.subtitle")
              : t("create_account.subtitle")}
          </p>
        </div>

        <div className="bg-neutral p-8 rounded-lg border-2 border-neutral shadow-[8px_8px_0px_#00F6FF]">
          {isLogin ? <LoginForm onLogin={onLogin} /> : <SignUpForm onLogin={onLogin} />}
        </div>

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

const LoginForm = ({ onLogin }) => {
  const { t } = useTranslation();

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <Label htmlFor="email">{t("login.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("login.email_placeholder")}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">{t("login.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder="******************"
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full">
        {t("login.login_button")}
      </Button>
    </form>
  );
};

const SignUpForm = ({ onLogin }) => {
  const { t } = useTranslation();

  const handleSignUp = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <form className="space-y-6" onSubmit={handleSignUp}>
      <div>
        <Label htmlFor="name">{t("create_account.name")}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t("create_account.name_placeholder")}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">{t("create_account.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("create_account.email_placeholder")}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">{t("create_account.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder="******************"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">
          {t("create_account.confirm_password")}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="******************"
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full">
        {t("create_account.create_button")}
      </Button>
    </form>
  );
};

export default AccountPage;
