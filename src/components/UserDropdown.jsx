import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import API from "../services/api";

const UserDropdown = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  // Construct avatar URL
  const avatarUrl = user?.avatar
    ? `${API.defaults.baseURL}/${user.avatar}`
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button with elevated styling */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center ring-2 ring-primary/30">
              <FaUserCircle className="h-6 w-6 text-white" />
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></div>
        </div>
        <span className="hidden md:block text-sm font-semibold text-gray-700 max-w-[100px] truncate">
          {user?.username}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="h-3 w-3 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu with enhanced elevation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-72 origin-top-right"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden border border-gray-100">
              {/* User Info Header with gradient */}
              <div className="relative px-5 py-4 bg-gradient-to-br from-brand-lavender/10 via-brand-coral/10 to-brand-yellow/10 border-b-2 border-primary/20">
                <div className="flex items-center space-x-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-lavender to-brand-coral flex items-center justify-center ring-2 ring-white shadow-lg">
                      <FaUserCircle className="h-7 w-7 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.username || t("guest")}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Profile Link */}
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="group flex items-center w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200"
                  role="menuitem"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200 mr-3">
                    <FaUser className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="group-hover:text-primary transition-colors duration-200">
                    {t("nav.profile", { defaultValue: "Профайл" })}
                  </span>
                </Link>

                {/* My Bookings Link */}
                <Link
                  to="/my-bookings"
                  onClick={handleLinkClick}
                  className="group flex items-center w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200"
                  role="menuitem"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors duration-200 mr-3">
                    <FaCalendarAlt className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="group-hover:text-primary transition-colors duration-200">
                    {t("nav.my_bookings", { defaultValue: "Миний захиалгууд" })}
                  </span>
                </Link>

                {/* Settings Link */}
                <Link
                  to="/settings"
                  onClick={handleLinkClick}
                  className="group flex items-center w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200"
                  role="menuitem"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200 mr-3">
                    <FaCog className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="group-hover:text-primary transition-colors duration-200">
                    {t("dashboard.settings", { defaultValue: "Тохиргоо" })}
                  </span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={() => {
                    handleLinkClick();
                    onLogout();
                  }}
                  className="group flex items-center w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  role="menuitem"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors duration-200 mr-3">
                    <FaSignOutAlt className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-semibold">
                    {t("dashboard.logout", { defaultValue: "Гарах" })}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
