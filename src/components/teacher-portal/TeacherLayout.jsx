import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import LanguageSwitcher from "../LanguageSwitcher";
import Breadcrumb from "../ui/Breadcrumb";
import { useAuth } from "../../contexts/AuthContext";
import UserDropdown from "../UserDropdown";
import API, { API_URL } from "../../services/api";
import {
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

const TeacherLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [logo, setLogo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define teacher navigation links
  const navLinks = [
    {
      path: "/teacher/dashboard",
      label: t("teacher.nav.dashboard"),
      icon: FaHome,
    },
    {
      path: "/teacher/courses",
      label: t("teacher.nav.courses"),
      icon: FaBook,
    },
    {
      path: "/teacher/bookings",
      label: t("teacher.nav.bookings"),
      icon: FaCalendarAlt,
    },
    {
      path: "/teacher/availability",
      label: t("teacher.nav.availability"),
      icon: FaClock,
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
      <nav className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md border-b-2 border-primary/30 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <Link to="/teacher/dashboard" className="flex items-center group">
                <img
                  src={logo || "/logo.svg"}
                  alt="Logo"
                  className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
                />
                <h1 className="text-xl sm:text-2xl font-bold text-primary ml-2 group-hover:text-secondary transition-colors duration-300">
                  {t("teacher.portal")}
                </h1>
              </Link>
              {/* Switch to Student View Button */}
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-lg text-sm font-medium transition-all"
              >
                <FaArrowLeft className="text-xs" />
                <span>{t("teacher.student_view")}</span>
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                          ? "bg-primary text-white font-semibold shadow-lg"
                          : "text-base-content hover:bg-primary/20 hover:text-primary"
                        }`}
                    >
                      <Icon className="text-sm" />
                      <span className="text-sm font-medium">{link.label}</span>
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
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {user && mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-primary/30 pt-4">
              <div className="flex flex-col space-y-2">
                {/* Switch to Student View (Mobile) */}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-base-200 hover:bg-base-300 transition-all"
                >
                  <FaArrowLeft />
                  <span>{t("teacher.student_view")}</span>
                </Link>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                          ? "bg-primary text-white font-semibold"
                          : "text-base-content hover:bg-primary/20 hover:text-primary"
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
    </div>
  );
};

export default TeacherLayout;
