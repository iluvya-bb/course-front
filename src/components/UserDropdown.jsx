import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import API from "../services/api"; // For API_URL if needed for avatar

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

  const handleLinkClick = () => setIsOpen(false); // Close dropdown on link click

  // Construct avatar URL
  const avatarUrl = user?.avatar
    ? `${API.defaults.baseURL}/${user.avatar}` // Use API baseURL if avatar is relative path
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Badge/Avatar */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 p-1 rounded-full hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="h-8 w-8 text-gray-400" />
        )}
        {/* Optional: Add name next to avatar on larger screens */}
        {/* <span className="hidden sm:inline text-sm font-medium">{user?.username}</span> */}
        <FaChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 focus:outline-none py-1 border border-neutral"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {/* Optional: Display user info at the top */}
          <div className="px-4 py-2 border-b border-neutral mb-1">
            <p className="text-sm font-medium text-base-content truncate">
              {user?.username || t("guest")}
            </p>
            <p className="text-xs text-base-content/70 truncate">
              {user?.email}
            </p>
          </div>

          {/* Profile Link */}
          <Link
            to="/profile"
            onClick={handleLinkClick}
            className="flex items-center w-full px-4 py-2 text-sm text-base-content hover:bg-base-200 hover:text-primary"
            role="menuitem"
          >
            <FaUser className="mr-2 h-4 w-4" />
            {t("nav.profile", { defaultValue: "Профайл" })}
          </Link>

          {/* My Bookings Link */}
          <Link
            to="/my-bookings"
            onClick={handleLinkClick}
            className="flex items-center w-full px-4 py-2 text-sm text-base-content hover:bg-base-200 hover:text-primary"
            role="menuitem"
          >
            <FaCalendarAlt className="mr-2 h-4 w-4" />
            {t("nav.my_bookings", { defaultValue: "Миний захиалгууд" })}
          </Link>

          {/* Settings Link */}
          <Link
            to="/settings"
            onClick={handleLinkClick}
            className="flex items-center w-full px-4 py-2 text-sm text-base-content hover:bg-base-200 hover:text-primary"
            role="menuitem"
          >
            <FaCog className="mr-2 h-4 w-4" />
            {t("dashboard.settings", { defaultValue: "Тохиргоо" })}
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLinkClick(); // Close dropdown first
              onLogout(); // Then call logout
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-base-200 border-t border-neutral mt-1" // Use error color for logout
            role="menuitem"
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            {t("dashboard.logout", { defaultValue: "Гарах" })}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
