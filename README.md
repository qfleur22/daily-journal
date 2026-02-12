# Daily Journal

A React/Next.js app for daily check-ins with tracking for burnout, participation, wellness metrics, and routines.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Home**: Check in about your day with interactive fields (date, day, week, participation plan, burnout stage, sensory load, routine tier, window of tolerance, pain, fatigue, anxiety, depression, sleep, nightmares, ARFID/appetite, dizziness, transitions)
- **Right Now / Up Next** (current day only):
  - Before 9am: Morning routine, did you eat breakfast?, first group, transitions checklist
  - 9am–4pm: Current group, next group, transitions checklist
  - After 4pm: Add activity and add meal?, bed time routine
- **History**: List of previous days with overview; click to view or edit
- **Day detail**: View or edit a specific day with full form and schedule

## Data

Entries are stored in `localStorage` under the key `daily-journal-entries`.
