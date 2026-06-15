import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StrengthRecord, ProgressEntry, WeeklyReport } from '../types';
import { MOCK_STRENGTH_RECORDS, MOCK_PROGRESS, MOCK_WEEKLY_REPORTS } from '../data/mockData';

interface ProgressState {
  strengthRecords: StrengthRecord[];
  progressHistory: ProgressEntry[];
  weeklyReports: WeeklyReport[];
  addStrengthRecord: (record: StrengthRecord) => void;
  addProgressEntry: (entry: ProgressEntry) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      strengthRecords: MOCK_STRENGTH_RECORDS,
      progressHistory: MOCK_PROGRESS,
      weeklyReports: MOCK_WEEKLY_REPORTS,

      addStrengthRecord: (record: StrengthRecord) => {
        set((state) => ({
          strengthRecords: [record, ...state.strengthRecords],
        }));
      },

      addProgressEntry: (entry: ProgressEntry) => {
        set((state) => ({
          progressHistory: [...state.progressHistory, entry],
        }));
      },
    }),
    { name: 'prixi-progress' }
  )
);
