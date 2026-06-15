import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutMission, WorkoutSession, DifficultyRating } from '../types';
import { useGameStore } from './gameStore';
import { useUserStore } from './userStore';
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

interface WorkoutState {
  missions: WorkoutMission[];
  activeSession: WorkoutSession | null;
  sessionHistory: WorkoutSession[];
  isLoading: boolean;
  refreshMissions: () => void;
  startWorkout: (missionId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  completeExercise: (exerciseId: string) => void;
  completeWorkout: (rating?: DifficultyRating) => number;
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
        if (!session) return 0;

        const mission = get().missions.find((m) => m.id === session.missionId);
        const xpEarned = mission?.xpReward || 200;

        // Calculate actual reps completed per exercise for progression
        const adjustedWeights: Record<string, number> = {};
        session.exercises.forEach((ex) => {
          const completedSets = ex.sets.filter((s) => s.completed);
          if (completedSets.length === 0) return;

          const avgReps = completedSets.reduce((sum, s) => sum + s.reps, 0) / completedSets.length;
          const targetReps = getRepTarget('8-12'); // default target
          const { nextWeight } = calculateNextWeight(
            completedSets[0].weight,
            Math.round(avgReps),
            targetReps,
            rating
          );
          adjustedWeights[ex.exerciseName] = nextWeight;
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
        }));

        // Award XP
        useGameStore.getState().addXP(xpEarned);
        useGameStore.getState().addStatPoints(2);

        // Update strength standards based on completion
        const userStore = useUserStore.getState();
        Object.entries(adjustedWeights).forEach(([exercise, newWeight]) => {
          const currentStd = userStore.getExerciseStandard(exercise);
          if (currentStd && newWeight > currentStd.current) {
            userStore.updateExerciseWeight(exercise, newWeight);
          }
        });

        // Store feedback
        if (rating) {
          userStore.addFeedback({
            sessionId: session.id,
            rating,
            adjustedWeights,
          });
        }

        return xpEarned;
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
