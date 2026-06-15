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
  reward: {
    xp: number;
    title?: string;
  };
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
  type: 'armor' | 'strength' | 'engine' | 'arena';
  icon: string;
  exercises: ExerciseEntry[];
  xpReward: number;
  statRewards: Partial<CharacterStats>;
  completed: boolean;
  date: string;
  duration?: number;
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
}

export type TabId = 'profile' | 'missions' | 'workout' | 'strength' | 'dashboard' | 'coach' | 'quests' | 'achievements' | 'analytics';
