import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import API, { API_URL } from "../services/api";
import {
  Code,
  Brush,
  Megaphone,
  Briefcase,
  BarChart2,
  Film,
  BookOpen,
  Laptop,
  ChevronRight,
} from "lucide-react";

const MAX_CATEGORIES_TO_SHOW = 6;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Icon mapping for categories
const iconMap = {
  development: <Code className="w-10 h-10" />,
  design: <Brush className="w-10 h-10" />,
  marketing: <Megaphone className="w-10 h-10" />,
  business: <Briefcase className="w-10 h-10" />,
  "data-science": <BarChart2 className="w-10 h-10" />,
  video: <Film className="w-10 h-10" />,
  education: <BookOpen className="w-10 h-10" />,
  technology: <Laptop className="w-10 h-10" />,
};

const CategoriesSection = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.getCategories();
        const categoriesData = response.data.data || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Don't render section if no categories and not loading
  if (!loading && categories.length === 0) {
    return null;
  }

  // Limit categories to show
  const displayedCategories = categories.slice(0, MAX_CATEGORIES_TO_SHOW);
  const hasMoreCategories = categories.length > MAX_CATEGORIES_TO_SHOW;

  return (
    <section id="categories" className="py-24 bg-gradient-to-b from-base-100 to-brand-cream/20 relative overflow-hidden">
      {/* Animated background blob */}
      <motion.div
        className="absolute top-10 right-0 w-80 h-80 bg-brand-coral/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-lavender via-brand-coral to-brand-yellow bg-clip-text text-transparent uppercase">
            Browse by Category
          </h2>
        </motion.div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("common.loading") || "Loading..."}</p>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {displayedCategories.map((category, index) => {
                const categoryName =
                  typeof category.name === "object"
                    ? category.name[i18n.language] ||
                    category.name.en ||
                    category.name.mn
                    : category.name;

                const gradients = [
                  "from-brand-lavender/10 to-brand-coral/10 border-brand-lavender/30 hover:shadow-brand-lavender/30",
                  "from-brand-coral/10 to-brand-yellow/10 border-brand-coral/30 hover:shadow-brand-coral/30",
                  "from-brand-yellow/10 to-brand-lime/10 border-brand-yellow/30 hover:shadow-brand-yellow/30",
                  "from-brand-lime/10 to-brand-lavender/10 border-brand-lime/30 hover:shadow-brand-lime/30",
                ];
                const iconColors = ["text-brand-lavender", "text-brand-coral", "text-brand-yellow", "text-brand-lime"];
                const gradient = gradients[index % gradients.length];
                const iconColor = iconColors[index % iconColors.length];

                return (
                  <motion.div
                    key={category.id}
                    className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl text-center border-2 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group`}
                    variants={scaleIn}
                    whileHover={{ y: -10, scale: 1.05 }}
                  >
                    {category.imageUrl ? (
                      <motion.img
                        src={`${API_URL}/${category.imageUrl}`}
                        alt={categoryName}
                        className="w-10 h-10 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <motion.div
                        className={`${iconColor} inline-block group-hover:scale-110 transition-transform`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {iconMap[category.slug] || iconMap.education}
                      </motion.div>
                    )}
                    <h3 className="mt-4 text-lg font-bold text-base-content group-hover:text-brand-lavender transition-colors">
                      {categoryName}
                    </h3>
                  </motion.div>
                );
              })}
            </motion.div>

            {hasMoreCategories && (
              <motion.div
                className="text-center mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/courses"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-lavender to-brand-coral text-white font-bold rounded-full hover:shadow-lg hover:shadow-brand-lavender/50 transition-all duration-300 group"
                >
                  <span>{t("categories.view_all") || "View All Categories"}</span>
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
