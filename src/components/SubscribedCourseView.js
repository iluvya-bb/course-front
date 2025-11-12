import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import API, { API_URL } from "../services/api";
import Hls from "hls.js";
import {
	FaCheckCircle,
	FaSpinner,
	FaInfoCircle,
	FaCheck,
} from "react-icons/fa";

export const SubscribedCourseView = ({ course: initialCourse }) => {
	const { t } = useTranslation(["translation", "course", "course_page"]);

	// --- ALL THIS STATE IS MOVED FROM PARENT ---
	// Use the prop as the initial state, so we can update it locally
	const [course, setCourse] = useState(initialCourse);
	const [selectedLesson, setSelectedLesson] = useState(
		initialCourse.lessons && initialCourse.lessons.length > 0
			? initialCourse.lessons[0]
			: null,
	);
	const videoRef = useRef(null);
	const [videoType, setVideoType] = useState(null);
	const [videoSrc, setVideoSrc] = useState("");
	const [completingLesson, setCompletingLesson] = useState(false);
	const [completionSuccess, setCompletionSuccess] = useState(false);
	const [exerciseAnswers, setExerciseAnswers] = useState({});
	const [exerciseSubmissions, setExerciseSubmissions] = useState({});
	const [submittingExercise, setSubmittingExercise] = useState(null);
	// --- END MOVED STATE ---

	// --- All Video Player Logic is MOVED here ---
	useEffect(() => {
		if (!selectedLesson?.videoPath || !selectedLesson.id) {
			setVideoSrc("");
			setVideoType(null);
			return;
		}
		const fetchVideoInfo = async () => {
			// ... (Same logic as before)
		};
		fetchVideoInfo();
	}, [selectedLesson?.id]);

	useEffect(() => {
		// ... (Same HLS logic as before)
	}, [videoSrc, videoType]);

	// --- All Event Handlers are MOVED here ---
	const handleSelectLesson = (lesson) => {
		// ... (Same logic as before)
	};

	const handleExerciseAnswerChange = (exerciseId, value) => {
		// ... (Same logic as before)
	};

	const handleSubmitExercise = async (exerciseId) => {
		// ... (Same logic as before)
	};

	const handleMarkAsComplete = async () => {
		// ... (Same logic as before)
		// This function now updates its OWN 'course' state
		// setCourse(prevCourse => { ... })
	};

	return (
		// --- PASTE YOUR ENTIRE "SUBSCRIBED VIEW" JSX HERE ---
		<div className="flex flex-1 h-full max-h-[calc(100vh-theme(space.24))]">
			<aside className="w-full md:w-1/3 lg:w-1/4 bg-neutral p-4 md:p-6 border-r-2 border-neutral flex-shrink-0 overflow-y-auto">
				{/* ... sidebar title ... */}
				{/* ... progress bar (uses local 'course' state) ... */}
				{/* ... lesson list (uses local 'course' state) ... */}
			</aside>
			<main className="flex-1 p-4 md:p-8 overflow-y-auto">
				{selectedLesson
					? <motion.div /* ... */>
							{/* ... lesson title ... */}
							{/* ... mark as complete button ... */}
							{/* ... video player ... */}

							{/* Example of exercise input */}
							{selectedLesson.exercises && selectedLesson.exercises.length > 0
								? <ul className="space-y-4">
										{selectedLesson.exercises.map((exercise, index) => (
											<li key={exercise.id} /* ... */>
												{/* ... exercise question ... */}
												{!exerciseSubmissions[exercise.id]
													? <div className="space-y-3">
															<Input
																type="text"
																value={exerciseAnswers[exercise.id] || ""}
																onChange={(e) =>
																	handleExerciseAnswerChange(
																		exercise.id,
																		e.target.value,
																	)
																}
																// ... etc
															/>
															{/* ... submit button ... */}
														</div>
													: {
															/* ... submission result ... */
														}}
											</li>
										))}
									</ul>
								: <p /* ... */>{t("course_page.no_exercises")}</p>}
						</motion.div>
					: <div className="text-center p-10">
							<p className="text-base-content/70">
								{t("select_lesson", { ns: "course_page" })}
							</p>
						</div>}
			</main>
		</div>
	);
};
