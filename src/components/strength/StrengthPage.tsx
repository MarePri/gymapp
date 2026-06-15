import { useUserStore } from '../../stores/userStore';
import { useProgressStore } from '../../stores/progressStore';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { GlassHeader } from '../ui/GlassHeader';
import { Trophy, Target, Zap } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const exerciseIcons: Record<string, string> = {
  'Barbell Bench Press': '🏋️',
  'Barbell Squat': '🦵',
  'Deadlift': '🔱',
  'Standing OHP': '🔺',
  'Barbell Row': '🔗',
  'Lat Pulldown': '⬇️',
  'Barbell Curl': '💪',
  'Leg Press': '🦿',
  'Close-Grip Bench Press': '🔽',
  'Incline Dumbbell Press': '📈',
  'Romanian Deadlift': '🏋️',
};

type Level = 'beginner' | 'intermediate' | 'advanced';

const levelColors: Record<Level, { text: string; bg: string; bar: string }> = {
  beginner: { text: 'text-neon-cyan', bg: 'bg-neon-cyan/10', bar: 'bg-neon-cyan' },
  intermediate: { text: 'text-neon-green', bg: 'bg-neon-green/10', bar: 'bg-neon-green' },
  advanced: { text: 'text-neon-amber', bg: 'bg-neon-amber/10', bar: 'bg-neon-amber' },
};

export function StrengthPage() {
  const { standards, profile } = useUserStore();
  const { strengthRecords } = useProgressStore();

  const getLevel = (current: number, beginner: number, intermediate: number): Level => {
    if (current >= intermediate) return 'advanced';
    if (current >= beginner) return 'intermediate';
    return 'beginner';
  };

  const getProgressToNext = (current: number, level: Level, beginner: number, intermediate: number, advanced: number): number => {
    if (level === 'beginner') return Math.min(100, (current / beginner) * 100);
    if (level === 'intermediate') return Math.min(100, (current / intermediate) * 100);
    return Math.min(100, (current / advanced) * 100);
  };

  if (!profile) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Strength Benchmarks" subtitle="Set up your profile first" />
        <Card className="text-center py-8">
          <Target size={32} className="mx-auto mb-2 text-gray-600" />
          <p className="text-sm text-gray-400">Complete onboarding to see your benchmarks</p>
        </Card>
      </div>
    );
  }

  const prs = strengthRecords.filter(r => r.isPR).slice(0, 5);

  return (
    <div className="space-y-4 pb-4">
      <GlassHeader
        title="Strength Benchmarks"
        subtitle={`Based on ${profile.weight}kg bodyweight · ${profile.experience}`}
      />

      {/* Standards */}
      <div className="space-y-2">
        {standards.slice(0, 8).map((std, i) => {
          const level = getLevel(std.current, std.beginner, std.intermediate);
          const colors = levelColors[level];
          const progress = getProgressToNext(std.current, level, std.beginner, std.intermediate, std.advanced);

          return (
            <motion.div
              key={std.exercise}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card padding="sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{exerciseIcons[std.exercise] || '🏋️'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-white truncate">{std.exercise}</h3>
                      <span className={`text-xs font-bold font-mono ${colors.text}`}>{std.current}kg</span>
                    </div>

                    {/* Progress bar to next level */}
                    <div className="mt-1 h-1.5 bg-cyber-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        className={`h-full rounded-full ${colors.bar}`}
                        style={{ opacity: 0.6 }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <span className={`text-[9px] font-mono ${colors.text}`}>
                        {level} (goal: {level === 'beginner' ? `${std.beginner}kg` : level === 'intermediate' ? `${std.intermediate}kg` : `${std.advanced}kg`})
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono">
                        Next: {std.nextMilestone}kg
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress explanation */}
      <Card className="text-xs text-gray-500 space-y-1">
        <p><span className="text-neon-cyan">●</span> Beginner — Focus on form, progressive overload</p>
        <p><span className="text-neon-green">●</span> Intermediate — Good foundation, push harder</p>
        <p><span className="text-neon-amber">●</span> Advanced — Strong! Aim for PRs</p>
      </Card>

      {/* Recent PRs */}
      {prs.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Trophy size={14} className="text-neon-amber" /> Recent PRs
          </h2>
          <div className="space-y-1.5">
            {prs.map((pr, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-cyber-700/20">
                <span className="text-gray-300 font-medium">{pr.exercise}</span>
                <span className="text-neon-amber font-mono">{pr.weight}kg × {pr.reps}</span>
                <span className="text-gray-500 font-mono text-[10px]">{formatDate(pr.date)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How to progress */}
      <Card className="text-center py-3">
        <Zap size={16} className="mx-auto mb-1 text-neon-cyan" />
        <p className="text-xs text-gray-300">Double progression: Hit target reps → Increase weight</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Rate workouts to auto-adjust weights</p>
      </Card>
    </div>
  );
}
