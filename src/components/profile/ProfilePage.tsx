import { useGameStore } from '../../stores/gameStore';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { StatDisplay } from '../ui/StatDisplay';
import { GlassHeader } from '../ui/GlassHeader';
import { formatDate } from '../../utils/formatters';
import { Shield, Plus, Calendar, Sparkles } from 'lucide-react';

const statMeta: { key: 'power' | 'physique' | 'endurance' | 'discipline'; label: string; icon: string; color: string }[] = [
  { key: 'power', label: 'Power', icon: '⚡', color: 'text-neon-pink' },
  { key: 'physique', label: 'Physique', icon: '🛡️', color: 'text-neon-cyan' },
  { key: 'endurance', label: 'Endurance', icon: '🔥', color: 'text-neon-amber' },
  { key: 'discipline', label: 'Discipline', icon: '💎', color: 'text-neon-purple' },
];

function containerVariants(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const, delay },
    },
  };
}

export function ProfilePage() {
  const character = useGameStore((s) => s.character);
  const achievements = useGameStore((s) => s.achievements);
  const assignStat = useGameStore((s) => s.assignStat);

  const xpPct = Math.min(Math.round((character.xp / character.xpToNext) * 100), 100);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;
  const hasPoints = character.statPoints > 0;

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <motion.div {...containerVariants(0)}>
        <GlassHeader
          title={character.name}
          subtitle={`${character.title} — Level ${character.level}`}
          icon="🛡️"
        />
      </motion.div>

      {/* Level & XP Card */}
      <motion.div {...containerVariants(0.05)}>
        <Card glow className="relative overflow-hidden">
          {/* Decorative scan line */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.3) 2px, rgba(0,240,255,0.3) 4px)',
            }}
          />

          <div className="flex items-center gap-5">
            {/* Level Badge */}
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-cyber-800/80 border border-neon-cyan/20 flex flex-col items-center justify-center neon-glow">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Lv</span>
              <span className="text-3xl font-bold text-neon-cyan leading-none">{character.level}</span>
            </div>

            {/* Title & XP */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{character.title}</h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {character.xp.toLocaleString()} / {character.xpToNext.toLocaleString()} XP
              </p>
              <div className="mt-2">
                <ProgressBar
                  value={character.xp}
                  max={character.xpToNext}
                  size="lg"
                  color="cyan"
                  showValue={false}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-600 font-mono">{xpPct}% to next level</span>
                <span className="text-[10px] text-neon-cyan font-mono">+{character.level * 15} XP / session</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Card */}
      <motion.div {...containerVariants(0.1)}>
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Attributes</h3>
            </div>

            {/* Available Points Badge */}
            <motion.div
              key={character.statPoints}
              initial={hasPoints ? { scale: 1.3 } : undefined}
              animate={{ scale: 1 }}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                hasPoints
                  ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 neon-glow'
                  : 'bg-cyber-700/50 text-gray-500 border-cyber-500'
              }`}
            >
              Available: {character.statPoints}
            </motion.div>
          </div>

          <div className="space-y-3">
            {statMeta.map((stat) => {
              const value = character.stats[stat.key];
              const maxStatValue = 100;
              const canAssign = hasPoints;

              return (
                <div key={stat.key} className="flex items-center gap-3">
                  {/* Stat Icon + Label */}
                  <div className="w-24 flex-shrink-0">
                    <span className="text-xs font-mono text-gray-400">
                      {stat.icon} {stat.label}
                    </span>
                  </div>

                  {/* Stat Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 rounded-full bg-cyber-700/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / maxStatValue) * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              stat.key === 'power'
                                ? 'linear-gradient(90deg, #ff2d78, #ff6b9d)'
                                : stat.key === 'physique'
                                ? 'linear-gradient(90deg, #00f0ff, #66f8ff)'
                                : stat.key === 'endurance'
                                ? 'linear-gradient(90deg, #ffb800, #ffd700)'
                                : 'linear-gradient(90deg, #a855f7, #c084fc)',
                          }}
                        />
                      </div>
                      <span className={`text-sm font-bold font-mono w-8 text-right ${stat.color}`}>
                        {value}
                      </span>
                    </div>
                  </div>

                  {/* Plus Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={canAssign ? { scale: 1.15 } : undefined}
                    onClick={() => assignStat(stat.key)}
                    disabled={!canAssign}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      canAssign
                        ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 neon-glow cursor-pointer hover:bg-neon-cyan/25'
                        : 'bg-cyber-700/30 text-gray-600 border border-cyber-500 cursor-not-allowed'
                    }`}
                    aria-label={`Assign point to ${stat.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Info Row: Join Date + Achievements */}
      <motion.div {...containerVariants(0.15)} className="flex gap-3">
        {/* Join Date Card */}
        <Card className="flex-1" padding="md">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Joined</p>
              <p className="text-sm font-mono text-gray-300">{formatDate(character.joinDate)}</p>
            </div>
          </div>
        </Card>

        {/* Achievements Card */}
        <Card className="flex-1" padding="md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-4 h-4 text-neon-amber" />
              {unlockedCount === totalAchievements && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full"
                />
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Achievements</p>
              <p className="text-sm font-mono text-gray-300">
                <span className="text-neon-amber">{unlockedCount}</span>
                <span className="text-gray-600"> / {totalAchievements}</span>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stat Summary */}
      <motion.div {...containerVariants(0.2)}>
        <Card padding="md">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono mb-3">Stat Summary</h3>
          <div className="grid grid-cols-4 gap-2">
            <StatDisplay label="Power" value={character.stats.power} icon="⚡" color="text-neon-pink" size="sm" />
            <StatDisplay label="Physique" value={character.stats.physique} icon="🛡️" color="text-neon-cyan" size="sm" />
            <StatDisplay label="Endurance" value={character.stats.endurance} icon="🔥" color="text-neon-amber" size="sm" />
            <StatDisplay label="Discipline" value={character.stats.discipline} icon="💎" color="text-neon-purple" size="sm" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
