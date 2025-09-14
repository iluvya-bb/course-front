import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import CourseCard from "./dashboard/CourseCard";
import { mockCourses } from "./dashboard/mockCourses";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const { t } = useTranslation(["translation", "course"]);

  // Mock user data
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    memberSince: "January 2023",
  };

  const subscribedCourses = mockCourses.filter((course) => course.subscribed);

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
            
          </div>
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-8 pt-24 mt-18">
        <div className="p-8 bg-neutral rounded-md border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8">
          <h2 className="text-3xl font-bold text-base-content">
            {t("settings.title")}
          </h2>
          <p className="mt-2 text-base-content text-lg">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral p-6 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              {t("settings.user_info_heading")}
            </h3>
            <p className="text-base-content">
              <strong>{t("settings.name")}:</strong> {mockUser.name}
            </p>
            <p className="text-base-content">
              <strong>{t("settings.email")}:</strong> {mockUser.email}
            </p>
            <p className="text-base-content">
              <strong>{t("settings.member_since")}:</strong> {mockUser.memberSince}
            </p>
          </div>

          <div className="bg-neutral p-6 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              {t("settings.subscribed_courses_heading")}
            </h3>
            {subscribedCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {subscribedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-base-content">
                {t("settings.no_subscribed_courses")}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
