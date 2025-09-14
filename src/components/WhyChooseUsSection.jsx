import { motion } from "framer-motion";
import { Award, Users, Video } from "lucide-react";

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

const benefits = [
  {
    title: "Expert Instructors",
    description: "Learn from industry leaders and certified professionals.",
    icon: <Award className="w-10 h-10" />,
  },
  {
    title: "Flexible Learning",
    description: "Access courses anytime, anywhere, on any device.",
    icon: <Video className="w-10 h-10" />,
  },
  {
    title: "Community Support",
    description: "Join a vibrant community of learners and mentors.",
    icon: <Users className="w-10 h-10" />,
  },
];

const WhyChooseUsSection = () => {
  return (
    <section id="why-choose-us" className="py-24 bg-neutral">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text uppercase">Why Choose Us?</h2>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-base-100 p-8 rounded-md border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]"
              variants={fadeIn}
            >
              <div className="text-primary">{benefit.icon}</div>
              <h3 className="mt-4 text-2xl font-bold text">{benefit.title}</h3>
              <p className="mt-2 text">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
