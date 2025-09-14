import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import Breadcrumb from "./ui/Breadcrumb";
import { getCurrentUser, logout } from "../services/userService";

const MainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-base-100 text-base-content">
      <nav className="bg-base-100/80 backdrop-blur-md border-b-2 border-neutral fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo.svg"
                alt={t("dashboard.logo_alt")}
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold text-base-content ml-2">
                {t("dashboard.heading")}
              </h1>
            </Link>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
            {user && <span className="mr-4">{user.name}</span>}
            <Link to="/settings">
              <Button variant="secondary" className="ml-4">
                {t("dashboard.settings")}
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="secondary" className="ml-4">
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-8 pt-24 mt-18">
        <Breadcrumb />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
