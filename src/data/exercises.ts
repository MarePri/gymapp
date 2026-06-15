export interface ExerciseOption {
  name: string;
  muscleGroup: string;
  equipment?: string;
}

export const ALL_EXERCISES: ExerciseOption[] = [
  // ─── Chest ───
  { name: 'Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { name: 'Decline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Cable Fly', muscleGroup: 'Chest', equipment: 'Cable' },
  { name: 'Dumbbell Fly', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { name: 'Pec Deck Machine', muscleGroup: 'Chest', equipment: 'Machine' },
  { name: 'Push-up', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { name: 'Dips', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { name: 'Svend Press', muscleGroup: 'Chest', equipment: 'Plate' },
  { name: 'Pullover', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { name: 'Landmine Press', muscleGroup: 'Chest', equipment: 'Barbell' },

  // ─── Back ───
  { name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Pendlay Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Dumbbell Row', muscleGroup: 'Back', equipment: 'Dumbbell' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'Pull-up', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { name: 'Chin-up', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'T-Bar Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Machine Row', muscleGroup: 'Back', equipment: 'Machine' },
  { name: 'Face Pull', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'Good Morning', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Hyperextension', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { name: 'Single-Arm Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },

  // ─── Legs ───
  { name: 'Barbell Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Front Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Goblet Squat', muscleGroup: 'Legs', equipment: 'Dumbbell' },
  { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'Legs', equipment: 'Dumbbell' },
  { name: 'Walking Lunge', muscleGroup: 'Legs', equipment: 'Dumbbell' },
  { name: 'Leg Extension', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Leg Curl', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', equipment: 'Barbell' },
  { name: 'Stiff-Leg Deadlift', muscleGroup: 'Hamstrings', equipment: 'Barbell' },
  { name: 'Nordic Curl', muscleGroup: 'Hamstrings', equipment: 'Bodyweight' },
  { name: 'Calf Raise', muscleGroup: 'Calves', equipment: 'Machine' },
  { name: 'Seated Calf Raise', muscleGroup: 'Calves', equipment: 'Machine' },
  { name: 'Hack Squat', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Hip Thrust', muscleGroup: 'Glutes', equipment: 'Barbell' },
  { name: 'Glute Bridge', muscleGroup: 'Glutes', equipment: 'Bodyweight' },
  { name: 'Step-up', muscleGroup: 'Legs', equipment: 'Dumbbell' },

  // ─── Shoulders ───
  { name: 'Standing OHP', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Cable' },
  { name: 'Front Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Reverse Fly', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Cable Reverse Fly', muscleGroup: 'Shoulders', equipment: 'Cable' },
  { name: 'Upright Row', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { name: 'Shrug', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Face Pull (Shoulder)', muscleGroup: 'Shoulders', equipment: 'Cable' },
  { name: 'Landmine Press (Shoulder)', muscleGroup: 'Shoulders', equipment: 'Barbell' },

  // ─── Arms: Biceps ───
  { name: 'Barbell Curl', muscleGroup: 'Biceps', equipment: 'Barbell' },
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Preacher Curl', muscleGroup: 'Biceps', equipment: 'Barbell' },
  { name: 'Cable Curl', muscleGroup: 'Biceps', equipment: 'Cable' },
  { name: 'Concentration Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Spider Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Bayesian Cable Curl', muscleGroup: 'Biceps', equipment: 'Cable' },
  { name: 'Zottman Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },

  // ─── Arms: Triceps ───
  { name: 'Close-Grip Bench Press', muscleGroup: 'Triceps', equipment: 'Barbell' },
  { name: 'Tricep Pushdown', muscleGroup: 'Triceps', equipment: 'Cable' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', equipment: 'Dumbbell' },
  { name: 'Skull Crusher', muscleGroup: 'Triceps', equipment: 'Barbell' },
  { name: 'Diamond Push-up', muscleGroup: 'Triceps', equipment: 'Bodyweight' },
  { name: 'Tricep Kickback', muscleGroup: 'Triceps', equipment: 'Dumbbell' },
  { name: 'French Press', muscleGroup: 'Triceps', equipment: 'Barbell' },
  { name: 'Cable Overhead Extension', muscleGroup: 'Triceps', equipment: 'Cable' },
  { name: 'JM Press', muscleGroup: 'Triceps', equipment: 'Barbell' },

  // ─── Core ───
  { name: 'Crunch', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Leg Raise', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Cable Crunch', muscleGroup: 'Core', equipment: 'Cable' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Russian Twist', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Pallof Press', muscleGroup: 'Core', equipment: 'Cable' },
  { name: 'Dead Bug', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Hollow Hold', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Dragon Flag', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Sit-up', muscleGroup: 'Core', equipment: 'Bodyweight' },

  // ─── Forearms / Grip ───
  { name: 'Wrist Curl', muscleGroup: 'Forearms', equipment: 'Dumbbell' },
  { name: 'Reverse Wrist Curl', muscleGroup: 'Forearms', equipment: 'Dumbbell' },
  { name: 'Farmer Walk', muscleGroup: 'Forearms', equipment: 'Dumbbell' },
  { name: 'Dead Hang', muscleGroup: 'Forearms', equipment: 'Bodyweight' },
  { name: 'Plate Pinch', muscleGroup: 'Forearms', equipment: 'Plate' },

  // ─── Neck ───
  { name: 'Neck Curl (Lying)', muscleGroup: 'Neck', equipment: 'Bodyweight' },
  { name: 'Neck Extension (Lying)', muscleGroup: 'Neck', equipment: 'Bodyweight' },
  { name: 'Lateral Neck Flexion', muscleGroup: 'Neck', equipment: 'Bodyweight' },
  { name: 'Neck Harness', muscleGroup: 'Neck', equipment: 'Plate' },
  { name: 'Isometric Neck Hold', muscleGroup: 'Neck', equipment: 'Bodyweight' },
];

export const MUSCLE_GROUPS = [
  ...new Set(ALL_EXERCISES.map((e) => e.muscleGroup)),
].sort();

export function getExercisesByGroup(group: string): ExerciseOption[] {
  return ALL_EXERCISES.filter((e) => e.muscleGroup === group);
}

export function searchExercises(query: string): ExerciseOption[] {
  const q = query.toLowerCase();
  return ALL_EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.muscleGroup.toLowerCase().includes(q)
  );
}
