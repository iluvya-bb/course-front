import i18n from "../../i18n";

const en = {
  1: {
    title: "Advanced React & Redux",
    category: "Development",
    instructor: "B. Batbayar",
  },
  2: {
    title: "UI/UX Design Fundamentals",
    category: "Design",
    instructor: "S. Saraa",
  },
  3: {
    title: "Digital Marketing Masterclass",
    category: "Marketing",
    instructor: "G. Ganzorig",
  },
  4: {
    title: "Introduction to Python",
    category: "Development",
    instructor: "B. Batbayar",
  },
  5: {
    title: "Figma for Beginners",
    category: "Design",
    instructor: "S. Saraa",
  },
  6: {
    title: "SEO & Content Strategy",
    category: "Marketing",
    instructor: "G. Ganzorig",
  },
};

const mn = {
  1: {
    title: "Advanced React & Redux",
    category: "Хөгжүүлэлт",
    instructor: "Б. Батбаяр",
  },
  2: {
    title: "UI/UX Дизайны үндэс",
    category: "Дизайн",
    instructor: "С. Сараа",
  },
  3: {
    title: "Дижитал маркетингийн мастер анги",
    category: "Маркетинг",
    instructor: "Г. Ганзориг",
  },
  4: {
    title: "Python-ы танилцуулга",
    category: "Хөгжүүлэлт",
    instructor: "Б. Батбаяр",
  },
  5: {
    title: "Figma-г эхлэн суралцагчдад зориулав",
    category: "Дизайн",
    instructor: "С. Сараа",
  },
  6: {
    title: "SEO & Контент стратеги",
    category: "Маркетинг",
    instructor: "Г. Ганзориг",
  },
};

i18n.addResourceBundle("en", "course", en);
i18n.addResourceBundle("mn", "course", mn);
