# 🏋️ Prixi — Your Personal Fitness RPG

> **Level up your workouts.** Prixi turns your gym journey into an RPG — with daily workout plans, strength benchmarks, progression tracking, and AI coaching.

[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

### 📋 Daily Workout Plan
Automatically generated PPL split (Push/Pull/Legs) with 6 rotating days:
- **Day 1:** Chest & Triceps
- **Day 2:** Back & Biceps  
- **Day 3:** Legs & Shoulders
- **Day 4:** Chest & Arms (Focus)
- **Day 5:** Back & Rear Delts
- **Day 6:** Legs & Abs

Prioritizes your **focus areas** — chest, arms, and neck get extra volume.

### 📊 Strength Benchmarks
Standards calculated from your **body weight** and **experience level**:
- See where you rank: Beginner → Intermediate → Advanced
- Know exactly when to increase weight (double progression)
- Track estimated 1RM for all major lifts

### 🎯 Smart Progression
- **Rate your workout** (Easy / Medium / Hard) after each session
- Weights auto-adjust based on your rating and rep performance
- Hit target reps → increase weight. Simple.

### 🎮 RPG Progression
- **Level up** by completing workouts
- Assign **stat points** to Power, Physique, Endurance, Discipline
- Unlock **achievements** and complete **quests**
- Track your XP and next level

### 📈 Progress Dashboard
- Body weight trend chart
- Weekly volume tracking
- Recovery scores
- Strength growth visualization

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production
npm run preview
```

## 🎮 How It Works

### First Time Setup
1. Open the app → you'll see the **onboarding wizard**
2. Enter your **name, height, weight, age**
3. Choose your **goal** (Muscle Growth / Strength / Body Recomp / Endurance)
4. Select **focus areas** (chest, arms, neck, etc.)
5. Set your **experience level** (calibrates starting weights)

### Daily Training
1. Go to **Missions** tab → see your weekly plan
2. Today's workout is highlighted with 🔥
3. Tap **Go** → start your workout
4. Check off sets as you complete them
5. Tap **Complete Workout** → rate it Easy/Medium/Hard

### Progression
Your weights automatically progress based on:
- **Rep target** (e.g., 8-12 reps) — hit the upper end → increase weight
- **Difficulty rating** — "Easy" means faster progression, "Hard" means maintain
- **Strength standards** — benchmarks based on your body weight

### Tracking
- **Profile tab** — see your level, stats, and body metrics
- **Benchmarks tab** — track all your lifts against standards
- **Dashboard** — charts for weight, volume, recovery, strength

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript 6** | Type safety |
| **Vite 8** | Build tool |
| **Tailwind CSS 4** | Styling |
| **Framer Motion 12** | Animations |
| **Recharts 3** | Charts & graphs |
| **Zustand 5** | State management |
| **Lucide React** | Icons |

## 📁 Project Structure

```
src/
├── components/
│   ├── onboarding/    # Setup wizard (first-run)
│   ├── profile/       # Character sheet & stats
│   ├── missions/      # Daily workout plan
│   ├── workout/       # Active workout session
│   ├── strength/      # Benchmarks & standards
│   ├── dashboard/     # Progress charts
│   ├── coach/         # AI advice
│   ├── quests/        # Quest system
│   ├── achievements/  # Achievement tracking
│   ├── analytics/     # Weekly reports
│   ├── ui/            # Reusable primitives
│   └── layout/        # App shell & navigation
├── stores/            # Zustand stores (game, workout, user, progress)
├── types/             # TypeScript interfaces
├── data/              # Workout templates & strength standards
└── utils/             # Progression logic & formatters
```

## 📱 Mobile-First

Designed for mobile use with:
- Bottom tab navigation
- Touch-friendly buttons and inputs
- PWA manifest (installable on home screen)
- Dark mode optimized

---

## 📄 License

MIT
