
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const CourseCard = ({ course, onSubscribe }) => {
  const { t } = useTranslation("course");
  return (
    <motion.div
      className="bg-neutral rounded-md overflow-hidden border-2 border-neutral shadow-[4px_4px_0px_#00F6FF] hover:shadow-none transform hover:-translate-y-1 transition-all duration-200 flex flex-col"
      layout
    >
      <Link to={`/course/${course.id}`} className="flex flex-col flex-grow">
        <div className="relative">
          <img src={course.imageUrl} alt={t(`${course.id}.title`)} className="w-full h-40 object-cover" />
          {course.subscribed && <div className="absolute top-2 right-2 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded">{t("dashboard.subscribed", { ns: "translation" })}</div>}
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <p className="text-sm font-bold text-primary uppercase">{t(`${course.id}.category`)}</p>
          <h3 className="mt-2 text-xl font-bold text-base-content">{t(`${course.id}.title`)}</h3>
          <p className="mt-1 text-base-content/80">{t("dashboard.by", { ns: "translation" })} {t(`${course.id}.instructor`)}</p>
          <div className="mt-4 flex-grow">
            {course.subscribed ? (
              <>
                <div className="w-full bg-base-100 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-right text-sm font-semibold text-base-content/80">{course.progress}% {t("dashboard.complete", { ns: "translation" })}</p>
                <Button className="w-full mt-4">View Course</Button>
              </>
            ) : (
              <div className="flex items-center justify-between mt-4">
                <p className="text-2xl font-bold text-primary">${course.price}</p>
                <Button onClick={(e) => { e.preventDefault(); onSubscribe(course); }}>{t("dashboard.subscribe", { ns: "translation" })}</Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
