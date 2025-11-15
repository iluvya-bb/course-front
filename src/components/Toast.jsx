import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	const styles = {
		success: {
			bg: "bg-green-100",
			border: "border-green-400",
			text: "text-green-800",
			icon: <FaCheckCircle className="text-green-600" />,
		},
		error: {
			bg: "bg-red-100",
			border: "border-red-400",
			text: "text-red-800",
			icon: <FaExclamationCircle className="text-red-600" />,
		},
		info: {
			bg: "bg-blue-100",
			border: "border-blue-400",
			text: "text-blue-800",
			icon: <FaInfoCircle className="text-blue-600" />,
		},
		warning: {
			bg: "bg-yellow-100",
			border: "border-yellow-400",
			text: "text-yellow-800",
			icon: <FaExclamationCircle className="text-yellow-600" />,
		},
	};

	const style = styles[type] || styles.info;

	return (
		<div
			className={`fixed top-4 right-4 z-50 max-w-sm w-full ${style.bg} ${style.border} border rounded-lg shadow-lg overflow-hidden animate-slideIn`}
		>
			<div className="p-4 flex items-start gap-3">
				<div className="text-xl mt-0.5">{style.icon}</div>
				<div className={`flex-1 ${style.text} text-sm font-medium`}>
					{message}
				</div>
				<button
					onClick={onClose}
					className={`${style.text} hover:opacity-70 transition`}
				>
					<FaTimes />
				</button>
			</div>
			{duration > 0 && (
				<div className="h-1 bg-gray-200">
					<div
						className={`h-full ${
							type === "success"
								? "bg-green-600"
								: type === "error"
								? "bg-red-600"
								: type === "warning"
								? "bg-yellow-600"
								: "bg-blue-600"
						} animate-shrink`}
						style={{ animationDuration: `${duration}ms` }}
					></div>
				</div>
			)}
		</div>
	);
};

export default Toast;
