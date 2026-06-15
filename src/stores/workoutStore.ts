import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutMission, WorkoutSession } from '../types';
import { MOCK_WORKOUTS } from '../data/mockData';
import { useGameStore } from './gameStore';

interface WorkoutState {
  missions: WorkoutMission[];
  activeSession: WorkoutSession | null;
  sessionHistory: WorkoutSession[];
  startWorkout: (missionId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  completeExercise: (exerciseId: string) => void;
  completeWorkout: () => number;
  cancelWorkout: () => void;
  getXPForMission: (missionId: string) => number;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      missions: MOCK_WORKOUTS,
      activeSession: null,
      sessionHistory: [],

      startWorkout: (missionId: string) => {
        const mission = get().missions.find((m) => m.id === missionId);
        if (!mission) return;
        set({
          activeSession: {
            id: `session-${Date.now()}`,
            missionId: mission.id,
            missionName: mission.name,
            missionType: mission.type,
            startTime: new Date().toISOString(),
            exercises: mission.exercises.map((e) => ({
              ...e,
              sets: e.sets.map((s) => ({ ...s, completed: false })),
            })),
            completed: false,
            xpEarned: 0,
          },
        });
      },

      completeSet: (exerciseId: string, setId: string) => {
        const session = get().activeSession;
        if (!session) return;
        set({
          activeSession: {
            ...session,
            exercises: session.exercises.map((ex) =>
              ex.exerciseId === exerciseId
                ? { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, completed: true } : s)) }
                : ex
            ),
          },
        });
      },

      completeExercise: (exerciseId: string) => {
        const session = get().activeSession;
        if (!session) return;
        set({
          activeSession: {
            ...session,
            exercises: session.exercises.map((ex) =>
              ex.exerciseId === exerciseId
                ? { ...ex, sets: ex.sets.map((s) => ({ ...s, completed: true })) }
                : ex
            ),
          },
        });
      },

      completeWorkout: () => {
        const session = get().activeSession;
        if (!session) return 0;
        const mission = get().missions.find((m) => m.id === session.missionId);
        const xpEarned = mission?.xpReward || 300;
        const completedSession: WorkoutSession = {
          ...session,
          completed: true,
          endTime: new Date().toISOString(),
          xpEarned,
        };
        set((state) => ({
          activeSession: null,
          sessionHistory: [...state.sessionHistory, completedSession],
          missions: state.missions.map((m) =>
            m.id === session.missionId ? { ...m, completed: true } : m
          ),
        }));
        useGameStore.getState().addXP(xpEarned);
        if (mission?.statRewards) {
          useGameStore.getState().addStatPoints(
            Object.values(mission.statRewards).reduce((a, b) => a + b, 0)
          );
        }
        return xpEarned;
      },

      cancelWorkout: () => {
        set({ activeSession: null });
      },

      getXPForMission: (missionId: string) => {
        const mission = get().missions.find((m) => m.id === missionId);
        return mission?.xpReward || 300;
      },
    }),
    { name: 'prixi-workouts' }
  )
);
