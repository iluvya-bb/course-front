import { motion } from "framer-motion";
import {
  Code,
  Brush,
  Megaphone,
  Briefcase,
  BarChart2,
  Film,
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

const categories = [
  { name: "Development", icon: <Code className="w-10 h-10" /> },
  { name: "Design", icon: <Brush className="w-10 h-10" /> },
  { name: "Marketing", icon: <Megaphone className="w-10 h-10" /> },
  { name: "Business", icon: <Briefcase className="w-10 h-10" /> },
  { name: "Data Science", icon: <BarChart2 className="w-10 h-10" /> },
  { name: "Video & Animation", icon: <Film className="w-10 h-10" /> },
];

const CategoriesSection = () => {
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
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-neutral p-6 rounded-md text-center border-2 border-neutral shadow-[4px_4px_0px_#00F6FF] hover:shadow-none transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              variants={fadeIn}
            >
              <div className="text-primary inline-block">{category.icon}</div>
              <h3 className="mt-4 text-lg font-bold text">{category.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
