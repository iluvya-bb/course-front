export const mockCourse = {
  id: 1,
  title: "Web Development: From Scratch",
  description: "Master the fundamentals of HTML, CSS, and JavaScript to build your first website.",
  lessons: [
    {
      id: 1,
      title: "Introduction to HTML",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      exercises: [
        {
          id: 1,
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyperlink and Text Markup Language",
          ],
          answer: "Hyper Text Markup Language",
        },
        {
          id: 2,
          question: "What is the correct HTML element for the largest heading?",
          options: ["<h6>", "<h1>", "<head>", "<heading>"],
          answer: "<h1>",
        },
      ],
    },
    {
      id: 2,
      title: "Introduction to CSS",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      exercises: [
        {
          id: 1,
          question: "What does CSS stand for?",
          options: [
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Computer Style Sheets",
          ],
          answer: "Cascading Style Sheets",
        },
      ],
    },
    {
      id: 3,
      title: "Introduction to JavaScript",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      exercises: [],
    },
  ],
};
