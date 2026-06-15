import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutMission, WorkoutSession, DifficultyRating } from '../types';
import { useGameStore } from './gameStore';
import { useUserStore } from './userStore';
import { useProgressStore } from './progressStore';
import { WORKOUT_SPLITS, parseRepRange } from '../data/workoutTemplates';
import { getRepTarget, calculateNextWeight } from '../utils/progression';
import { estimateStartingWeight } from '../data/strengthStandards';

function generateDailyMissions(): WorkoutMission[] {
  const profile = useUserStore.getState().profile;
  const standards = useUserStore.getState().standards;
  const feedback = useUserStore.getState().workoutFeedback;

  if (!profile) return [];

  const days = WORKOUT_SPLITS.ppl || [];
  const today = new Date();
  const cycleIndex = Math.floor(today.getTime() / 86400000) % days.length;

  return days.map((day, idx) => {
    const isToday = idx === cycleIndex;

    const exercises = day.exercises.map((ex) => {
      const std = standards.find((s) => s.exercise === ex.name);
      const baseWeight = std?.current || estimateStartingWeight(ex.name, profile.weight);
      const [, maxReps] = parseRepRange(ex.reps);
      const targetReps = maxReps;

      // Check if there was feedback that suggests weight adjustment
      const lastFeedback = feedback
        .filter(f => f.adjustedWeights?.[ex.name])
        .sort((a, b) => new Date(b.sessionId).getTime() - new Date(a.sessionId).getTime())[0];

      const adjustedWeight = lastFeedback?.adjustedWeights?.[ex.name] || baseWeight;

      const sets = Array.from({ length: ex.sets }, (_, i) => ({
        id: `${ex.name.toLowerCase().replace(/\s+/g, '-')}-${idx}-${i}`,
        weight: adjustedWeight,
        reps: targetReps,
        completed: false,
        rpe: i >= ex.sets - 1 ? 8 : 7,
      }));

      return {
        exerciseId: ex.name.toLowerCase().replace(/\s+/g, '-'),
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        sets,
        notes: `Target: ${ex.reps} reps`,
      };
    });

    const xpReward = exercises.reduce((sum, ex) => sum + ex.sets.length * 15, 0);

    return {
      id: `daily-${idx}`,
      name: idx === cycleIndex ? `🔥 Today: ${day.name}` : day.name,
      description: day.focus.join(', ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'daily',
      icon: isToday ? 'flame' : 'calendar',
      exercises,
      xpReward,
      statRewards: { power: 1, physique: 1, endurance: 1, discipline: 2 },
      completed: false,
      date: today.toISOString(),
      dayNumber: idx + 1,
    };
  });
}

export type ProgressionSuggestion = { exercise: string; current: number; suggested: number };

interface WorkoutState {
  missions: WorkoutMission[];
  activeSession: WorkoutSession | null;
  sessionHistory: WorkoutSession[];
  isLoading: boolean;
  pendingProgression: ProgressionSuggestion[] | null;
  refreshMissions: () => void;
  startWorkout: (missionId: string) => void;
  startFreeWorkout: (exercises: { name: string; muscleGroup: string; sets: number; reps: number; weight: number }[]) => void;
  addExerciseToSession: (exercise: { exerciseId: string; exerciseName: string; muscleGroup: string; sets: { id: string; weight: number; reps: number; completed: boolean }[] }) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<{ weight: number; reps: number; completed: boolean }>) => void;
  removeExercise: (exerciseId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  completeExercise: (exerciseId: string) => void;
  completeWorkout: (rating?: DifficultyRating) => { xp: number };
  applyProgression: (exercise: string, weight: number) => void;
  applyAllProgression: () => void;
  dismissProgression: () => void;
  cancelWorkout: () => void;
  getXPForMission: (missionId: string) => number;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      missions: [],
      activeSession: null,
      sessionHistory: [],
      isLoading: true,
      pendingProgression: null,

      refreshMissions: () => {
        const missions = generateDailyMissions();
        // Preserve completions from existing missions
        const existing = get().missions;
        const merged = missions.map((m) => {
          const existingMission = existing.find((e) => e.id === m.id);
          return existingMission?.completed ? { ...m, completed: true, date: existingMission.date } : m;
        });
        set({ missions: merged, isLoading: false });
      },

      uncompleteMission: (missionId: string) => {
        const mission = get().missions.find((m) => m.id === missionId);
        if (!mission) return;
        // Remove the last matching session from history so redo is clean
        const lastSessionIdx = get().sessionHistory
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.missionId === missionId)
          .pop()?.i;
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === missionId ? { ...m, completed: false } : m
          ),
          sessionHistory:
            lastSessionIdx !== undefined
              ? state.sessionHistory.filter((_, i) => i !== lastSessionIdx)
              : state.sessionHistory,
        }));
      },

  startFreeWorkout: (exercises) => {
        const now = Date.now();
        const sessionExercises = exercises.map((ex, ei) => ({
          exerciseId: ex.name.toLowerCase().replace(/\s+/g, '-') || `custom-${ei}`,
          exerciseName: ex.name,
          muscleGroup: ex.muscleGroup,
          sets: Array.from({ length: ex.sets }, (_, si) => ({
            id: `free-${ei}-${si}-${now}`,
            weight: ex.weight,
            reps: ex.reps,
            completed: false,
          })),
        }));
        set({
          activeSession: {
            id: `session-${now}`,
            missionId: 'free-workout',
            missionName: '🏋️ Free Workout',
            missionType: 'daily',
            startTime: new Date().toISOString(),
            exercises: sessionExercises,
            completed: false,
            xpEarned: 0,
          },
        });
      },

      addExerciseToSession: (exercise) => {
        const session = get().activeSession;
        if (!session) return;
        set({
          activeSession: {
            ...session,
            exercises: [...session.exercises, exercise],
          },
        });
      },

      updateSet: (exerciseId, setId, updates) => {
        const session = get().activeSession;
        if (!session) return;
        set({
          activeSession: {
            ...session,
            exercises: session.exercises.map((ex) =>
              ex.exerciseId === exerciseId
                ? {
                    ...ex,
                    sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
                  }
                : ex
            ),
          },
        });
      },

      removeExercise: (exerciseId) => {
        const session = get().activeSession;
        if (!session) return;
        set({
          activeSession: {
            ...session,
            exercises: session.exercises.filter((ex) => ex.exerciseId !== exerciseId),
          },
        });
      },

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
            dayNumber: mission.dayNumber,
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

      completeWorkout: (rating?: DifficultyRating) => {
        const session = get().activeSession;
        if (!session) return { xp: 0 };

        const mission = get().missions.find((m) => m.id === session.missionId);
        const xpEarned = mission?.xpReward || 200;

        // Calculate progression suggestions instead of auto-applying
        const userStore = useUserStore.getState();
        const progression: ProgressionSuggestion[] = [];
        session.exercises.forEach((ex) => {
          const completedSets = ex.sets.filter((s) => s.completed);
          if (completedSets.length === 0) return;

          const avgReps = completedSets.reduce((sum, s) => sum + s.reps, 0) / completedSets.length;
          const targetReps = getRepTarget('8-12');
          const { nextWeight } = calculateNextWeight(
            completedSets[0].weight,
            Math.round(avgReps),
            targetReps,
            rating
          );
          const currentStd = userStore.getExerciseStandard(ex.exerciseName);
          const current = currentStd?.current || completedSets[0].weight;
          if (nextWeight > current) {
            progression.push({ exercise: ex.exerciseName, current, suggested: nextWeight });
          }
        });

        const completedSession: WorkoutSession = {
          ...session,
          completed: true,
          endTime: new Date().toISOString(),
          xpEarned,
          rating,
        };

        set((state) => ({
          activeSession: null,
          sessionHistory: [...state.sessionHistory, completedSession],
          missions: state.missions.map((m) =>
            m.id === session.missionId ? { ...m, completed: true, date: new Date().toISOString() } : m
          ),
          pendingProgression: progression.length > 0 ? progression : null,
        }));

        // Award XP
        useGameStore.getState().addXP(xpEarned);
        useGameStore.getState().addStatPoints(2);
        useGameStore.getState().incrementWorkouts();

        // Store feedback
        if (rating) {
          userStore.addFeedback({ sessionId: session.id, rating });
        }

        // Record strength PRs in progress store
        const progressStore = useProgressStore.getState();
        session.exercises.forEach((ex) => {
          const completedSets = ex.sets.filter((s) => s.completed);
          if (completedSets.length === 0) return;
          const bestSet = [...completedSets].sort((a, b) => b.weight - a.weight)[0];
          const bestRecord = progressStore.getExerciseBest(ex.exerciseName);
          if (!bestRecord || bestSet.weight > bestRecord.weight) {
            const estimated1RM = Math.round(bestSet.weight * (1 + bestSet.reps / 30));
            progressStore.addStrengthRecord({
              exercise: ex.exerciseName,
              weight: bestSet.weight,
              reps: bestSet.reps,
              estimated1RM,
              date: new Date().toISOString().split('T')[0],
              isPR: true,
            });
          }
        });

        return { xp: xpEarned };
      },

      applyProgression: (exercise: string, weight: number) => {
        const userStore = useUserStore.getState();
        userStore.updateExerciseWeight(exercise, weight);
        set((state) => ({
          pendingProgression: state.pendingProgression?.filter((p) => p.exercise !== exercise) || null,
        }));
      },

      applyAllProgression: () => {
        const pending = get().pendingProgression;
        if (!pending) return;
        const userStore = useUserStore.getState();
        pending.forEach((p) => userStore.updateExerciseWeight(p.exercise, p.suggested));
        set({ pendingProgression: null });
      },

      dismissProgression: () => {
        set({ pendingProgression: null });
      },

      cancelWorkout: () => {
        set({ activeSession: null });
      },

      getXPForMission: (missionId: string) => {
        const mission = get().missions.find((m) => m.id === missionId);
        return mission?.xpReward || 200;
      },
    }),
    { name: 'prixi-workouts' }
  )
);
