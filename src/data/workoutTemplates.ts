

export interface TemplateExercise {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string; // e.g. "8-12", "6-8", "10-15"
}

export interface DayTemplate {
  name: string;
  focus: string[];
  exercises: TemplateExercise[];
}

export const WORKOUT_SPLITS: Record<string, DayTemplate[]> = {
  ppl: [
    {
      name: 'Chest & Triceps',
      focus: ['chest', 'triceps', 'neck'],
      exercises: [
        { name: 'Barbell Bench Press', muscleGroup: 'Chest', sets: 4, reps: '8-12' },
        { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', sets: 3, reps: '10-12' },
        { name: 'Cable Flyes', muscleGroup: 'Chest', sets: 3, reps: '12-15' },
        { name: 'Close-Grip Bench Press', muscleGroup: 'Triceps', sets: 3, reps: '8-12' },
        { name: 'Tricep Pushdown', muscleGroup: 'Triceps', sets: 3, reps: '12-15' },
        { name: 'Neck Curls', muscleGroup: 'Neck', sets: 3, reps: '12-15' },
      ],
    },
    {
      name: 'Back & Biceps',
      focus: ['back', 'biceps'],
      exercises: [
        { name: 'Barbell Row', muscleGroup: 'Back', sets: 4, reps: '8-12' },
        { name: 'Lat Pulldown', muscleGroup: 'Back', sets: 3, reps: '10-12' },
        { name: 'Seated Cable Row', muscleGroup: 'Back', sets: 3, reps: '10-12' },
        { name: 'Barbell Curl', muscleGroup: 'Biceps', sets: 3, reps: '10-12' },
        { name: 'Hammer Curl', muscleGroup: 'Biceps', sets: 3, reps: '12-15' },
        { name: 'Face Pull', muscleGroup: 'Shoulders', sets: 3, reps: '15-20' },
      ],
    },
    {
      name: 'Legs & Shoulders',
      focus: ['legs', 'shoulders'],
      exercises: [
        { name: 'Barbell Squat', muscleGroup: 'Legs', sets: 4, reps: '8-12' },
        { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', sets: 3, reps: '10-12' },
        { name: 'Leg Press', muscleGroup: 'Legs', sets: 3, reps: '12-15' },
        { name: 'Standing OHP', muscleGroup: 'Shoulders', sets: 4, reps: '8-12' },
        { name: 'Lateral Raise', muscleGroup: 'Shoulders', sets: 3, reps: '12-15' },
        { name: 'Calf Raise', muscleGroup: 'Calves', sets: 3, reps: '15-20' },
      ],
    },
    {
      name: 'Chest & Arms (Focus)',
      focus: ['chest', 'arms', 'neck'],
      exercises: [
        { name: 'Dumbbell Bench Press', muscleGroup: 'Chest', sets: 4, reps: '8-12' },
        { name: 'Incline Barbell Press', muscleGroup: 'Chest', sets: 3, reps: '8-12' },
        { name: 'Dips', muscleGroup: 'Chest', sets: 3, reps: '8-12' },
        { name: 'EZ Bar Curl', muscleGroup: 'Biceps', sets: 3, reps: '10-12' },
        { name: 'Skull Crushers', muscleGroup: 'Triceps', sets: 3, reps: '10-12' },
        { name: 'Neck Extension', muscleGroup: 'Neck', sets: 3, reps: '12-15' },
      ],
    },
    {
      name: 'Back & Rear Delts',
      focus: ['back', 'shoulders'],
      exercises: [
        { name: 'Deadlift', muscleGroup: 'Back', sets: 3, reps: '6-8' },
        { name: 'T-Bar Row', muscleGroup: 'Back', sets: 3, reps: '10-12' },
        { name: 'Pull-ups', muscleGroup: 'Back', sets: 3, reps: '8-12' },
        { name: 'Rear Delt Fly', muscleGroup: 'Shoulders', sets: 3, reps: '12-15' },
        { name: 'Shrugs', muscleGroup: 'Traps', sets: 3, reps: '12-15' },
        { name: 'Preacher Curl', muscleGroup: 'Biceps', sets: 3, reps: '10-12' },
      ],
    },
    {
      name: 'Legs & Abs',
      focus: ['legs', 'abs'],
      exercises: [
        { name: 'Front Squat', muscleGroup: 'Legs', sets: 3, reps: '8-10' },
        { name: 'Bulgarian Split Squat', muscleGroup: 'Legs', sets: 3, reps: '10-12' },
        { name: 'Lying Leg Curl', muscleGroup: 'Hamstrings', sets: 3, reps: '12-15' },
        { name: 'Standing Calf Raise', muscleGroup: 'Calves', sets: 4, reps: '15-20' },
        { name: 'Hanging Leg Raise', muscleGroup: 'Abs', sets: 3, reps: '12-15' },
        { name: 'Neck Flexion', muscleGroup: 'Neck', sets: 3, reps: '12-15' },
      ],
    },
  ],
};

export const EXERCISE_DB: Record<string, { muscleGroup: string; defaultSets: number; defaultReps: string }> = {
  'Barbell Bench Press': { muscleGroup: 'Chest', defaultSets: 4, defaultReps: '8-12' },
  'Dumbbell Bench Press': { muscleGroup: 'Chest', defaultSets: 3, defaultReps: '8-12' },
  'Incline Dumbbell Press': { muscleGroup: 'Chest', defaultSets: 3, defaultReps: '10-12' },
  'Incline Barbell Press': { muscleGroup: 'Chest', defaultSets: 3, defaultReps: '8-12' },
  'Cable Flyes': { muscleGroup: 'Chest', defaultSets: 3, defaultReps: '12-15' },
  'Dips': { muscleGroup: 'Chest', defaultSets: 3, defaultReps: '8-12' },
  'Close-Grip Bench Press': { muscleGroup: 'Triceps', defaultSets: 3, defaultReps: '8-12' },
  'Tricep Pushdown': { muscleGroup: 'Triceps', defaultSets: 3, defaultReps: '12-15' },
  'Skull Crushers': { muscleGroup: 'Triceps', defaultSets: 3, defaultReps: '10-12' },
  'Barbell Curl': { muscleGroup: 'Biceps', defaultSets: 3, defaultReps: '10-12' },
  'Hammer Curl': { muscleGroup: 'Biceps', defaultSets: 3, defaultReps: '12-15' },
  'Preacher Curl': { muscleGroup: 'Biceps', defaultSets: 3, defaultReps: '10-12' },
  'EZ Bar Curl': { muscleGroup: 'Biceps', defaultSets: 3, defaultReps: '10-12' },
  'Barbell Row': { muscleGroup: 'Back', defaultSets: 4, defaultReps: '8-12' },
  'Lat Pulldown': { muscleGroup: 'Back', defaultSets: 3, defaultReps: '10-12' },
  'Seated Cable Row': { muscleGroup: 'Back', defaultSets: 3, defaultReps: '10-12' },
  'T-Bar Row': { muscleGroup: 'Back', defaultSets: 3, defaultReps: '10-12' },
  'Pull-ups': { muscleGroup: 'Back', defaultSets: 3, defaultReps: '8-12' },
  'Deadlift': { muscleGroup: 'Back', defaultSets: 3, defaultReps: '6-8' },
  'Barbell Squat': { muscleGroup: 'Legs', defaultSets: 4, defaultReps: '8-12' },
  'Front Squat': { muscleGroup: 'Legs', defaultSets: 3, defaultReps: '8-10' },
  'Bulgarian Split Squat': { muscleGroup: 'Legs', defaultSets: 3, defaultReps: '10-12' },
  'Leg Press': { muscleGroup: 'Legs', defaultSets: 3, defaultReps: '12-15' },
  'Romanian Deadlift': { muscleGroup: 'Hamstrings', defaultSets: 3, defaultReps: '10-12' },
  'Lying Leg Curl': { muscleGroup: 'Hamstrings', defaultSets: 3, defaultReps: '12-15' },
  'Standing OHP': { muscleGroup: 'Shoulders', defaultSets: 4, defaultReps: '8-12' },
  'Lateral Raise': { muscleGroup: 'Shoulders', defaultSets: 3, defaultReps: '12-15' },
  'Rear Delt Fly': { muscleGroup: 'Shoulders', defaultSets: 3, defaultReps: '12-15' },
  'Face Pull': { muscleGroup: 'Shoulders', defaultSets: 3, defaultReps: '15-20' },
  'Shrugs': { muscleGroup: 'Traps', defaultSets: 3, defaultReps: '12-15' },
  'Calf Raise': { muscleGroup: 'Calves', defaultSets: 3, defaultReps: '15-20' },
  'Standing Calf Raise': { muscleGroup: 'Calves', defaultSets: 4, defaultReps: '15-20' },
  'Hanging Leg Raise': { muscleGroup: 'Abs', defaultSets: 3, defaultReps: '12-15' },
  'Neck Curls': { muscleGroup: 'Neck', defaultSets: 3, defaultReps: '12-15' },
  'Neck Extension': { muscleGroup: 'Neck', defaultSets: 3, defaultReps: '12-15' },
  'Neck Flexion': { muscleGroup: 'Neck', defaultSets: 3, defaultReps: '12-15' },
};

export function parseRepRange(range: string): [number, number] {
  const [lo, hi] = range.split('-').map(Number);
  return [lo, hi];
}
