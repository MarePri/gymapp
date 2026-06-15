import { useEffect } from 'react';
import { useWorkoutStore } from '../../stores/workoutStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GlassHeader } from '../ui/GlassHeader';
import { CheckCircle, ArrowRight, Dumbbell, Star, RotateCcw, ChevronDown, Flame } from 'lucide-react';

const dayIcons = ['🔥', '⚡', '🦵', '💪', '🔱', '🏋️'];

export function MissionsPage() {
  const { missions, isLoading, refreshMissions, startWorkout, uncompleteMission } = useWorkoutStore();
  const navigate = useNavigate();

  useEffect(() => {
    refreshMissions();
  }, []);

  const handleStart = (id: string) => {
    startWorkout(id);
    navigate('/workout');
  };

  const handleRedo = (id: string) => {
    uncompleteMission(id);
    startWorkout(id);
    navigate('/workout');
  };

  const incomplete = missions.filter((m) => !m.completed);
  const completed = missions.filter((m) => m.completed);

  // The next mission = today's (marked with 🔥) or the first incomplete
  const nextMission = incomplete.find((m) => m.name.startsWith('🔥')) || incomplete[0];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Daily Plan" subtitle="Loading your workouts..." />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-card-bg rounded-2xl h-24 border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <GlassHeader
        title="Today's Workout"
        subtitle={`${completed.length} completed · ${incomplete.length} remaining`}
      />

      {/* ─── Next / Incomplete Missions ─── */}
      {incomplete.length > 0 && (
        <div className="space-y-3">
          {incomplete.map((mission, i) => {
            const isNext = mission.id === nextMission?.id;
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  hover
                  className={`relative overflow-hidden ${isNext ? 'border-neon-cyan/30 neon-glow' : ''}`}
                >
                  {isNext && <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan" />}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      isNext ? 'bg-neon-cyan/10' : 'bg-cyber-700/50'
                    }`}>
                      {isNext ? <Flame size={18} className="text-neon-cyan" /> : dayIcons[i % dayIcons.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-white">
                          {mission.name.replace('🔥 Today: ', '')}
                        </h3>
                        {isNext && (
                          <span className="text-[10px] text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded-full font-mono">
                            NEXT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">{mission.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                        <span className="text-neon-cyan">
                          <Star size={10} className="inline mr-0.5" />+{mission.xpReward} XP
                        </span>
                        <span className="text-gray-500">{mission.exercises.length} exercises</span>
                        {mission.dayNumber && (
                          <span className="text-gray-500">Day {mission.dayNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="primary" onClick={() => handleStart(mission.id)}>
                        Go <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── Empty State ─── */}
      {missions.length === 0 && !isLoading && (
        <Card className="text-center py-8">
          <Dumbbell size={32} className="mx-auto mb-2 text-gray-600" />
          <p className="text-sm text-gray-400">No workouts generated yet.</p>
          <p className="text-xs text-gray-600 mt-1">Set up your profile first.</p>
          <Button variant="secondary" className="mt-3" onClick={() => navigate('/onboarding')}>
            Set Up Profile
          </Button>
        </Card>
      )}

      {/* ─── All caught up ─── */}
      {incomplete.length === 0 && missions.length > 0 && (
        <Card className="text-center py-8 border-neon-green/20">
          <CheckCircle size={32} className="mx-auto mb-2 text-neon-green" />
          <h2 className="text-sm font-semibold text-white mb-1">All Done!</h2>
          <p className="text-xs text-gray-400 mb-3">You've completed every workout. Come back tomorrow for more.</p>
          <Button variant="ghost" size="sm" onClick={refreshMissions}>
            Refresh
          </Button>
        </Card>
      )}

      {/* ─── Completed Workouts ─── */}
      {completed.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <ChevronDown size={14} className="text-gray-500" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Completed ({completed.length})
            </h2>
          </div>
          <div className="space-y-2">
            {completed.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card padding="sm" className="opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">✅</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-400 line-through truncate">
                        {mission.name.replace('🔥 Today: ', '')}
                      </h3>
                      <p className="text-[10px] text-gray-600 font-mono capitalize">{mission.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleRedo(mission.id)}
                        className="text-[10px] bg-cyber-700/50 hover:bg-neon-cyan/20 text-gray-500 hover:text-neon-cyan px-2 py-1 rounded-lg font-mono flex items-center gap-1 transition-all cursor-pointer"
                        title="Redo this workout"
                      >
                        <RotateCcw size={10} /> Redo
                      </motion.button>
                      <span className="text-[10px] text-neon-green font-mono flex items-center gap-1">
                        <CheckCircle size={10} /> Done
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Refresh hint ─── */}
      {missions.length > 0 && (
        <div className="text-center pt-1">
          <button
            onClick={refreshMissions}
            className="text-[10px] text-gray-600 hover:text-gray-400 font-mono transition-colors cursor-pointer"
          >
            Refresh plan
          </button>
        </div>
      )}
    </div>
  );
}
