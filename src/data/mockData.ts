import type { Character, Achievement, Quest, Exercise, WorkoutMission, StrengthRecord, ProgressEntry, AIAdvice, WeeklyReport } from '../types';

export const DEFAULT_CHARACTER: Character = {
  name: 'Prixi',
  level: 12,
  xp: 2450,
  xpToNext: 3200,
  stats: { power: 28, physique: 22, endurance: 19, discipline: 25 },
  statPoints: 3,
  joinDate: '2025-11-01',
  title: 'Iron Apprentice',
};

export const EXERCISES: Exercise[] = [
  { id: 'bench', name: 'Bench Press', muscleGroup: 'Chest', icon: 'dumbbell' },
  { id: 'squat', name: 'Squat', muscleGroup: 'Legs', icon: 'dumbbell' },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', icon: 'dumbbell' },
  { id: 'ohp', name: 'Overhead Press', muscleGroup: 'Shoulders', icon: 'dumbbell' },
  { id: 'row', name: 'Barbell Row', muscleGroup: 'Back', icon: 'dumbbell' },
  { id: 'pullup', name: 'Pull-ups', muscleGroup: 'Back', icon: 'dumbbell' },
  { id: 'curl', name: 'Barbell Curl', muscleGroup: 'Biceps', icon: 'dumbbell' },
  { id: 'tri', name: 'Tricep Pushdown', muscleGroup: 'Triceps', icon: 'dumbbell' },
  { id: 'sldl', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', icon: 'dumbbell' },
  { id: 'legpress', name: 'Leg Press', muscleGroup: 'Legs', icon: 'dumbbell' },
];

export const MOCK_WORKOUTS: WorkoutMission[] = [
  {
    id: 'w1',
    name: 'Build The Armor',
    description: 'Chest & Triceps — sculpt the upper body armor',
    type: 'armor',
    icon: 'shield',
    xpReward: 450,
    statRewards: { physique: 3, power: 1 },
    completed: false,
    date: new Date().toISOString(),
    exercises: [
      {
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        muscleGroup: 'Chest',
        sets: Array.from({ length: 4 }, (_, i) => ({
          id: `bench-s${i}`,
          weight: 85,
          reps: 8,
          completed: false,
          rpe: i < 2 ? 7 : 8,
        })),
      },
      {
        exerciseId: 'ohp',
        exerciseName: 'Overhead Press',
        muscleGroup: 'Shoulders',
        sets: Array.from({ length: 3 }, (_, i) => ({
          id: `ohp-s${i}`,
          weight: 50,
          reps: 10,
          completed: false,
        })),
      },
    ],
  },
  {
    id: 'w2',
    name: 'Forge Strength',
    description: 'Back & Biceps — build a foundation of raw power',
    type: 'strength',
    icon: 'zap',
    xpReward: 500,
    statRewards: { power: 3, endurance: 1 },
    completed: false,
    date: new Date().toISOString(),
    exercises: [
      {
        exerciseId: 'deadlift',
        exerciseName: 'Deadlift',
        muscleGroup: 'Back',
        sets: Array.from({ length: 5 }, (_, i) => ({
          id: `dl-s${i}`,
          weight: 140,
          reps: 5,
          completed: false,
          rpe: i > 2 ? 9 : 7,
        })),
      },
      {
        exerciseId: 'row',
        exerciseName: 'Barbell Row',
        muscleGroup: 'Back',
        sets: Array.from({ length: 4 }, (_, i) => ({
          id: `row-s${i}`,
          weight: 70,
          reps: 10,
          completed: false,
        })),
      },
    ],
  },
  {
    id: 'w3',
    name: 'Engine Upgrade',
    description: 'Legs & Core — level up your cardio engine',
    type: 'engine',
    icon: 'flame',
    xpReward: 400,
    statRewards: { endurance: 3, discipline: 1 },
    completed: false,
    date: new Date().toISOString(),
    exercises: [
      {
        exerciseId: 'squat',
        exerciseName: 'Squat',
        muscleGroup: 'Legs',
        sets: Array.from({ length: 5 }, (_, i) => ({
          id: `sq-s${i}`,
          weight: 100,
          reps: 8,
          completed: false,
          rpe: i > 2 ? 8.5 : 7,
        })),
      },
    ],
  },
  {
    id: 'w4',
    name: 'Arena Session',
    description: 'Full body — test your limits in the arena',
    type: 'arena',
    icon: 'trophy',
    xpReward: 600,
    statRewards: { power: 2, physique: 2, endurance: 2 },
    completed: true,
    date: new Date(Date.now() - 86400000).toISOString(),
    exercises: [
      {
        exerciseId: 'deadlift',
        exerciseName: 'Deadlift',
        muscleGroup: 'Back',
        sets: Array.from({ length: 3 }, (_, i) => ({
          id: `arena-dl-s${i}`,
          weight: 145,
          reps: 3,
          completed: true,
          rpe: 9,
        })),
      },
      {
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        muscleGroup: 'Chest',
        sets: Array.from({ length: 3 }, (_, i) => ({
          id: `arena-b-s${i}`,
          weight: 90,
          reps: 5,
          completed: true,
          rpe: 8,
        })),
      },
    ],
  },
];

export const MOCK_STRENGTH_RECORDS: StrengthRecord[] = [
  { exercise: 'Bench Press', weight: 100, reps: 1, estimated1RM: 103, date: '2026-06-10', isPR: true },
  { exercise: 'Squat', weight: 130, reps: 1, estimated1RM: 134, date: '2026-06-08', isPR: true },
  { exercise: 'Deadlift', weight: 160, reps: 1, estimated1RM: 165, date: '2026-06-05', isPR: true },
  { exercise: 'Overhead Press', weight: 60, reps: 1, estimated1RM: 62, date: '2026-06-12', isPR: true },
  { exercise: 'Bench Press', weight: 95, reps: 3, estimated1RM: 102, date: '2026-05-28', isPR: false },
  { exercise: 'Squat', weight: 125, reps: 3, estimated1RM: 134, date: '2026-05-25', isPR: false },
];

export const MOCK_PROGRESS: ProgressEntry[] = Array.from({ length: 12 }, (_, i) => ({
  date: new Date(2026, 2 + i, 15).toISOString().split('T')[0],
  bodyWeight: 78 + i * 0.3,
  strengthRecords: [
    { exercise: 'Bench Press', weight: 80 + i * 2, reps: 5, estimated1RM: 88 + i * 2.2, date: '', isPR: i % 2 === 0 },
    { exercise: 'Squat', weight: 100 + i * 3, reps: 5, estimated1RM: 113 + i * 2.8, date: '', isPR: i % 2 === 0 },
  ],
  weeklyVolume: 8000 + i * 400,
  recovery: 7 + Math.random() * 2,
}));

export const MOCK_AI_ADVICE: AIAdvice[] = [
  {
    exercise: 'Bench Press',
    suggestedWeight: 87.5,
    suggestedReps: 6,
    successProbability: 82,
    reasoning: 'Your last 3 sessions show consistent reps at 85kg. Progressive overload suggests 87.5kg for 6 reps is achievable with 82% confidence.',
    plateauDetected: false,
    nextMilestone: '100kg Bench — 3 sessions away',
  },
  {
    exercise: 'Squat',
    suggestedWeight: 105,
    suggestedReps: 6,
    successProbability: 75,
    reasoning: 'Squat progression has slowed. Consider adding 2.5kg and reducing reps slightly to maintain form under load.',
    plateauDetected: true,
    nextMilestone: '120kg Squat — 5 sessions away',
  },
  {
    exercise: 'Deadlift',
    suggestedWeight: 150,
    suggestedReps: 3,
    successProbability: 68,
    reasoning: 'Heavy deadlifts showing form breakdown above 145kg. Recommend 3 heavy triples at 150kg with 3min rest.',
    plateauDetected: false,
    nextMilestone: '160kg Deadlift — 4 sessions away',
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', name: 'First Blood', description: 'Complete your first workout', icon: 'droplet', unlocked: true, unlockedAt: '2025-11-01', rarity: 'common' },
  { id: 'ach2', name: 'Pole Position', description: 'Set a personal record', icon: 'flag', unlocked: true, unlockedAt: '2025-11-15', rarity: 'rare' },
  { id: 'ach3', name: 'The Game', description: 'Reach level 10', icon: 'gamepad', unlocked: true, unlockedAt: '2026-01-20', rarity: 'epic' },
  { id: 'ach4', name: 'Arena Champion', description: 'Complete 10 Arena Sessions', icon: 'trophy', unlocked: true, unlockedAt: '2026-03-10', rarity: 'epic' },
  { id: 'ach5', name: 'Bullet Train', description: 'Complete 50 workouts total', icon: 'train', unlocked: false, rarity: 'legendary' },
  { id: 'ach6', name: 'Batman', description: 'Train 7 days in a row', icon: 'moon', unlocked: true, unlockedAt: '2026-04-05', rarity: 'rare' },
  { id: 'ach7', name: 'Iron Will', description: 'Reach 30 Discipline', icon: 'zap', unlocked: false, rarity: 'legendary' },
  { id: 'ach8', name: 'Centurion', description: 'Bench 100kg', icon: 'shield', unlocked: true, unlockedAt: '2026-06-10', rarity: 'epic' },
];

export const MOCK_QUESTS: Quest[] = [
  { id: 'q1', name: 'Gain 5kg', description: 'Reach 83kg body weight while maintaining strength', type: 'weight', objective: 'Gain 5kg of lean mass', progress: 3.2, target: 5, reward: { xp: 800, title: 'Mass Builder' }, completed: false },
  { id: 'q2', name: '100kg Bench', description: 'Bench press 100kg for a clean rep', type: 'strength', objective: 'Bench 100kg', progress: 100, target: 100, reward: { xp: 1200, title: 'Centurion' }, completed: true },
  { id: 'q3', name: '20 Workouts', description: 'Complete 20 workout missions', type: 'consistency', objective: 'Complete workouts', progress: 17, target: 20, reward: { xp: 600 }, completed: false },
  { id: 'q4', name: 'New PR Blitz', description: 'Set 5 personal records in one month', type: 'pr', objective: 'Set PRs', progress: 3, target: 5, reward: { xp: 1000 }, completed: false },
  { id: 'q5', name: 'Volume Monster', description: 'Reach 50,000kg total volume in a week', type: 'volume', objective: 'Weekly volume', progress: 32400, target: 50000, reward: { xp: 900 }, completed: false },
];

export const MOCK_WEEKLY_REPORTS: WeeklyReport[] = [
  {
    weekOf: '2026-06-08',
    totalWorkouts: 4,
    totalVolume: 42500,
    xpGained: 1950,
    prsSet: 2,
    muscleBalance: [
      { group: 'Chest', percentage: 25 },
      { group: 'Back', percentage: 30 },
      { group: 'Legs', percentage: 25 },
      { group: 'Shoulders', percentage: 12 },
      { group: 'Arms', percentage: 8 },
    ],
    strengthGrowth: [
      { exercise: 'Bench Press', start: 82.5, end: 85 },
      { exercise: 'Squat', start: 97.5, end: 100 },
    ],
    notes: 'Strong week. PR on bench press. Focus on recovery next week.',
  },
  {
    weekOf: '2026-06-01',
    totalWorkouts: 3,
    totalVolume: 38200,
    xpGained: 1600,
    prsSet: 1,
    muscleBalance: [
      { group: 'Chest', percentage: 22 },
      { group: 'Back', percentage: 28 },
      { group: 'Legs', percentage: 30 },
      { group: 'Shoulders', percentage: 10 },
      { group: 'Arms', percentage: 10 },
    ],
    strengthGrowth: [
      { exercise: 'Deadlift', start: 155, end: 160 },
      { exercise: 'OHP', start: 55, end: 57.5 },
    ],
    notes: 'Lower volume week. Deadlift PR. Felt fatigued mid-week.',
  },
];

export const LEVEL_THRESHOLDS = Array.from({ length: 50 }, (_, i) => ({
  level: i + 1,
  xpRequired: Math.floor(100 * (i + 1) * Math.pow(1.12, i)),
  title: i < 5 ? 'Iron Novice' : i < 10 ? 'Steel Apprentice' : i < 20 ? 'Bronze Warrior' : i < 30 ? 'Silver Champion' : i < 40 ? 'Gold Elite' : 'Platinum Legend',
}));
