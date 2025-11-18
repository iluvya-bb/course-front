import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral to-base-200 px-4">
			<div className="max-w-md w-full text-center">
				<div className="mb-8">
					<FaExclamationTriangle className="mx-auto text-warning text-6xl mb-4 animate-bounce" />
					<h1 className="text-6xl font-bold text-base-content mb-2">404</h1>
					<h2 className="text-2xl font-semibold text-base-content/80 mb-4">
						{t("not_found.title", { defaultValue: "Хуудас олдсонгүй" })}
					</h2>
					<p className="text-base-content/60 mb-8">
						{t("not_found.message", {
							defaultValue:
								"Уучлаарай, таны хайсан хуудас олдсонгүй. Хаяг буруу эсвэл хуудас устгагдсан байж магадгүй.",
						})}
					</p>
				</div>

				<Link
					to="/dashboard"
					className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-content font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
				>
					<FaHome />
					{t("not_found.go_home", { defaultValue: "Нүүр хуудас руу буцах" })}
				</Link>

				<div className="mt-8 text-sm text-base-content/50">
					<p>
						{t("not_found.help", {
							defaultValue: "Тусламж хэрэгтэй бол манай дэмжлэг үзүүлэх багтай холбогдоно уу.",
						})}
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
