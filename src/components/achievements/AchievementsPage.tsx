import { useGameStore } from '../../stores/gameStore';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { GlassHeader } from '../ui/GlassHeader';
import { Lock } from 'lucide-react';
import { formatDate, getRarityColor } from '../../utils/formatters';

const achievementIcons: Record<string, string> = {
  ach1: '\u{1F4A7}',
  ach2: '\u{1F3C1}',
  ach3: '\u{1F3AE}',
  ach4: '\u{1F3C6}',
  ach5: '\u{1F684}',
  ach6: '\u{1F319}',
  ach7: '\u{26A1}',
  ach8: '\u{1F6E1}\u{FE0F}',
};

const rarityLabels: Record<string, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

export function AchievementsPage() {
  const achievements = useGameStore((s) => s.achievements);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      <GlassHeader
        title="Achievements"
        subtitle={`${unlockedCount}/${achievements.length} unlocked`}
      />

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((ach, index) => {
          const icon = achievementIcons[ach.id] || '\u{1F3C5}';
          const rarityColor = getRarityColor(ach.rarity);
          const rarityClass = ach.rarity === 'legendary' ? 'border-gold/30' : '';

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
            >
              <Card
                hover
                padding="md"
                className={`relative h-full flex flex-col ${rarityClass} ${
                  ach.unlocked ? '' : 'opacity-50 grayscale'
                }`}
              >
                {!ach.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-cyber-900/60 rounded-2xl z-10">
                    <motion.div
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock className="w-6 h-6 text-gray-600" />
                    </motion.div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-2 flex-1">
                  <motion.span
                    className="text-3xl"
                    animate={
                      ach.unlocked
                        ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {icon}
                  </motion.span>

                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        ach.unlocked ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {ach.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight px-1">
                      {ach.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-2 w-full">
                    <span
                      className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${rarityColor}`}
                    >
                      {rarityLabels[ach.rarity]}
                    </span>

                    {ach.unlocked && ach.unlockedAt && (
                      <div className="mt-1.5">
                        <span className="text-[10px] text-neon-cyan font-mono">
                          Unlocked {formatDate(ach.unlockedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
