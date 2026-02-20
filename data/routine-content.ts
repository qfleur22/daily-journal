export type RoutineTier = 0 | 1 | 2;

export interface RoutineItem {
  id: string;
  label: string;
  category?: string;
}

export const MORNING_ROUTINE_ITEMS: Record<RoutineTier, RoutineItem[]> = {
  0: [
    { id: "m0-1", label: "Meds", category: "Body" },
    { id: "m0-2", label: "Big water (+ electrolytes if dizzy/headachy)", category: "Body" },
    { id: "m0-3", label: "Eat something (two bites or ramen counts)", category: "Body" },
    { id: "m0-4", label: "Face wipe/face wash + lotion or teeth", category: "Hygiene" },
    { id: "m0-5", label: "Pimple patch if it helps", category: "Hygiene" },
    { id: "m0-6", label: "Tea", category: "Comfort + Sensory" },
    { id: "m0-7", label: "Clean clothes OR change into safe outfit", category: "Comfort + Sensory" },
    { id: "m0-8", label: "Pillow + lay down w/ heating pad", category: "Comfort + Sensory" },
    { id: "m0-9", label: "Headphones/loops available", category: "Comfort + Sensory" },
    { id: "m0-10", label: "Squish / weighted pressure", category: "Comfort + Sensory" },
    { id: "m0-11", label: "60 seconds: body scan OR 5-4-3-2-1 grounding OR 4 slow exhales", category: "Mindfulness" },
  ],
  1: [
    { id: "m1-1", label: "Meds + water/electrolytes", category: "Body" },
    { id: "m1-2", label: "At least one whole meal", category: "Body" },
    { id: "m1-3", label: "Face wash + lotion", category: "Hygiene" },
    { id: "m1-4", label: "Brush + floss (or floss picks)", category: "Hygiene" },
    { id: "m1-5", label: "5–10 min PT OR 5 min gentle mobility", category: "PT / Health" },
    { id: "m1-6", label: "Track pain/overwhelm stage (green/yellow/red/black)", category: "PT / Health" },
    { id: "m1-7", label: "One admin block (20–40 min) OR people block OR house block", category: "Responsibility" },
    { id: "m1-8", label: "One intentional rest period (not doomscrolling)", category: "Rest" },
  ],
  2: [
    { id: "m2-1", label: "Meds + water/electrolytes", category: "Body" },
    { id: "m2-2", label: "At least one whole meal", category: "Body" },
    { id: "m2-3", label: "Face wash + lotion", category: "Hygiene" },
    { id: "m2-4", label: "Brush + floss (or floss picks)", category: "Hygiene" },
    { id: "m2-5", label: "15–25 min PT/movement + shower/bath if helpful", category: "PT / Health" },
    { id: "m2-6", label: "Social: partners OR friend OR community (time-boxed)", category: "Social" },
    { id: "m2-7", label: "Dedicated rest time", category: "Rest" },
    { id: "m2-8", label: "Body Safety: pain support + sensory protection + rest", category: "Daily Anchors" },
    { id: "m2-9", label: "Nervous System: one skill rep (orienting/breathing/TIP/grounding/containment)", category: "Daily Anchors" },
    { id: "m2-10", label: "Nutrition/Hydration: water + electrolytes + food + protein & salt", category: "Daily Anchors" },
  ],
};

export const BEDTIME_ROUTINE_ITEMS: Record<RoutineTier, RoutineItem[]> = {
  0: [
    { id: "b0-bare-1", label: "Take meds", category: "Bare minimum" },
    { id: "b0-bare-2", label: "Let Chloe out", category: "Bare minimum" },
    { id: "b0-1", label: "Screens tapering: phone on charger OR grayscale OR app timer", category: "60–90 min before" },
    { id: "b0-2", label: "Lower lights", category: "Environment" },
    { id: "b0-3", label: "Wash face + lotion OR bath/shower", category: "Body + comfort" },
    { id: "b0-4", label: "Teeth (brush/floss)", category: "Body + comfort" },
    { id: "b0-5", label: "Set pillow/nest, weighted blanket, squish", category: "Body + comfort" },
    { id: "b0-6", label: "Write 1–3 tiny goals for tomorrow", category: "Close loops" },
    { id: "b0-7", label: "Downshift: body scan OR 4 exhales OR grounding OR kind sentence", category: "In bed" },
  ],
  1: [
    { id: "b1-bare-1", label: "Take meds", category: "Bare minimum" },
    { id: "b1-bare-2", label: "Let Chloe out", category: "Bare minimum" },
    { id: "b1-1", label: "Screens tapering: phone on charger OR grayscale OR app timer", category: "60–90 min before" },
    { id: "b1-2", label: "Work on consent workbook", category: "60–90 min before" },
    { id: "b1-3", label: "Work on self-compassion workbook", category: "60–90 min before" },
    { id: "b1-4", label: "Lower lights", category: "Environment" },
    { id: "b1-5", label: "Temperature adjustment", category: "Environment" },
    { id: "b1-6", label: "Bath/hot shower OR wash face + lotion", category: "Body + comfort" },
    { id: "b1-7", label: "Teeth (brush/floss)", category: "Body + comfort" },
    { id: "b1-8", label: "Pimple patch if needed", category: "Body + comfort" },
    { id: "b1-9", label: "Set pillow/nest, weighted blanket, squish", category: "Body + comfort" },
    { id: "b1-10", label: "Write goals for tomorrow (1–3 items max)", category: "Close loops" },
    { id: "b1-11", label: "Write worries down (container + revisit time)", category: "Close loops" },
    { id: "b1-12", label: "Downshift: body scan OR 4 exhales OR grounding OR kind sentence", category: "In bed" },
  ],
  2: [
    { id: "b2-bare-1", label: "Take meds", category: "Bare minimum" },
    { id: "b2-bare-2", label: "Let Chloe out", category: "Bare minimum" },
    { id: "b2-1", label: "Screens tapering: phone on charger OR grayscale OR app timer", category: "60–90 min before" },
    { id: "b2-2", label: "Comfort TV only if screens needed (no scrolling)", category: "60–90 min before" },
    { id: "b2-3", label: "Work on consent workbook", category: "60–90 min before" },
    { id: "b2-4", label: "Work on self-compassion workbook", category: "60–90 min before" },
    { id: "b2-5", label: "Journal or write", category: "60–90 min before" },
    { id: "b2-6", label: "Lower lights", category: "Environment" },
    { id: "b2-7", label: "Temperature adjustment (ask/advocate now)", category: "Environment" },
    { id: "b2-8", label: "No noise time if that helps", category: "Environment" },
    { id: "b2-9", label: "Bath/hot shower OR wash face + lotion", category: "Body + comfort" },
    { id: "b2-10", label: "Wash face", category: "Body + comfort" },
    { id: "b2-11", label: "Use lotion and minoxidil", category: "Body + comfort" },
    { id: "b2-12", label: "Teeth (brush/floss)", category: "Body + comfort" },
    { id: "b2-13", label: "Pimple patch if needed", category: "Body + comfort" },
    { id: "b2-14", label: "Set pillow/nest, weighted blanket, squish", category: "Body + comfort" },
    { id: "b2-15", label: "Write goals for tomorrow (1–3 items max)", category: "Close loops" },
    { id: "b2-16", label: "Write worries down (worry list + revisit time)", category: "Close loops" },
    { id: "b2-17", label: "If urgent: write next action, not whole problem", category: "Close loops" },
    { id: "b2-18", label: "Follow guided meditation", category: "Close loops" },
    { id: "b2-19", label: "Downshift: body scan OR 4 exhales OR grounding OR kind sentence", category: "In bed" },
  ],
};
