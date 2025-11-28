import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaQrcode,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import API from "../services/api";
import { Button } from "./ui/button";

const QPayPayment = ({ amount, description, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    if (amount) {
      createInvoice();
    }
  }, [amount]);

  useEffect(() => {
    let interval;
    if (invoice && !paymentCompleted) {
      // Check payment status every 3 seconds
      interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [invoice, paymentCompleted]);

  const createInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.createQPayInvoice({
        amount,
        description: description || `Wallet deposit`,
      });

      setInvoice(response.data.data);
    } catch (err) {
      console.error("Failed to create QPay invoice:", err);
      setError(err.response?.data?.error || "Failed to create payment invoice");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (checkingStatus || !invoice) return;

    try {
      setCheckingStatus(true);
      const response = await API.checkQPayStatus(invoice.transaction_id);

      if (response.data.data.status === "completed") {
        setPaymentCompleted(true);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    } catch (err) {
      console.error("Failed to check payment status:", err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCancel = async () => {
    if (invoice && invoice.transaction_id) {
      try {
        await API.cancelQPayTransaction(invoice.transaction_id);
      } catch (err) {
        console.error("Failed to cancel transaction:", err);
      }
    }
    if (onCancel) {
      onCancel();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FaSpinner className="animate-spin text-4xl text-brand-lavender mb-4" />
        <p className="text-base-content/70">{t("processing")}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
        <div className="flex items-center mb-4">
          <FaTimesCircle className="text-red-600 text-2xl mr-3" />
          <h3 className="text-lg font-bold text-red-800">Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <Button onClick={onCancel} variant="outline">
          {t("close")}
        </Button>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg">
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-green-600 text-3xl mr-3" />
          <h3 className="text-xl font-bold text-green-800">
            Payment Successful!
          </h3>
        </div>
        <p className="text-green-700 mb-2">
          Your wallet has been credited with {amount}₮
        </p>
        <p className="text-sm text-green-600">
          Transaction ID: {invoice?.invoice_no}
        </p>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="space-y-6 h-max overflow-scroll">
      {/* Payment Info */}
      <div className="bg-base-200 rounded-lg p-6 border-2 border-base-300">
        <h3 className="text-xl font-bold text-base-content mb-4">
          Payment Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-base-content/70">Amount:</span>
            <span className="font-bold text-brand-lavender text-xl">
              {amount}₮
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/70">Invoice No:</span>
            <span className="font-mono text-sm">{invoice.invoice_no}</span>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-lg p-6 border-2 border-base-300 text-center">
        <div className="flex items-center justify-center mb-4">
          <FaQrcode className="text-brand-lavender text-2xl mr-2" />
          <h3 className="text-lg font-bold text-base-content">
            Scan QR Code to Pay
          </h3>
        </div>

        {invoice.qr_image && (
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/png;base64,${invoice.qr_image}`}
              alt="QPay QR Code"
              className="w-64 h-64 border-4 border-brand-lavender rounded-lg"
            />
          </div>
        )}

        <p className="text-sm text-base-content/70 mb-4">
          Scan this QR code with your bank's mobile app
        </p>

        {/* Payment Link */}
        {invoice.qpay_shorturl && (
          <div className="mb-4">
            <a
              href={invoice.qpay_shorturl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-brand-lavender text-white rounded-lg hover:bg-brand-lavender/90 transition-colors"
            >
              <span>Open in QPay</span>
              <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>
        )}

        {/* Bank Links */}
        {invoice.urls && invoice.urls.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-base-content mb-3">
              Or pay with your bank:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {invoice.urls.map((bankUrl, index) => (
                <a
                  key={index}
                  href={bankUrl.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-base-200 hover:bg-base-300 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                >
                  {bankUrl.name}
                  <FaExternalLinkAlt className="ml-2 text-xs" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
        <div className="flex items-center">
          {checkingStatus ? (
            <FaSpinner className="animate-spin text-blue-600 mr-3" />
          ) : (
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-3 animate-pulse" />
          )}
          <span className="text-blue-800">Waiting for payment...</span>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          Payment status will update automatically once completed
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={handleCancel} variant="outline">
          Cancel Payment
        </Button>
        <Button onClick={checkPaymentStatus} disabled={checkingStatus}>
          {checkingStatus ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Checking...
            </>
          ) : (
            "Check Status"
          )}
        </Button>
      </div>
    </div>
  );
};

export default QPayPayment;
