import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const mockCourse = {
  title: "Introduction to Web Development",
  lessons: [
    {
      id: 1,
      title: "HTML Basics",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      exercises: [
        {
          id: 1,
          question: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language"],
        },
      ],
    },
    {
      id: 2,
      title: "CSS Fundamentals",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      exercises: [
        {
          id: 1,
          question: "What does CSS stand for?",
          options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets"],
        },
      ],
    },
  ],
};

const CoursePage = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = () => {
      try {
        // Simulate API call
        setCourse(mockCourse);
        setLessons(mockCourse.lessons);
        if (mockCourse.lessons.length > 0) {
          setSelectedLesson(mockCourse.lessons[0]);
          setExercises(mockCourse.lessons[0].exercises);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setExercises(lesson.exercises);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-base-100 text-base-content">
      <nav className="bg-base-100/80 backdrop-blur-md border-b-2 border-neutral fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo.svg"
                alt={t("dashboard.logo_alt")}
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold text-base-content ml-2">
                {t("dashboard.heading")}
              </h1>
            </Link>
          </div>
          <div className="flex items-center">
            
          </div>
        </div>
      </nav>
      <div className="flex flex-1 pt-20">
        <aside className="w-1/4 bg-neutral p-6 border-r-2 border-neutral">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            {course.title}
          </h2>
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedLesson.id === lesson.id
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-300"
                  }`}>
                  {lesson.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-8">
          {selectedLesson && (
            <motion.div
              key={selectedLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-base-content mb-4">
                {selectedLesson.title}
              </h1>
              <div className="aspect-video mb-8">
                <iframe
                  className="w-full h-full rounded-lg border-2 border-neutral shadow-[8px_8px_0px_#00F6FF]"
                  src={selectedLesson.videoUrl}
                  title={selectedLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-base-content mb-4">
                  {t("course_page.exercises")}
                </h2>
                {exercises.length > 0 ? (
                  <ul className="space-y-4">
                    {exercises.map((exercise) => (
                      <li key={exercise.id} className="bg-neutral p-6 rounded-lg border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
                        <p className="font-semibold text-lg mb-2">{exercise.question}</p>
                        <div className="flex flex-col space-y-2">
                          {exercise.options.map((option, index) => (
                            <label key={index} className="flex items-center">
                              <input type="radio" name={`exercise-${exercise.id}`} className="radio radio-primary mr-2" />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("course_page.no_exercises")}</p>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
