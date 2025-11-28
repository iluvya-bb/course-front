import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API from "../../services/api";
import {
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

const DirectVideoUpload = ({ onUploadComplete, onError }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, completed, error
  const [uploadedS3Key, setUploadedS3Key] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/x-matroska",
      ];
      if (!validTypes.includes(file.type)) {
        setErrorMessage(
          t("teacher.lessons.video_upload.invalid_type")
        );
        setUploadStatus("error");
        return;
      }

      // Validate file size (max 5GB)
      const maxSize = 5 * 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrorMessage(t("teacher.lessons.video_upload.file_too_large"));
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
      setUploadProgress(0);
      setErrorMessage("");
    }
  };

  const uploadToS3 = async () => {
    if (!selectedFile) {
      setErrorMessage(t("teacher.lessons.video_upload.no_file"));
      setUploadStatus("error");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Step 1: Get pre-signed URL
      console.log("Getting pre-signed URL...");
      const initiateResponse = await API.initiateVideoUpload({
        filename: selectedFile.name,
        contentType: selectedFile.type,
        fileSize: selectedFile.size,
      });

      const { uploadUrl, s3Key } = initiateResponse.data.data;
      console.log("Pre-signed URL received:", s3Key);

      // Step 2: Upload directly to S3
      console.log("Uploading to S3...");
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log("Upload to S3 complete!");
      setUploadStatus("completed");
      setUploadedS3Key(s3Key);

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(s3Key);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      const message =
        error.response?.data?.error ||
        error.message ||
        t("teacher.lessons.video_upload.upload_failed");
      setErrorMessage(message);
      setUploadStatus("error");

      if (onError) {
        onError(error);
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadedS3Key(null);
    setErrorMessage("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("teacher.lessons.video")} *
        </label>

        {uploadStatus === "idle" || uploadStatus === "error" ? (
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="video/*,.mkv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                cursor-pointer transition-all"
            />
            {selectedFile && (
              <button
                type="button"
                onClick={uploadToS3}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg flex items-center space-x-2 transition-all"
              >
                <FaUpload />
                <span>{t("teacher.lessons.video_upload.upload")}</span>
              </button>
            )}
          </div>
        ) : null}

        {selectedFile && uploadStatus === "idle" && (
          <div className="mt-2 text-sm text-gray-600">
            {t("teacher.lessons.selected")}: {selectedFile.name} (
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadStatus === "uploading" && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-2">
            <FaSpinner className="animate-spin text-blue-600 text-xl" />
            <span className="font-semibold text-blue-900">
              {t("teacher.lessons.video_upload.uploading")} {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
            MB)
          </div>
        </div>
      )}

      {/* Upload Completed */}
      {uploadStatus === "completed" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaCheckCircle className="text-green-600 text-2xl" />
            <div className="flex-1">
              <div className="font-semibold text-green-900">
                {t("teacher.lessons.video_upload.upload_complete")}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {t("teacher.lessons.video_upload.file")}: {selectedFile.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                S3 Key: {uploadedS3Key}
              </div>
            </div>
            <button
              type="button"
              onClick={resetUpload}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              {t("teacher.lessons.video_upload.upload_another")}
            </button>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadStatus === "error" && errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaExclamationCircle className="text-red-600 text-2xl" />
            <div className="flex-1">
              <div className="font-semibold text-red-900">
                {t("teacher.lessons.video_upload.error")}
              </div>
              <div className="text-sm text-red-700 mt-1">{errorMessage}</div>
            </div>
            <button
              type="button"
              onClick={resetUpload}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              {t("teacher.lessons.video_upload.retry")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectVideoUpload;
