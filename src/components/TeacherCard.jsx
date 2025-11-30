import React from "react";
import { useTranslation } from "react-i18next";
import {
	FaUserTie,
	FaMoneyBillWave,
	FaStar,
	FaCheckCircle,
} from "react-icons/fa";
import { API_URL } from "../services/api";

const TeacherCard = ({ teacher, selected, onClick }) => {
	const { t } = useTranslation(["translation", "booking"]);

	return (
		<button
			type="button"
			onClick={() => onClick(teacher)}
			className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
				selected
					? "border-primary bg-primary/10 shadow-md"
					: "border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm"
			}`}
		>
			<div className="flex items-start gap-4">
				{/* Teacher Avatar */}
				<div className="flex-shrink-0">
					{teacher.avatar ? (
						<img
							src={`${API_URL}/${teacher.avatar}`}
							alt={teacher.name}
							className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
						/>
					) : (
						<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
							<FaUserTie className="text-white text-2xl" />
						</div>
					)}
				</div>

				{/* Teacher Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1">
							<h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
								{teacher.name}
								{selected && (
									<FaCheckCircle className="text-primary text-sm" />
								)}
							</h3>
							{teacher.title && (
								<p className="text-sm text-gray-600">{teacher.title}</p>
							)}
						</div>

						{/* Hourly Rate */}
						{teacher.hourlyRate && (
							<div className="text-right flex-shrink-0">
								<div className="flex items-center gap-1 text-secondary font-bold">
									<FaMoneyBillWave className="text-sm" />
									<span>₮{teacher.hourlyRate.toLocaleString()}</span>
								</div>
								<p className="text-xs text-gray-500">
									{t("booking.per_hour", { defaultValue: "/цаг" })}
								</p>
							</div>
						)}
					</div>

					{/* Specialization */}
					{teacher.specialization && (
						<p className="text-sm text-primary mt-2 font-medium">
							{teacher.specialization}
						</p>
					)}

					{/* Bio */}
					{teacher.bio && (
						<p className="text-sm text-gray-600 mt-2 line-clamp-2">
							{teacher.bio}
						</p>
					)}

					{/* Rating & Stats */}
					<div className="flex items-center gap-4 mt-3 text-sm">
						{teacher.rating && (
							<div className="flex items-center gap-1 text-yellow-600">
								<FaStar />
								<span className="font-medium">{teacher.rating.toFixed(1)}</span>
								{teacher.reviewCount && (
									<span className="text-gray-500">({teacher.reviewCount})</span>
								)}
							</div>
						)}
						{teacher.experienceYears && (
							<span className="text-gray-600">
								{teacher.experienceYears}{" "}
								{t("booking.years_experience", { defaultValue: "жилийн туршлага" })}
							</span>
						)}
					</div>

					{/* Price Estimate Notice */}
					{!teacher.hourlyRate && (
						<p className="text-xs text-gray-500 mt-2 italic">
							{t("booking.price_on_request", {
								defaultValue: "Үнэ баталгаажуулалтын дараа тогтоох",
							})}
						</p>
					)}
				</div>
			</div>
		</button>
	);
};

export default TeacherCard;
