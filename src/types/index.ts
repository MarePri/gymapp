// ─── User Profile ───────────────────────────────────────────
export interface UserProfile {
  name: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female' | 'other';
  experience: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[]; // e.g. ['chest', 'arms', 'neck', 'back', 'legs', 'shoulders']
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'recomposition';
  onboarded: boolean;
}

export interface StrengthStandards {
  exercise: string;
  current: number; // current working weight in kg
  target1RM: number; // estimated 1RM
  beginner: number; // standard for beginner
  intermediate: number; // standard for intermediate
  advanced: number; // standard for advanced
  nextMilestone: number; // next weight to aim for
  progression: 'ready' | '2_sessions' | '4_sessions' | 'plateau';
}

// ─── Workout Plans ─────────────────────────────────────────
export interface WorkoutDay {
  id: string;
  dayNumber: number;
  name: string; // e.g. "Chest & Triceps"
  focus: string[];
  exercises: ExerciseEntry[];
  completed: boolean;
  date: string | null;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  days: WorkoutDay[];
  currentDay: number; // which day they're on (rotates)
  startDate: string;
  split: 'ppl' | 'upper_lower' | 'full_body';
}

// ─── Rating System ──────────────────────────────────────────
export type DifficultyRating = 'easy' | 'medium' | 'hard';

export interface WorkoutFeedback {
  sessionId: string;
  rating: DifficultyRating;
  notes?: string;
  adjustedWeights?: Record<string, number>; // exercise -> new weight
}

// ─── Progression ────────────────────────────────────────────
export interface ProgressionRule {
  exercise: string;
  currentWeight: number;
  currentReps: number;
  targetReps: number; // e.g. 8-12 range, target is 12
  sets: number;
  increment: number; // e.g. 2.5kg
  lastRating?: DifficultyRating;
}

// ─── Existing types (extended) ──────────────────────────────
export interface CharacterStats {
  power: number;
  physique: number;
  endurance: number;
  discipline: number;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  stats: CharacterStats;
  statPoints: number;
  joinDate: string;
  title: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'strength' | 'weight' | 'volume' | 'consistency' | 'pr';
  objective: string;
  progress: number;
  target: number;
  reward: { xp: number; title?: string };
  completed: boolean;
  deadline?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  icon: string;
}

export interface SetEntry {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface ExerciseEntry {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: SetEntry[];
  notes?: string;
}

export interface WorkoutMission {
  id: string;
  name: string;
  description: string;
  type: 'armor' | 'strength' | 'engine' | 'arena' | 'daily';
  icon: string;
  exercises: ExerciseEntry[];
  xpReward: number;
  statRewards: Partial<CharacterStats>;
  completed: boolean;
  date: string;
  duration?: number;
  dayNumber?: number;
}

export interface StrengthRecord {
  exercise: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
  isPR: boolean;
}

export interface ProgressEntry {
  date: string;
  bodyWeight?: number;
  strengthRecords: StrengthRecord[];
  weeklyVolume: number;
  recovery: number;
}

export interface AIAdvice {
  exercise: string;
  suggestedWeight: number;
  suggestedReps: number;
  successProbability: number;
  reasoning: string;
  plateauDetected: boolean;
  nextMilestone: string;
}

export interface WeeklyReport {
  weekOf: string;
  totalWorkouts: number;
  totalVolume: number;
  xpGained: number;
  prsSet: number;
  muscleBalance: { group: string; percentage: number }[];
  strengthGrowth: { exercise: string; start: number; end: number }[];
  notes: string;
}

export interface WorkoutSession {
  id: string;
  missionId: string;
  missionName: string;
  missionType: WorkoutMission['type'];
  startTime: string;
  endTime?: string;
  exercises: ExerciseEntry[];
  completed: boolean;
  xpEarned: number;
  rating?: DifficultyRating;
  dayNumber?: number;
}

export type TabId = 'profile' | 'missions' | 'workout' | 'strength' | 'dashboard' | 'coach' | 'quests' | 'achievements' | 'analytics';
