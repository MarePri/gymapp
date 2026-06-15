import type { StrengthStandards, UserProfile, DifficultyRating } from '../types';
import { getStandard, estimateStartingWeight, nextProgression } from '../data/strengthStandards';

const MAJOR_EXERCISES = [
  'Barbell Bench Press', 'Barbell Squat', 'Deadlift', 'Standing OHP',
  'Barbell Row', 'Lat Pulldown', 'Barbell Curl', 'Leg Press',
  'Close-Grip Bench Press', 'Incline Dumbbell Press', 'Romanian Deadlift',
];

export function generateInitialStandards(profile: UserProfile): StrengthStandards[] {
  return MAJOR_EXERCISES.map((exercise) => {
    const std = getStandard(exercise, profile.weight, profile.experience);
    const startWeight = estimateStartingWeight(exercise, profile.weight);
    const next = nextProgression(startWeight, 8, 12);

    return {
      exercise,
      current: startWeight,
      target1RM: Math.round(startWeight * 1.2),
      beginner: std?.beginnerWeight || startWeight,
      intermediate: std?.intermediateWeight || startWeight * 1.5,
      advanced: std?.advancedWeight || startWeight * 2,
      nextMilestone: next.nextWeight,
      progression: 'ready',
    } as StrengthStandards;
  });
}

export function calculateNextWeight(
  currentWeight: number,
  bestReps: number,
  targetReps: number,
  rating?: DifficultyRating
): { nextWeight: number; increment: number; shouldIncrease: boolean } {
  const base = nextProgression(currentWeight, bestReps, targetReps);

  // Adjust based on difficulty rating
  if (rating === 'easy' && base.shouldProgress) {
    return { nextWeight: currentWeight + base.increment * 1.5, increment: base.increment, shouldIncrease: true };
  }
  if (rating === 'hard' && base.shouldProgress) {
    return { nextWeight: currentWeight + base.increment * 0.5, increment: base.increment, shouldIncrease: false };
  }
  if (rating === 'hard' && !base.shouldProgress) {
    return { nextWeight: currentWeight, increment: base.increment, shouldIncrease: false };
  }

  return { nextWeight: base.nextWeight, increment: base.increment, shouldIncrease: base.shouldProgress };
}

export function getRepTarget(reps: string): number {
  const [_, hi] = reps.split('-').map(Number);
  return hi;
}

export function calculateSuccessProbability(
  currentWeight: number,
  suggestedWeight: number,
  repsCompleted: number,
  targetReps: number
): number {
  const ratio = suggestedWeight / currentWeight;
  const repRatio = repsCompleted / targetReps;

  if (ratio <= 1) return Math.min(95, Math.round(70 + repRatio * 25));
  if (ratio <= 1.05) return Math.round(65 + repRatio * 20);
  if (ratio <= 1.1) return Math.round(50 + repRatio * 15);
  return Math.round(30 + repRatio * 10);
}
