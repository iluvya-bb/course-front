import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-base-content hover:text-primary">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const name = t(`${value}.title`, { ns: "translation", defaultValue: value });

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-6 h-6 text-base-content/50" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-base-content/80 md:ml-2 capitalize">
                    {name}
                  </span>
                ) : (
                  <Link to={to} className="ml-1 text-sm font-medium text-base-content hover:text-primary md:ml-2 capitalize">
                    {name}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
