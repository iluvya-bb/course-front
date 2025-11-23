import { motion } from "framer-motion";
import { Award, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      staggerChildren: 0.2,
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

const WhyChooseUsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t("why_choose_us.expert_instructors_title"),
      description: t("why_choose_us.expert_instructors_desc"),
      icon: <Award className="w-10 h-10" />,
    },
    {
      title: t("why_choose_us.flexible_learning_title"),
      description: t("why_choose_us.flexible_learning_desc"),
      icon: <Video className="w-10 h-10" />,
    },
    {
      title: t("why_choose_us.community_support_title"),
      description: t("why_choose_us.community_support_desc"),
      icon: <Users className="w-10 h-10" />,
    },
  ];
  return (
    <section id="why-choose-us" className="py-24 bg-gradient-to-b from-brand-cream/30 to-base-100 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 left-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-72 h-72 bg-brand-lavender/10 rounded-full blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
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
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-yellow via-brand-lime to-brand-lavender bg-clip-text text-transparent uppercase">
            {t("why_choose_us.title")}
          </h2>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => {
            const cardColors = [
              "from-brand-lavender/10 to-brand-coral/10 border-brand-lavender/30 hover:shadow-brand-lavender/30",
              "from-brand-coral/10 to-brand-yellow/10 border-brand-coral/30 hover:shadow-brand-coral/30",
              "from-brand-yellow/10 to-brand-lime/10 border-brand-yellow/30 hover:shadow-brand-yellow/30",
            ];
            const iconGradients = [
              "from-brand-lavender to-brand-coral",
              "from-brand-coral to-brand-yellow",
              "from-brand-yellow to-brand-lime",
            ];
            const cardColor = cardColors[index];
            const iconGradient = iconGradients[index];

            return (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${cardColor} p-8 rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all duration-500 group`}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <motion.div
                  className={`bg-gradient-to-br ${iconGradient} text-white p-4 rounded-full inline-block`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="mt-6 text-2xl font-bold text-base-content group-hover:text-brand-lavender transition-colors">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-base-content/80 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
