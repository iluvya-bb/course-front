
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
          i18n.language === "en"
            ? "bg-primary text-neutral"
            : "bg-neutral text-base-content hover:bg-neutral/80"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("mn")}
        className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
          i18n.language === "mn"
            ? "bg-primary text-neutral"
            : "bg-neutral text-base-content hover:bg-neutral/80"
        }`}
      >
        MN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
