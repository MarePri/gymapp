import { useWorkoutStore } from '../../stores/workoutStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GlassHeader } from '../ui/GlassHeader';
import { Shield, Zap, Flame, Trophy, CheckCircle, ArrowRight, Star } from 'lucide-react';

const missionTypeMeta: Record<string, { icon: string; color: string; gradient: string; lucideIcon: React.ReactNode }> = {
  armor: {
    icon: '🛡️',
    color: 'text-neon-cyan',
    gradient: 'from-neon-cyan/20 to-transparent',
    lucideIcon: <Shield className="w-4 h-4" />,
  },
  strength: {
    icon: '⚡',
    color: 'text-neon-pink',
    gradient: 'from-neon-pink/20 to-transparent',
    lucideIcon: <Zap className="w-4 h-4" />,
  },
  engine: {
    icon: '🔥',
    color: 'text-neon-amber',
    gradient: 'from-neon-amber/20 to-transparent',
    lucideIcon: <Flame className="w-4 h-4" />,
  },
  arena: {
    icon: '🏆',
    color: 'text-gold',
    gradient: 'from-gold/20 to-transparent',
    lucideIcon: <Trophy className="w-4 h-4" />,
  },
};

const statLabelMap: Record<string, string> = {
  power: 'Power',
  physique: 'Physique',
  endurance: 'Endurance',
  discipline: 'Discipline',
};

const typeNameMap: Record<string, string> = {
  armor: 'Armor',
  strength: 'Strength',
  engine: 'Engine',
  arena: 'Arena',
};

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

export function MissionsPage() {
  const missions = useWorkoutStore((s) => s.missions);
  const navigate = useNavigate();

  const handleStartMission = (missionId: string) => {
    useWorkoutStore.getState().startWorkout(missionId);
    navigate('/workout');
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <motion.div {...containerVariants(0)}>
        <GlassHeader
          title="Missions"
          subtitle="Choose your next workout"
          icon="🏆"
        />
      </motion.div>

      {/* Mission Cards */}
      {missions.map((mission, index) => {
        const meta = missionTypeMeta[mission.type] || missionTypeMeta.armor;
        const isCompleted = mission.completed;

        return (
          <motion.div key={mission.id} {...containerVariants(0.05 + index * 0.05)}>
            <Card
              padding="lg"
              className={`relative overflow-hidden ${isCompleted ? 'opacity-80' : ''}`}
              hover={!isCompleted}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${meta.gradient} opacity-30`}
              />

              {/* Completed overlay badge */}
              {isCompleted && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                  <CheckCircle className="w-3.5 h-3.5 text-neon-green" />
                  <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-wider">
                    Completed
                  </span>
                </div>
              )}

              {/* Card header: type icon + name */}
              <div className="flex items-start gap-3 mb-3">
                {/* Type icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl bg-cyber-800/80 border border-white/5 flex items-center justify-center text-lg ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  {meta.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold text-white truncate ${isCompleted ? 'line-through decoration-neon-green/50' : ''}`}>
                      {mission.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {mission.description}
                  </p>
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${meta.color}`}>
                    {typeNameMap[mission.type] || mission.type} • {mission.exercises.length} exercises
                  </span>
                </div>
              </div>

              {/* Rewards row */}
              <div className="flex items-center gap-3 mb-4">
                {/* XP Reward */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-cyan/8 border border-neon-cyan/15">
                  <Star className="w-3 h-3 text-neon-cyan" />
                  <span className="text-xs font-mono font-bold text-neon-cyan">
                    {mission.xpReward} XP
                  </span>
                </div>

                {/* Stat Rewards */}
                {mission.statRewards &&
                  Object.entries(mission.statRewards).map(([stat, value]) => (
                    <div
                      key={stat}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyber-700/40 border border-cyber-500"
                    >
                      <span className="text-xs font-mono text-gray-400">
                        {statLabelMap[stat] || stat}
                      </span>
                      <span className="text-xs font-mono font-bold text-neon-green">+{value}</span>
                    </div>
                  ))}
              </div>

              {/* Action button */}
              {isCompleted ? (
                <Button variant="secondary" size="sm" disabled fullWidth>
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleStartMission(mission.id)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Mission
                </Button>
              )}
            </Card>
          </motion.div>
        );
      })}

      {/* Empty state */}
      {missions.length === 0 && (
        <motion.div {...containerVariants(0.1)}>
          <Card padding="lg" className="text-center py-8">
            <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-mono">No missions available</p>
            <p className="text-xs text-gray-600 font-mono mt-1">Complete workouts to unlock new missions</p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
