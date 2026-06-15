import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StrengthRecord, ProgressEntry, WeeklyReport } from '../types';

interface ProgressState {
  strengthRecords: StrengthRecord[];
  progressHistory: ProgressEntry[];
  weeklyReports: WeeklyReport[];
  addStrengthRecord: (record: StrengthRecord) => void;
  addProgressEntry: (entry: ProgressEntry) => void;
  getExerciseBest: (exercise: string) => StrengthRecord | undefined;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      strengthRecords: [],
      progressHistory: [],
      weeklyReports: [],

      addStrengthRecord: (record: StrengthRecord) => {
        set((state) => {
          // Check if this is a new PR (higher weight for same exercise)
          const existing = state.strengthRecords.find(r => r.exercise === record.exercise);
          const isPR = !existing || record.weight > existing.weight;
          return {
            strengthRecords: [
              { ...record, isPR },
              ...state.strengthRecords,
            ],
          };
        });
      },

      addProgressEntry: (entry: ProgressEntry) => {
        set((state) => ({
          progressHistory: [...state.progressHistory, entry],
        }));
      },

      getExerciseBest: (exercise: string) => {
        return get().strengthRecords.find(r => r.exercise === exercise);
      },
    }),
    { name: 'prixi-progress' }
  )
);
