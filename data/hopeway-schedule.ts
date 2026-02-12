export interface ScheduleOption {
  name: string;
  location: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  options: ScheduleOption[];
  isBreak?: boolean;
}

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const HOPEWAY_SCHEDULE: Record<DayKey, ScheduleItem[]> = {
  monday: [
    { id: "m1", time: "9:00 AM", options: [{ name: "Horticulture", location: "Greenhouse" }] },
    { id: "m2", time: "10:00 AM", options: [{ name: "Understanding Trauma", location: "Room #206" }, { name: "Yoga", location: "MPR" }] },
    { id: "m3", time: "11:00 AM", options: [{ name: "Relapse Prevention", location: "Room #205" }] },
    { id: "m4", time: "12:00–1:00 PM", options: [{ name: "Lunch", location: "" }], isBreak: true },
    { id: "m5", time: "1:00 PM", options: [{ name: "Rec Therapy", location: "Room #206" }] },
    { id: "m6", time: "2:15–2:30 PM", options: [{ name: "Coffee Break", location: "" }], isBreak: true },
    { id: "m7", time: "2:30 PM", options: [{ name: "Healthy Relationships", location: "Room #205" }] },
    { id: "m8", time: "4:00 PM", options: [{ name: "Depart", location: "" }] },
  ],
  tuesday: [
    { id: "t1", time: "9:00 AM", options: [{ name: "CBT", location: "Room #205" }] },
    { id: "t2", time: "10:00 AM", options: [{ name: "Parents & Caregivers Group", location: "Room #206" }, { name: "Sound Bath", location: "MPR" }] },
    { id: "t3", time: "11:00 AM", options: [{ name: "Neurodiversity", location: "Room #206" }, { name: "Therapeutic Drumming", location: "Gym" }] },
    { id: "t4", time: "12:00–1:00 PM", options: [{ name: "Lunch", location: "" }], isBreak: true },
    { id: "t5", time: "1:00 PM", options: [{ name: "Grief & Loss", location: "Room #106" }, { name: "Enrichment", location: "Room #205" }] },
    { id: "t6", time: "2:15–2:30 PM", options: [{ name: "Coffee Break", location: "" }], isBreak: true },
    { id: "t7", time: "2:30 PM", options: [{ name: "Music Therapy", location: "Music Room – Gym" }] },
    { id: "t8", time: "4:00 PM", options: [{ name: "Depart", location: "" }] },
  ],
  wednesday: [
    { id: "w1", time: "9:00 AM", options: [{ name: "Art Therapy", location: "Room #201" }] },
    { id: "w2", time: "10:00 AM", options: [{ name: "Pet Therapy", location: "Room #106" }, { name: "Meditation", location: "MPR" }] },
    { id: "w3", time: "11:00 AM", options: [{ name: "Process", location: "Room #205" }] },
    { id: "w4", time: "12:00–1:00 PM", options: [{ name: "Lunch", location: "" }], isBreak: true },
    { id: "w5", time: "1:00 PM", options: [{ name: "Rec Therapy", location: "Room #106" }] },
    { id: "w6", time: "2:15–2:30 PM", options: [{ name: "Coffee Break", location: "" }], isBreak: true },
    { id: "w7", time: "2:30 PM", options: [{ name: "DBT Emotional Regulation & Distress Tolerance", location: "Room #205" }] },
    { id: "w8", time: "4:00 PM", options: [{ name: "Depart", location: "" }] },
  ],
  thursday: [
    { id: "r1", time: "9:00 AM", options: [{ name: "DBT Mindfulness & Self-Awareness", location: "Room #106" }] },
    { id: "r2", time: "10:00 AM", options: [{ name: "Gender & Identity", location: "Room #201" }, { name: "Spirituality", location: "Room #205" }] },
    { id: "r3", time: "11:00 AM", options: [{ name: "Drama Therapy", location: "MPR" }] },
    { id: "r4", time: "12:00–1:00 PM", options: [{ name: "Lunch", location: "" }], isBreak: true },
    { id: "r5", time: "1:00 PM", options: [{ name: "Addictive Behaviors", location: "Room #206" }, { name: "Expressive Writing", location: "Room #205" }] },
    { id: "r6", time: "2:15–2:30 PM", options: [{ name: "Coffee Break", location: "" }], isBreak: true },
    { id: "r7", time: "2:30 PM", options: [{ name: "Nutritional Wellness", location: "Room #208" }] },
    { id: "r8", time: "4:00 PM", options: [{ name: "Depart", location: "" }] },
  ],
  friday: [
    { id: "f1", time: "9:00 AM", options: [{ name: "Music Therapy", location: "Music Room – Gym" }] },
    { id: "f2", time: "10:00 AM", options: [{ name: "Skills Review", location: "Cafeteria" }] },
    { id: "f3", time: "11:00 AM", options: [{ name: "Open Mic", location: "MPR" }, { name: "Therapeutic Crafting", location: "Room #202" }] },
    { id: "f4", time: "12:00–1:00 PM", options: [{ name: "Lunch", location: "" }], isBreak: true },
    { id: "f5", time: "1:00 PM", options: [{ name: "Process", location: "Room #205" }, { name: "Veterans & First Responders Support Group", location: "Room #201" }] },
    { id: "f6", time: "2:15–2:30 PM", options: [{ name: "Coffee Break", location: "" }], isBreak: true },
    { id: "f7", time: "2:30 PM", options: [{ name: "Embodied Dance & Wellness", location: "Gym" }] },
    { id: "f8", time: "4:00 PM", options: [{ name: "Depart", location: "" }] },
  ],
  saturday: [],
  sunday: [],
};
