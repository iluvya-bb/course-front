import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import Breadcrumb from "./ui/Breadcrumb";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdown";
import API, { API_URL } from "../services/api";
import {
	FaHome,
	FaBook,
	FaCalendarAlt,
	FaChalkboardTeacher,
	FaBars,
	FaTimes,
} from "react-icons/fa";

const MainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [logo, setLogo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define navigation links
  const navLinks = [
    {
      path: "/dashboard",
      label: t("nav.dashboard", { defaultValue: "Нүүр" }),
      icon: FaHome,
    },
    {
      path: "/courses",
      label: t("nav.courses", { defaultValue: "Хичээлүүд" }),
      icon: FaBook,
    },
    {
      path: "/teachers",
      label: t("nav.teachers", { defaultValue: "Багш нар" }),
      icon: FaChalkboardTeacher,
    },
    {
      path: "/booking",
      label: t("nav.booking", { defaultValue: "Багш захиалах" }),
      icon: FaCalendarAlt,
    },
    {
      path: "/my-bookings",
      label: t("nav.my_bookings", { defaultValue: "Миний захиалгууд" }),
      icon: FaCalendarAlt,
    },
  ];

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
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
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

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                        isActive
                          ? "bg-primary text-white font-semibold"
                          : "text-base-content hover:bg-base-200 hover:text-primary"
                      }`}
                    >
                      <Icon className="text-sm" />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <LanguageSwitcher />
              {user ? (
                <>
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-md hover:bg-base-200"
                  >
                    {mobileMenuOpen ? (
                      <FaTimes className="text-xl" />
                    ) : (
                      <FaBars className="text-xl" />
                    )}
                  </button>
                  <UserDropdown user={user} onLogout={logout} />
                </>
              ) : (
                <Link to="/account">
                  <Button variant="primary" size="sm">
                    {t("login.login_button")}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {user && mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-neutral pt-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                        isActive
                          ? "bg-primary text-white font-semibold"
                          : "text-base-content hover:bg-base-200 hover:text-primary"
                      }`}
                    >
                      <Icon />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
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
