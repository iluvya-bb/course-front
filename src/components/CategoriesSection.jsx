import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
} from "lucide-react";

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
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const response = await API.getCategories();
        console.log("Categories response:", response.data);
        const categoriesData = response.data.data || [];
        console.log("Categories data:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        console.error("Error details:", error.response?.data);
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

  return (
    <section id="categories" className="py-24 bg-base-100">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text uppercase">
            Browse by Category
          </h2>
        </motion.div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category) => {
              const categoryName =
                typeof category.name === "object"
                  ? category.name[i18n.language] ||
                  category.name.en ||
                  category.name.mn
                  : category.name;

              return (
                <motion.div
                  key={category.id}
                  className="bg-neutral p-6 rounded-md text-center border-2 border-neutral shadow-[4px_4px_0px_#00F6FF] hover:shadow-none transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  variants={fadeIn}
                >
                  {category.imageUrl ? (
                    <img
                      src={`${API_URL}/${category.imageUrl}`}
                      alt={categoryName}
                      className="w-10 h-10 mx-auto object-contain"
                    />
                  ) : (
                    <div className="text-primary inline-block">
                      {iconMap[category.slug] || iconMap.education}
                    </div>
                  )}
                  <h3 className="mt-4 text-lg font-bold text">
                    {categoryName}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
