import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import API from "../../services/api";

const FilterBar = ({ onSearch, onCategoryChange, onSubscribedChange }) => {
	const { t, i18n } = useTranslation();
	const [categories, setCategories] = useState([]);

	// Fetch categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await API.getCategories();
				setCategories(response.data.data || []);
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			}
		};
		fetchCategories();
	}, []);

	return (
		<div className="flex flex-col md:flex-row gap-4 mb-8">
			<Input
				placeholder={t("dashboard.search_placeholder")}
				onChange={(e) => onSearch(e.target.value)}
				className="flex-grow"
			/>
			<select
				onChange={(e) => onCategoryChange(e.target.value)}
				className="h-12 w-full md:w-auto rounded-md border-2 border-neutral bg-base-100 px-4 py-3 text-lg font-semibold text-base-content ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-[4px_4px_0px_#1A1A1A] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all duration-200"
			>
				<option value="">{t("dashboard.all_categories")}</option>
				{categories.map((category) => {
					const categoryName = typeof category.name === 'object'
						? category.name[i18n.language] || category.name.en || category.name.mn
						: category.name;
					return (
						<option key={category.id} value={category.id}>
							{categoryName}
						</option>
					);
				})}
			</select>
			<select
				onChange={(e) => onSubscribedChange(e.target.value)}
				className="h-12 w-full md:w-auto rounded-md border-2 border-neutral bg-base-100 px-4 py-3 text-lg font-semibold text-base-content ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-[4px_4px_0px_#1A1A1A] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all duration-200"
			>
				<option value="all">{t("dashboard.all_courses")}</option>
				<option value="subscribed">{t("dashboard.subscribed")}</option>
			</select>
		</div>
	);
};

export default FilterBar;
