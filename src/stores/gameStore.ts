import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, Achievement, Quest } from '../types';
import { DEFAULT_CHARACTER, MOCK_ACHIEVEMENTS, MOCK_QUESTS, LEVEL_THRESHOLDS } from '../data/mockData';

interface GameState {
  character: Character;
  achievements: Achievement[];
  quests: Quest[];
  addXP: (amount: number) => void;
  addStatPoints: (amount: number) => void;
  assignStat: (stat: keyof Character['stats']) => void;
  completeQuest: (questId: string) => void;
  checkLevelUp: () => string | null;
  unlockAchievement: (id: string) => void;
  setCharacterName: (name: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: DEFAULT_CHARACTER,
      achievements: MOCK_ACHIEVEMENTS,
      quests: MOCK_QUESTS,

      addXP: (amount: number) => {
        set((state) => {
          let { xp, xpToNext, level } = state.character;
          xp += amount;
          let leveledUp = false;
          while (xp >= xpToNext) {
            xp -= xpToNext;
            level += 1;
            const threshold = LEVEL_THRESHOLDS[level - 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
            xpToNext = threshold.xpRequired;
            leveledUp = true;
          }
          return {
            character: {
              ...state.character,
              xp,
              xpToNext,
              level,
              title: (LEVEL_THRESHOLDS[level - 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]).title,
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

      completeQuest: (questId: string) => {
        const quest = get().quests.find((q) => q.id === questId);
        if (!quest || quest.completed) return;
        set({
          quests: get().quests.map((q) => (q.id === questId ? { ...q, completed: true, progress: q.target } : q)),
        });
        get().addXP(quest.reward.xp);
      },

      checkLevelUp: () => {
        return null;
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
    }),
    { name: 'prixi-game' }
  )
);
