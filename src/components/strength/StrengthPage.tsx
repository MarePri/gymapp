import { useMemo } from 'react';
import { useProgressStore } from '../../stores/progressStore';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { GlassHeader } from '../ui/GlassHeader';
import { Trophy, TrendingUp, Dumbbell } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const EXERCISE_COLORS: Record<string, { border: string; bg: string; text: string; glow: string; accent: string }> = {
  'Bench Press': {
    border: 'border-l-neon-cyan',
    bg: 'bg-neon-cyan/5',
    text: 'text-neon-cyan',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.08)]',
    accent: 'neon-cyan',
  },
  'Squat': {
    border: 'border-l-neon-green',
    bg: 'bg-neon-green/5',
    text: 'text-neon-green',
    glow: 'shadow-[0_0_20px_rgba(34,255,136,0.08)]',
    accent: 'neon-green',
  },
  'Deadlift': {
    border: 'border-l-neon-purple',
    bg: 'bg-neon-purple/5',
    text: 'text-neon-purple',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]',
    accent: 'neon-purple',
  },
  'Overhead Press': {
    border: 'border-l-neon-amber',
    bg: 'bg-neon-amber/5',
    text: 'text-neon-amber',
    glow: 'shadow-[0_0_20px_rgba(255,184,0,0.08)]',
    accent: 'neon-amber',
  },
};

function getExerciseColor(exercise: string) {
  return EXERCISE_COLORS[exercise] ?? {
    border: 'border-l-cyan-500',
    bg: 'bg-cyan-500/5',
    text: 'text-cyan-400',
    glow: '',
    accent: 'cyan',
  };
}

function getExerciseIcon(exercise: string): string {
  const name = exercise.toLowerCase();
  if (name.includes('bench')) return '🏋️';
  if (name.includes('squat')) return '🦵';
  if (name.includes('deadlift')) return '🔗';
  if (name.includes('press')) return '⬆️';
  return '💪';
}

function isBigThree(exercise: string): boolean {
  const name = exercise.toLowerCase();
  return name.includes('bench') || name.includes('squat') || name.includes('deadlift');
}

export function StrengthPage() {
  const { strengthRecords, progressHistory } = useProgressStore();

  // Get only PR records for the top section
  const prRecords = useMemo(() => {
    return strengthRecords.filter((r) => r.isPR);
  }, [strengthRecords]);

  // Get the best non-PR records for "recent progress"
  const recentProgress = useMemo(() => {
    // Flatten history entries into a timeline of strength records
    const historyEntries: { date: string; exercise: string; weight: number; reps: number; estimated1RM: number; isPR: boolean }[] = [];

    for (const entry of progressHistory) {
      for (const record of entry.strengthRecords) {
        historyEntries.push({
          date: entry.date,
          exercise: record.exercise,
          weight: record.weight,
          reps: record.reps,
          estimated1RM: record.estimated1RM,
          isPR: record.isPR,
        });
      }
    }

    // Also include non-PR records from strengthRecords that aren't in history
    for (const record of strengthRecords) {
      if (!record.isPR && !historyEntries.some((h) => h.date === record.date && h.exercise === record.exercise)) {
        historyEntries.push({
          date: record.date,
          exercise: record.exercise,
          weight: record.weight,
          reps: record.reps,
          estimated1RM: record.estimated1RM,
          isPR: record.isPR,
        });
      }
    }

    // Sort by date descending
    historyEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Remove PR records from recent (they're shown above)
    return historyEntries.filter((e) => !e.isPR).slice(0, 10);
  }, [strengthRecords, progressHistory]);

  return (
    <div className="space-y-4">
      <GlassHeader title="Strength Records" subtitle="Personal Records" icon="🏆" />

      {/* PR Grid */}
      <div className="grid grid-cols-1 gap-3">
        {prRecords.length === 0 && (
          <Card padding="md" className="text-center py-8">
            <div className="flex flex-col items-center gap-2">
              <Trophy className="w-8 h-8 text-gray-500" />
              <p className="text-gray-400 text-sm">No personal records yet. Start lifting!</p>
            </div>
          </Card>
        )}

        {prRecords.map((record, idx) => {
          const colors = getExerciseColor(record.exercise);
          return (
            <motion.div
              key={`${record.exercise}-${record.date}-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Card
                padding="md"
                className={`border-l-2 ${colors.border} ${colors.glow} relative overflow-hidden`}
              >
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${colors.bg} blur-3xl -mr-10 -mt-10 pointer-events-none`} />

                <div className="relative z-10">
                  {/* Top row: Exercise name + PR badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                        <span className="text-lg">{getExerciseIcon(record.exercise)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{record.exercise}</h3>
                        {isBigThree(record.exercise) && (
                          <span className="text-[10px] text-gray-500 font-mono">Big 3</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neon-amber/10 border border-neon-amber/20 rounded-lg px-2 py-1">
                      <Trophy className="w-3 h-3 text-gold" />
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">PR</span>
                    </div>
                  </div>

                  {/* Weight / Reps display */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-3xl font-bold ${colors.text}`}>
                      {record.weight}
                    </span>
                    <span className="text-sm text-gray-400">kg</span>
                    <span className="text-lg text-gray-500">×</span>
                    <span className="text-xl font-semibold text-white">{record.reps}</span>
                    <span className="text-sm text-gray-400">
                      {record.reps === 1 ? 'rep' : 'reps'}
                    </span>
                  </div>

                  {/* e1RM */}
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-400 font-mono">
                      Estimated 1RM: <span className="text-white font-semibold">{record.estimated1RM}</span> kg
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-[10px] text-gray-600 font-mono mt-2 block">
                    {formatDate(record.date)}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Progress */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Progress</h2>
        </div>

        {recentProgress.length === 0 && (
          <Card padding="md" className="text-center py-6">
            <p className="text-gray-500 text-sm">No progress history yet.</p>
          </Card>
        )}

        <div className="space-y-2">
          {recentProgress.map((entry, idx) => {
            const colors = getExerciseColor(entry.exercise);
            return (
              <motion.div
                key={`progress-${entry.exercise}-${entry.date}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * idx }}
              >
                <Card padding="sm" className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Exercise icon */}
                    <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{getExerciseIcon(entry.exercise)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{entry.exercise}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                    <span className="text-sm font-semibold text-white">
                      {entry.weight}
                      <span className="text-xs text-gray-500 font-normal ml-0.5">kg</span>
                    </span>
                    <span className="text-gray-500 text-xs">×</span>
                    <span className="text-sm font-semibold text-white">{entry.reps}</span>
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] text-gray-500 font-mono">e1RM</span>
                      <p className="text-xs font-semibold text-gray-300">{entry.estimated1RM}kg</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <Card padding="sm" className="mt-4">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>
            {strengthRecords.length} total records · {prRecords.length} personal records
          </span>
        </div>
      </Card>
    </div>
  );
}
