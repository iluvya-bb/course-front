import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaClock,
  FaSave,
  FaPlus,
  FaTrash,
  FaBan,
} from "react-icons/fa";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Label } from "../ui/label";

const AvailabilityScheduler = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const teacherId = user?.teacherProfile?.id;

  const DAYS = [
    { value: 0, label: t("teacher.availability.sunday") },
    { value: 1, label: t("teacher.availability.monday") },
    { value: 2, label: t("teacher.availability.tuesday") },
    { value: 3, label: t("teacher.availability.wednesday") },
    { value: 4, label: t("teacher.availability.thursday") },
    { value: 5, label: t("teacher.availability.friday") },
    { value: 6, label: t("teacher.availability.saturday") },
  ];

  const [availability, setAvailability] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New availability slot
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });

  // New blocked date
  const [newBlock, setNewBlock] = useState({
    blockedDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availRes, blockedRes] = await Promise.all([
        API.getTeacherAvailability(teacherId),
        API.getTeacherBlockedDates(teacherId),
      ]);
      setAvailability(availRes.data.data || []);
      setBlockedDates(blockedRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    setAvailability((prev) => [...prev, { ...newSlot, isActive: true }]);
    setNewSlot({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
  };

  const handleRemoveSlot = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    try {
      setSaving(true);
      await API.setTeacherAvailability(teacherId, {
        availabilities: availability.map((slot) => ({
          dayOfWeek: parseInt(slot.dayOfWeek),
          startTime: `${slot.startTime}:00`,
          endTime: `${slot.endTime}:00`,
        })),
      });
      alert(t("teacher.availability.save_success"));
      fetchData();
    } catch (error) {
      console.error("Failed to save availability:", error);
      alert(t("teacher.availability.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newBlock.blockedDate) {
      alert(t("teacher.availability.select_date"));
      return;
    }

    try {
      const data = {
        blockedDate: newBlock.blockedDate,
      };
      if (newBlock.startTime) data.startTime = `${newBlock.startTime}:00`;
      if (newBlock.endTime) data.endTime = `${newBlock.endTime}:00`;
      if (newBlock.reason) data.reason = newBlock.reason;

      await API.addTeacherBlockedDate(teacherId, data);
      setNewBlock({ blockedDate: "", startTime: "", endTime: "", reason: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to add blocked date:", error);
      alert(t("teacher.availability.block_failed"));
    }
  };

  const handleRemoveBlockedDate = async (blockId) => {
    try {
      await API.removeTeacherBlockedDate(teacherId, blockId);
      fetchData();
    } catch (error) {
      console.error("Failed to remove blocked date:", error);
      alert(t("teacher.availability.remove_failed"));
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t("teacher.availability.loading")}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t("teacher.availability.title")}</h1>
        <p className="text-gray-600 mt-2">
          {t("teacher.availability.subtitle")}
        </p>
      </div>

      {/* Weekly Availability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("teacher.availability.weekly_title")}</h2>

        {/* Current Slots */}
        <div className="space-y-4 mb-6">
          {availability.map((slot, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={slot.dayOfWeek}
                  onChange={(e) => {
                    const updated = [...availability];
                    updated[index].dayOfWeek = parseInt(e.target.value);
                    setAvailability(updated);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                >
                  {DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => {
                    const updated = [...availability];
                    updated[index].startTime = e.target.value;
                    setAvailability(updated);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => {
                    const updated = [...availability];
                    updated[index].endTime = e.target.value;
                    setAvailability(updated);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleRemoveSlot(index)}
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Slot */}
        <div className="p-6 bg-primary/5 rounded-xl mb-6">
          <h3 className="font-bold text-gray-800 mb-4">{t("teacher.availability.add_slot")}</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={newSlot.dayOfWeek}
              onChange={(e) =>
                setNewSlot((prev) => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))
              }
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) =>
                setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))
              }
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) =>
                setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))
              }
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleAddSlot}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-bold transition-all whitespace-nowrap"
            >
              <FaPlus />
              <span>{t("teacher.availability.add")}</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveAvailability}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
        >
          <FaSave />
          <span>{saving ? t("teacher.availability.saving") : t("teacher.availability.save")}</span>
        </button>
      </motion.div>

      {/* Blocked Dates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("teacher.availability.blocked_title")}</h2>

        {/* Add New Blocked Date */}
        <div className="p-6 bg-red-50 rounded-xl mb-6">
          <h3 className="font-bold text-gray-800 mb-4">{t("teacher.availability.block_date")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="blockDate">{t("teacher.availability.date")}</Label>
              <input
                id="blockDate"
                type="date"
                value={newBlock.blockedDate}
                onChange={(e) =>
                  setNewBlock((prev) => ({ ...prev, blockedDate: e.target.value }))
                }
                className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="blockReason">{t("teacher.availability.reason")}</Label>
              <input
                id="blockReason"
                type="text"
                value={newBlock.reason}
                onChange={(e) =>
                  setNewBlock((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder={t("teacher.availability.reason_placeholder")}
                className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="blockStart">{t("teacher.availability.start_time")}</Label>
              <input
                id="blockStart"
                type="time"
                value={newBlock.startTime}
                onChange={(e) =>
                  setNewBlock((prev) => ({ ...prev, startTime: e.target.value }))
                }
                className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{t("teacher.availability.all_day_hint")}</p>
            </div>
            <div>
              <Label htmlFor="blockEnd">{t("teacher.availability.end_time")}</Label>
              <input
                id="blockEnd"
                type="time"
                value={newBlock.endTime}
                onChange={(e) =>
                  setNewBlock((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleAddBlockedDate}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all"
          >
            <FaBan />
            <span>{t("teacher.availability.block_button")}</span>
          </button>
        </div>

        {/* Blocked Dates List */}
        <div className="space-y-3">
          {blockedDates.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t("teacher.availability.no_blocked")}</p>
          ) : (
            blockedDates.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    {new Date(block.blockedDate).toLocaleDateString()}
                    {block.startTime && ` - ${block.startTime}`}
                    {block.endTime && ` ${t("teacher.availability.to")} ${block.endTime}`}
                  </p>
                  {block.reason && (
                    <p className="text-sm text-gray-600 mt-1">{block.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveBlockedDate(block.id)}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AvailabilityScheduler;
