export type MeditationWorkshop = {
  id: string;
  title: string;
  date: string;
  time: string;
  timezone: string;
  location: string;
  registrationUrl: string;
  startDate: string;
  endDate: string;
  languages: string[];
  contribution: number;
  currency: "INR";
  sourceUrl: string;
  attendanceMode: "online";
};

export type MeditationGalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export const workshopSourceUrl = "https://www.artofliving.org/in-en/program/1067943";

// Year and timezone confirmed by Bharat; programme details from the official listing.
export const upcomingMeditationWorkshops: MeditationWorkshop[] = [{
  id: "aol-1067943",
  title: "Online Meditation and Breath Workshop",
  date: "9–12 November 2026",
  time: "6:30–8:30 PM daily",
  timezone: "IST (UTC+05:30)",
  location: "Online · join remotely",
  startDate: "2026-11-09T18:30:00+05:30",
  endDate: "2026-11-12T20:30:00+05:30",
  languages: ["English", "Hindi"],
  contribution: 3000,
  currency: "INR",
  attendanceMode: "online",
  sourceUrl: workshopSourceUrl,
  registrationUrl: "https://www.artofliving.online/registration.php?event_id=1067943&ct_id=684&greferrer=https%3A%2F%2Fwww.artofliving.org%2Fin-en%2Fprogram%2F1067943",
}];

export function getWorkshopStatus(workshop: MeditationWorkshop, now = Date.now()) {
  if (now >= Date.parse(workshop.endDate)) return "ended";
  if (now >= Date.parse(workshop.startDate)) return "in-progress";
  return "upcoming";
}

export const meditationProgrammes = [
  { name: "SKY Campus Happiness", url: "https://www.skycampushappiness.org/" },
  { name: "YES!+", url: "https://www.artofliving.org/in-en/yes-plus-program" },
  { name: "Online Meditation and Breath Workshop", url: "https://www.artofliving.org/in-en/online-meditation-breath-workshop" },
];

export const meditationFaqs = [
  {
    question: "Is the listed workshop online or in person?",
    answer: "The November workshop is listed as online. Gurugram appears on the organiser’s listing, but it is not an in-person venue for this workshop. Use the official registration page for joining instructions.",
  },
  {
    question: "What language is used, and how long are the sessions?",
    answer: "The official November listing specifies English and Hindi. The confirmed schedule is 9–12 November 2026, 6:30–8:30 PM IST (UTC+05:30) each day: four two-hour sessions. Check the organiser’s page for any changes before registering.",
  },
  {
    question: "Who is Bharat’s teaching focused on?",
    answer: "Bharat focuses on helping young adults aged 18–35 learn breathwork and meditation. That teaching focus is not an eligibility restriction for the listed workshop; ask the official programme team about age requirements and suitability.",
  },
  {
    question: "How do I register, and what is the contribution?",
    answer: "Use the official Art of Living registration link on the workshop card. The listing shows a ₹3,000 contribution and says contributions benefit social projects. Registration, payment, availability and applicable terms are managed by the organiser, not this website.",
  },
  {
    question: "What should I prepare, and do I need previous experience?",
    answer: "Confirm prerequisites and preparation with the official programme team before registering. For an online session, plan access to a reliable connection and a quiet space. Get the organiser’s instructions for attendance, equipment and joining details rather than assuming these are included.",
  },
  {
    question: "Is follow-up support included?",
    answer: "The official registration page advertises 45-day daily practice and free weekly sessions. Confirm the applicable format, access, duration and terms with the official programme team before registering. Follow-up is managed by the organiser, not this website.",
  },
  {
    question: "What if I have a health concern?",
    answer: "Ask the official programme team about suitability and any required adaptations, and consult a qualified healthcare professional about your own circumstances. This workshop is not a substitute for medical or mental-health care, and individual experiences vary.",
  },
];

// Add approved photographs and captions here when they are available.
export const meditationGallery: MeditationGalleryItem[] = [];
