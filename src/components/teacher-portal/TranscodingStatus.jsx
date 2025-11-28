import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../services/api";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
} from "react-icons/fa";

const TranscodingStatus = ({ lessonId, onComplete }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      try {
        const response = await API.getTranscodingStatus(lessonId);
        const { status: newStatus } = response.data.data;

        setStatus(newStatus);
        setLoading(false);

        // If completed or failed, stop polling
        if (newStatus === "completed" || newStatus === "failed") {
          if (intervalId) {
            clearInterval(intervalId);
          }
          if (newStatus === "completed" && onComplete) {
            onComplete();
          }
        }
      } catch (err) {
        console.error("Failed to check transcoding status:", err);
        setError(err.message);
        setLoading(false);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    // Initial check
    checkStatus();

    // Poll every 5 seconds if not completed or failed
    if (status === "pending" || status === "processing") {
      intervalId = setInterval(checkStatus, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lessonId, status, onComplete]);

  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return {
          icon: <FaClock className="animate-pulse" />,
          text: t("teacher.lessons.transcoding.pending"),
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "processing":
        return {
          icon: <FaSpinner className="animate-spin" />,
          text: t("teacher.lessons.transcoding.processing"),
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "completed":
        return {
          icon: <FaCheckCircle />,
          text: t("teacher.lessons.transcoding.completed"),
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "failed":
        return {
          icon: <FaExclamationCircle />,
          text: t("teacher.lessons.transcoding.failed"),
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: <FaClock />,
          text: status,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  if (loading && status === "pending") {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <FaSpinner className="animate-spin" />
        <span>{t("teacher.lessons.transcoding.checking")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <FaExclamationCircle />
        <span>
          {t("teacher.lessons.transcoding.check_failed")}: {error}
        </span>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}
    >
      <div className={`text-2xl ${statusDisplay.color}`}>
        {statusDisplay.icon}
      </div>
      <div className="flex-1">
        <div className={`font-semibold ${statusDisplay.color}`}>
          {t("teacher.lessons.transcoding.title")}: {statusDisplay.text}
        </div>
        {status === "processing" && (
          <div className="text-sm text-gray-600 mt-1">
            {t("teacher.lessons.transcoding.processing_msg")}
          </div>
        )}
        {status === "completed" && (
          <div className="text-sm text-gray-600 mt-1">
            {t("teacher.lessons.transcoding.completed_msg")}
          </div>
        )}
        {status === "failed" && (
          <div className="text-sm text-gray-600 mt-1">
            {t("teacher.lessons.transcoding.failed_msg")}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscodingStatus;
