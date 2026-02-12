export interface SelfCareCategory {
  id: string;
  name: string;
  items: string[];
}

export const SELF_CARE_CATEGORIES: SelfCareCategory[] = [
  {
    id: "comfort",
    name: "Comfort",
    items: [
      "My pillow",
      "Access to tea",
      "Headphones/loops available",
      "Squish or cow",
      "Safety check (step out, staff)",
    ],
  },
  {
    id: "routine",
    name: "Routine",
    items: [
      "Meds",
      "Big water + electrolytes",
      "Face wash and lotion",
      "Pimple patches",
      "Brush and floss",
      "PT",
    ],
  },
  {
    id: "sensory-environment",
    name: "Sensory & Environment",
    items: [
      "Advocate for temperature changes",
      "Find time to be alone",
      "No noise time (including fan)",
      "Fidget toy",
      "No-input break",
    ],
  },
  {
    id: "responsibility-offloading",
    name: "Responsibility offloading",
    items: ["Find help for Chloe", "Get house sorted"],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    items: [
      "Body scans or room scans",
      "Breathing exercises",
      "5-4-3-2-1",
      "Name the state and pick a skill",
      'Deep breath "safe enough now"',
    ],
  },
  {
    id: "food",
    name: "Food",
    items: [
      "Eat at least 2 meals",
      "Take vitamin powder + electrolytes",
      "Try at least 2 bites",
    ],
  },
  {
    id: "rest",
    name: "Rest",
    items: [
      "Check in with self consistently",
      "Screen limits",
      "Write goals/worries down for later",
      "Eyes closed audio",
      "Progressive release of body parts",
      "Unclench and rest tense parts",
    ],
  },
  {
    id: "spiritual",
    name: "Spiritual",
    items: [
      "Read books",
      "Make herbal remedies",
      "Find deity",
      "Values Check in (today is for…)",
      "Connect with nature",
      "Tea ritual",
      "'Prayer': May I be safe and rest",
    ],
  },
  {
    id: "therapy",
    name: "Therapy",
    items: [
      "Increase Sessions",
      "Do workbooks",
      "Journal and write",
      "Add to list",
      "Write a note of what I learned from group",
      "Practice DBT skills like STOP",
    ],
  },
  {
    id: "cognitive-rest",
    name: "Cognitive Rest",
    items: [
      "Worry container",
      "Thought stopping",
      "One-tab/task rule",
    ],
  },
  {
    id: "work",
    name: "Work",
    items: [
      "Ensure equity of story delivery",
      "Set alarms for meetings and online time",
    ],
  },
  {
    id: "social",
    name: "Social",
    items: [
      "Time with partners, friends, community",
      "Practice enforcing boundaries",
      "Parallel play",
    ],
  },
  {
    id: "physical-safety",
    name: "Physical Safety",
    items: [
      "Warm (tea/shower) or Cold",
      "Body scan and Micro-mobility",
      "Weighted blanket or plush",
      "Triage pain",
    ],
  },
  {
    id: "emotional",
    name: "Emotional",
    items: [
      "Name the emotion",
      "Write it out and contain it",
      "Self compassion",
      "Give self permission (to cry ++)",
    ],
  },
  {
    id: "creative",
    name: "Creative",
    items: [
      "Drag",
      "Write it out",
      "Coloring/Stoning/Doodling",
      "Give self permission",
    ],
  },
];
