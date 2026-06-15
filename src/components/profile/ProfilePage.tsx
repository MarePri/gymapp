import { useGameStore } from '../../stores/gameStore';
import { useUserStore } from '../../stores/userStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { GlassHeader } from '../ui/GlassHeader';
import { Shield, Plus, User, Weight, Ruler, Settings, Flame, Dumbbell } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const statConfig: { key: 'power' | 'physique' | 'endurance' | 'discipline'; label: string; icon: string; color: string; bar: 'cyan' | 'pink' | 'green' | 'purple' }[] = [
  { key: 'power', label: 'Power', icon: '⚡', color: 'text-neon-pink', bar: 'cyan' },
  { key: 'physique', label: 'Physique', icon: '🛡️', color: 'text-neon-cyan', bar: 'pink' },
  { key: 'endurance', label: 'Endurance', icon: '🔥', color: 'text-neon-amber', bar: 'green' },
  { key: 'discipline', label: 'Discipline', icon: '💎', color: 'text-neon-purple', bar: 'purple' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.character);
  const achievements = useGameStore((s) => s.achievements);
  const totalWorkoutsCompleted = useGameStore((s) => s.totalWorkoutsCompleted);
  const assignStat = useGameStore((s) => s.assignStat);
  const profile = useUserStore((s) => s.profile);
  const sessionHistory = useWorkoutStore((s) => s.sessionHistory);

  // Compute streak: count consecutive unique days going back from today
  const computeStreak = (): number => {
    const workoutDates = [
      ...new Set(
        sessionHistory
          .filter((s) => s.completed)
          .map((s) => s.startTime.split('T')[0])
      ),
    ].sort((a, b) => b.localeCompare(a)); // newest first

    if (workoutDates.length === 0) return 0;

    let streak = 1;
    const today = new Date().toISOString().split('T')[0];

    // Check if most recent workout was today or yesterday
    const mostRecent = workoutDates[0];
    const diff = Math.floor(
      (new Date(today).getTime() - new Date(mostRecent).getTime()) / 86400000
    );
    if (diff > 1) return 0;
    // diff === 0 means latest is today; diff === 1 means latest is yesterday

    for (let i = 1; i < workoutDates.length; i++) {
      const prev = new Date(workoutDates[i - 1]);
      const curr = new Date(workoutDates[i]);
      const dayDiff = Math.floor(
        (prev.getTime() - curr.getTime()) / 86400000
      );
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = computeStreak();

  const xpPct = Math.min(Math.round((character.xp / character.xpToNext) * 100), 100);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (!profile) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Profile" subtitle="Set up your profile" />
        <Card className="text-center py-8">
          <User size={40} className="mx-auto mb-2 text-gray-600" />
          <p className="text-sm text-gray-400 mb-4">Complete onboarding to start</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-4 py-2 bg-neon-cyan text-cyber-900 rounded-xl font-semibold text-sm"
          >
            Set Up Profile
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <GlassHeader
        title={profile.name || 'Prixi'}
        subtitle={`Lv.${character.level} ${character.title}`}
        action={
          <button onClick={() => navigate('/onboarding')} className="p-2 text-gray-400 hover:text-white cursor-pointer">
            <Settings size={16} />
          </button>
        }
      />

      {/* Character Card */}
      <Card glow className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent rounded-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyber-800 border border-neon-cyan/20 flex flex-col items-center justify-center neon-glow flex-shrink-0">
            <span className="text-[8px] text-gray-500 font-mono">LV</span>
            <span className="text-2xl font-bold text-neon-cyan leading-none">{character.level}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white">{character.title}</h2>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1"><Weight size={10} /> {profile.weight}kg</span>
              <span className="flex items-center gap-1"><Ruler size={10} /> {profile.height}cm</span>
              <span className="capitalize">{profile.goal}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={character.xp} max={character.xpToNext} label="XP" showValue color="cyan" size="md" />
              <div className="text-[10px] text-gray-600 font-mono mt-0.5">{xpPct}% to next level</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Shield size={14} className="text-neon-cyan" /> Attributes
          </h2>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            character.statPoints > 0 ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-gray-500'
          }`}>
            {character.statPoints} pts
          </span>
        </div>
        <div className="space-y-2.5">
          {statConfig.map((stat) => (
            <div key={stat.key} className="flex items-center gap-2">
              <div className="w-20 text-xs text-gray-400 font-mono flex items-center gap-1">
                <span>{stat.icon}</span> {stat.label}
              </div>
              <div className="flex-1">
                <ProgressBar value={character.stats[stat.key]} max={50} color={stat.bar} size="sm" />
              </div>
              <span className={`text-sm font-bold font-mono w-6 text-right ${stat.color}`}>
                {character.stats[stat.key]}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => assignStat(stat.key)}
                disabled={character.statPoints <= 0}
                className={`p-1 rounded-lg transition-all ${
                  character.statPoints > 0
                    ? 'bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 cursor-pointer'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                <Plus size={12} />
              </motion.button>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-[10px] text-gray-500 font-mono uppercase">Joined</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatDate(character.joinDate)}</div>
        </Card>
        <Card>
          <div className="text-[10px] text-gray-500 font-mono uppercase">Focus</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.focusAreas.slice(0, 3).map((f) => (
              <span key={f} className="text-[9px] bg-neon-cyan/10 text-neon-cyan px-1.5 py-0.5 rounded-full">{f}</span>
            ))}
            {profile.focusAreas.length > 3 && <span className="text-[9px] text-gray-500">+{profile.focusAreas.length - 3}</span>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-1">
            <Dumbbell size={10} /> Workouts
          </div>
          <div className="text-lg font-bold text-neon-cyan">{totalWorkoutsCompleted}</div>
        </Card>
        <Card>
          <div className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-1">
            <Flame size={10} /> Streak
          </div>
          <div className={`text-lg font-bold ${streak > 0 ? 'text-neon-amber' : 'text-gray-500'}`}>
            {streak > 0 ? `${streak} days` : '—'}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-[10px] text-gray-500 font-mono uppercase">Achievements</div>
          <div className="text-lg font-bold text-neon-amber">{unlockedCount}/{achievements.length}</div>
        </Card>
        <Card>
          <div className="text-[10px] text-gray-500 font-mono uppercase">Goal</div>
          <div className="text-sm font-bold text-neon-green capitalize mt-1">{profile.goal}</div>
        </Card>
      </div>
    </div>
  );
}
