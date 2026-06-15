import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, Achievement, Quest } from '../types';
import { LEVEL_THRESHOLDS } from '../data/mockData';

const FRESH_CHARACTER: Character = {
  name: 'Prixi',
  level: 1,
  xp: 0,
  xpToNext: 100,
  stats: { power: 5, physique: 5, endurance: 5, discipline: 5 },
  statPoints: 0,
  joinDate: new Date().toISOString().split('T')[0],
  title: 'Iron Novice',
};

interface GameState {
  character: Character;
  achievements: Achievement[];
  quests: Quest[];
  totalWorkoutsCompleted: number;
  addXP: (amount: number) => void;
  addStatPoints: (amount: number) => void;
  assignStat: (stat: keyof Character['stats']) => void;
  incrementWorkouts: () => void;
  completeQuest: (questId: string) => void;
  unlockAchievement: (id: string) => void;
  setCharacterName: (name: string) => void;
  resetCharacter: () => void;
  resetAll: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: FRESH_CHARACTER,
      achievements: [],
      quests: [],
      totalWorkoutsCompleted: 0,

      addXP: (amount: number) => {
        set((state) => {
          let { xp, xpToNext, level } = state.character;
          xp += amount;
          let leveledUp = false;
          while (xp >= xpToNext) {
            xp -= xpToNext;
            level += 1;
            const threshold = LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)];
            xpToNext = threshold.xpRequired;
            leveledUp = true;
          }
          return {
            character: {
              ...state.character,
              xp,
              xpToNext,
              level,
              title: LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)].title,
              statPoints: state.character.statPoints + (leveledUp ? 2 : 0),
            },
          };
        });
      },

      addStatPoints: (amount: number) => {
        set((state) => ({
          character: { ...state.character, statPoints: state.character.statPoints + amount },
        }));
      },

      assignStat: (stat: keyof Character['stats']) => {
        const { character } = get();
        if (character.statPoints <= 0) return;
        set({
          character: {
            ...character,
            statPoints: character.statPoints - 1,
            stats: { ...character.stats, [stat]: character.stats[stat] + 1 },
          },
        });
      },

      incrementWorkouts: () => {
        set((state) => ({ totalWorkoutsCompleted: state.totalWorkoutsCompleted + 1 }));
      },

      completeQuest: (questId: string) => {
        const quest = get().quests.find((q) => q.id === questId);
        if (!quest || quest.completed) return;
        set({
          quests: get().quests.map((q) => (q.id === questId ? { ...q, completed: true, progress: q.target } : q)),
        });
        get().addXP(quest.reward.xp);
      },

      unlockAchievement: (id: string) => {
        set({
          achievements: get().achievements.map((a) =>
            a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] } : a
          ),
        });
      },

      setCharacterName: (name: string) => {
        set((state) => ({ character: { ...state.character, name } }));
      },

      resetCharacter: () => {
        set({ character: FRESH_CHARACTER, totalWorkoutsCompleted: 0 });
      },

      resetAll: () => {
        set({
          character: FRESH_CHARACTER,
          achievements: [],
          quests: [],
          totalWorkoutsCompleted: 0,
        });
      },
    }),
    { name: 'prixi-game' }
  )
);
