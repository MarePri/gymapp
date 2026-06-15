import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, StrengthStandards, WorkoutFeedback } from '../types';
import { generateInitialStandards } from '../utils/progression';

interface UserState {
  profile: UserProfile | null;
  standards: StrengthStandards[];
  workoutFeedback: WorkoutFeedback[];
  setProfile: (profile: UserProfile) => void;
  updateWeight: (weight: number) => void;
  updateStandards: (standards: StrengthStandards[]) => void;
  addFeedback: (feedback: WorkoutFeedback) => void;
  getExerciseStandard: (exercise: string) => StrengthStandards | undefined;
  updateExerciseWeight: (exercise: string, newWeight: number) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      standards: [],
      workoutFeedback: [],

      setProfile: (profile: UserProfile) => {
        const standards = generateInitialStandards(profile);
        set({ profile, standards });
      },

      updateWeight: (weight: number) => {
        const profile = get().profile;
        if (!profile) return;
        const newProfile = { ...profile, weight };
        const standards = generateInitialStandards(newProfile);
        set({ profile: newProfile, standards });
      },

      updateStandards: (standards: StrengthStandards[]) => {
        set({ standards });
      },

      addFeedback: (feedback: WorkoutFeedback) => {
        set((state) => ({
          workoutFeedback: [...state.workoutFeedback, feedback],
        }));
      },

      getExerciseStandard: (exercise: string) => {
        return get().standards.find((s) => s.exercise === exercise);
      },

      updateExerciseWeight: (exercise: string, newWeight: number) => {
        set((state) => ({
          standards: state.standards.map((s) =>
            s.exercise === exercise ? { ...s, current: newWeight } : s
          ),
        }));
      },

      completeOnboarding: () => {
        const profile = get().profile;
        if (!profile) return;
        set({ profile: { ...profile, onboarded: true } });
      },

      resetProfile: () => {
        set({ profile: null, standards: [], workoutFeedback: [] });
      },
    }),
    { name: 'prixi-user' }
  )
);
