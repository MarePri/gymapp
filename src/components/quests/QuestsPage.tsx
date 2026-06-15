import { useGameStore } from '../../stores/gameStore';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { GlassHeader } from '../ui/GlassHeader';
import { CheckCircle, Zap, Trophy, Weight, Calendar, Target, Swords } from 'lucide-react';

const questIcons: Record<string, React.ReactNode> = {
  strength: <Trophy size={18} />,
  weight: <Weight size={18} />,
  consistency: <Calendar size={18} />,
  pr: <Zap size={18} />,
  volume: <Swords size={18} />,
};

const questColors: Record<string, { color: string; bg: string; bar: 'cyan' | 'pink' | 'green' | 'amber' | 'purple' }> = {
  strength: { color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', bar: 'cyan' },
  weight: { color: 'text-neon-green', bg: 'bg-neon-green/10', bar: 'green' },
  consistency: { color: 'text-neon-purple', bg: 'bg-neon-purple/10', bar: 'purple' },
  pr: { color: 'text-neon-amber', bg: 'bg-neon-amber/10', bar: 'amber' },
  volume: { color: 'text-neon-pink', bg: 'bg-neon-pink/10', bar: 'pink' },
};

export function QuestsPage() {
  const quests = useGameStore((s) => s.quests);

  return (
    <div className="space-y-4">
      <GlassHeader title="Quests" subtitle="Challenges to conquer" icon="📜" />

      {quests.map((quest, i) => {
        const style = questColors[quest.type] || questColors.strength;
        const progressPct = Math.min(Math.round((quest.progress / quest.target) * 100), 100);

        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={quest.completed ? 'border-neon-green/20' : ''}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${style.bg} ${style.color}`}>
                  {questIcons[quest.type] || <Target size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-white">{quest.name}</h3>
                    {quest.completed && (
                      <span className="flex items-center gap-1 text-[10px] text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded-full">
                        <CheckCircle size={10} /> Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{quest.description}</p>
                  <div className="mt-2">
                    <ProgressBar
                      value={quest.progress}
                      max={quest.target}
                      label={quest.objective}
                      showValue
                      color={style.bar}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono text-neon-cyan">
                    <Zap size={12} /> +{quest.reward.xp} XP
                    {quest.reward.title && (
                      <span className="text-neon-amber">🏅 "{quest.reward.title}"</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-bold font-mono ${quest.completed ? 'text-neon-green' : style.color}`}>
                    {progressPct}%
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {quest.completed ? 'Complete' : 'In Progress'}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
