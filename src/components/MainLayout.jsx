import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import Breadcrumb from "./ui/Breadcrumb";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdown";
import API, { API_URL } from "../services/api";

const MainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logo, setLogo] = useState(null);

  // Fetch logo from parameters
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await API.getParameters();
        const params = response.data.data || [];
        const logoParam = params.find((p) => p.key === "logo");
        if (logoParam && logoParam.value) {
          setLogo(`${API_URL}/${logoParam.value}`);
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };
    fetchLogo();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-base-100 text-base-content">
      {/* Navbar */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b-2 border-neutral fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <img
                src={logo || "/logo.svg"}
                alt={t("dashboard.logo_alt")}
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-base-content ml-2 group-hover:text-primary transition-colors duration-300">
                {t("dashboard.heading")}
              </h1>
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <LanguageSwitcher />
            {user ? (
              <UserDropdown user={user} onLogout={logout} />
            ) : (
              <Link to="/account">
                <Button variant="primary" size="sm">
                  {t("login.login_button")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pt-24">
        <Breadcrumb />
        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      {/* Optional Footer */}
      {/* ... */}
    </div>
  );
};

export default MainLayout;
