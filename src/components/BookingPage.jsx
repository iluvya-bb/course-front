import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getUsers } from "../services/userService";
import { createSubscription } from "../services/subscriptionService";

const BookingPage = () => {
  const { t } = useTranslation(["translation", "booking"]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [sessionType, setSessionType] = useState("one-on-one");
  const [note, setNote] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("All");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const users = await getUsers();
        const teachers = users.filter(user => user.role === 'teacher');
        setTeachers(teachers);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const availableSpecialties = useMemo(() => {
    const specialties = new Set(
      teachers.map((teacher) => teacher.specialty)
    );
    return ["All", ...Array.from(specialties)];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearchQuery = teacher.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        filterSpecialty === "All" || teacher.specialty === filterSpecialty;
      return matchesSearchQuery && matchesSpecialty;
    });
  }, [searchQuery, filterSpecialty, teachers]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) {
      alert(t("booking.select_teacher_alert"));
      return;
    }
    try {
      await createSubscription({ 
        courseId: selectedTeacher.courseId, // Assuming teacher is associated with a course
        userId: selectedTeacher.id, // Assuming the logged in user will be handled by the backend
        note,
        contactNumber,
        sessionType
      });
      alert(
        t("booking.booking_success_alert", { teacherName: selectedTeacher.name })
      );
      setSelectedTeacher(null);
      setSessionType("one-on-one");
      setNote("");
      setContactNumber("");
      setSearchQuery("");
      setFilterSpecialty("All");
    } catch (error) {
      alert(t("booking.booking_error_alert"));
      console.error("Error creating subscription:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
      <main className="flex-1 p-4 md:p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 bg-neutral rounded-lg border-2 border-neutral shadow-[8px_8px_0px_#00F6FF] mb-8"
        >
          <h2 className="text-3xl font-bold text-base-content">
            {t("booking.title")}
          </h2>
          <p className="mt-2 text-base-content/80 text-lg">
            {t("booking.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-neutral p-6 rounded-lg border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              {t("booking.select_teacher")}
            </h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                type="text"
                placeholder={t("booking.search_teacher_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <select
                className="select select-bordered w-full md:w-auto bg-base-200 text-base-content border-neutral"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                {availableSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTeacher?.id === teacher.id
                        ? "bg-primary text-primary-content shadow-md scale-105"
                        : "bg-base-200 hover:bg-base-300"
                    }`}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <img
                      src={teacher.imageUrl}
                      alt={teacher.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-primary"
                    />
                    <div>
                      <p className="font-bold text-lg">{teacher.name}</p>
                      <p className="text-sm opacity-80">{teacher.specialty}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-base-content col-span-full text-center py-8">
                  {t("booking.no_teachers_found")}
                </p>
              )}
            </div>
          </div>

          <div className="bg-neutral p-6 rounded-lg border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              {t("booking.session_details")}
            </h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <Label>{t("booking.selected_teacher")}</Label>
                <p className="text-lg font-semibold mt-1">
                  {selectedTeacher
                    ? selectedTeacher.name
                    : t("booking.none_selected")}
                </p>
              </div>

              <div>
                <Label htmlFor="sessionType">{t("booking.session_type")}</Label>
                <select
                  id="sessionType"
                  className="select select-bordered w-full bg-base-200 text-base-content border-neutral mt-1"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                >
                  <option value="one-on-one">{t("booking.one_on_one")}</option>
                  <option value="class">{t("booking.class_session")}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="note">{t("booking.note_for_teacher")}</Label>
                <textarea
                  id="note"
                  placeholder={t("booking.note_placeholder")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="4"
                  className="textarea textarea-bordered w-full bg-base-200 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contactNumber">
                  {t("booking.contact_number")}
                </Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder={t("booking.contact_number_placeholder")}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full" disabled={!selectedTeacher}>
                {t("booking.book_session")}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
