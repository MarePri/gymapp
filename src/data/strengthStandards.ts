// Strength standards based on body weight
// Values are ratios: weight lifted / body weight

export interface ExerciseStandard {
  name: string;
  beginner: number;   // ratio of body weight
  intermediate: number;
  advanced: number;
}

export const STRENGTH_STANDARDS: ExerciseStandard[] = [
  { name: 'Barbell Bench Press', beginner: 0.8, intermediate: 1.2, advanced: 1.6 },
  { name: 'Dumbbell Bench Press', beginner: 0.35, intermediate: 0.5, advanced: 0.7 }, // per dumbbell
  { name: 'Incline Barbell Press', beginner: 0.6, intermediate: 0.9, advanced: 1.3 },
  { name: 'Incline Dumbbell Press', beginner: 0.3, intermediate: 0.45, advanced: 0.6 },
  { name: 'Barbell Squat', beginner: 0.9, intermediate: 1.4, advanced: 1.8 },
  { name: 'Front Squat', beginner: 0.7, intermediate: 1.1, advanced: 1.5 },
  { name: 'Deadlift', beginner: 1.1, intermediate: 1.6, advanced: 2.2 },
  { name: 'Barbell Row', beginner: 0.6, intermediate: 0.9, advanced: 1.2 },
  { name: 'Standing OHP', beginner: 0.4, intermediate: 0.6, advanced: 0.8 },
  { name: 'Close-Grip Bench Press', beginner: 0.6, intermediate: 0.9, advanced: 1.2 },
  { name: 'Lat Pulldown', beginner: 0.6, intermediate: 0.9, advanced: 1.2 },
  { name: 'Barbell Curl', beginner: 0.25, intermediate: 0.35, advanced: 0.5 },
  { name: 'Leg Press', beginner: 1.5, intermediate: 2.5, advanced: 3.5 },
  { name: 'Romanian Deadlift', beginner: 0.7, intermediate: 1.1, advanced: 1.5 },
];

const EXERCISE_STANDARD_MAP = new Map(STRENGTH_STANDARDS.map(s => [s.name, s]));

export function getStandard(exerciseName: string, bodyWeight: number, experience: string) {
  const std = EXERCISE_STANDARD_MAP.get(exerciseName);
  if (!std) return null;

  const level = experience as keyof Pick<ExerciseStandard, 'beginner' | 'intermediate' | 'advanced'>;
  const ratio = std[level] || std.beginner;
  const targetWeight = Math.round(ratio * bodyWeight / 2.5) * 2.5; // round to 2.5kg

  const beginnerWeight = Math.round(std.beginner * bodyWeight / 2.5) * 2.5;
  const intermediateWeight = Math.round(std.intermediate * bodyWeight / 2.5) * 2.5;
  const advancedWeight = Math.round(std.advanced * bodyWeight / 2.5) * 2.5;

  return {
    targetWeight,
    beginnerWeight,
    intermediateWeight,
    advancedWeight,
    ratio,
    level,
  };
}

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function estimateStartingWeight(exerciseName: string, bodyWeight: number): number {
  const std = EXERCISE_STANDARD_MAP.get(exerciseName);
  if (!std) return 20; // default starting weight
  const startRatio = std.beginner * 0.6; // start at 60% of beginner
  return Math.max(Math.round(startRatio * bodyWeight / 2.5) * 2.5, 20);
}

export function nextProgression(currentWeight: number, currentReps: number, targetReps: number): {
  nextWeight: number;
  increment: number;
  shouldProgress: boolean;
} {
  const increment = currentWeight < 60 ? 2.5 : currentWeight < 100 ? 5 : 5;
  const shouldProgress = currentReps >= targetReps;

  return {
    nextWeight: shouldProgress ? currentWeight + increment : currentWeight,
    increment,
    shouldProgress,
  };
}
