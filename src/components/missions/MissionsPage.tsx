import { useEffect } from 'react';
import { useWorkoutStore } from '../../stores/workoutStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GlassHeader } from '../ui/GlassHeader';
import { CheckCircle, ArrowRight, Dumbbell, Star } from 'lucide-react';

const dayIcons = ['🔥', '⚡', '🦵', '💪', '🔱', '🏋️'];

export function MissionsPage() {
  const { missions, isLoading, refreshMissions, startWorkout } = useWorkoutStore();
  const navigate = useNavigate();

  useEffect(() => {
    refreshMissions();
  }, []);

  const handleStart = (id: string) => {
    startWorkout(id);
    navigate('/workout');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Daily Plan" subtitle="Loading your workouts..." />
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse bg-card-bg rounded-2xl h-24 border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <GlassHeader
        title="Weekly Plan"
        subtitle={`${missions.filter(m => m.completed).length}/${missions.length} completed`}
        action={
          <Button size="sm" variant="ghost" onClick={refreshMissions}>
            Refresh
          </Button>
        }
      />

      {missions.map((mission, i) => {
        const isToday = mission.name.startsWith('🔥');
        return (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              hover={!mission.completed}
              className={`relative overflow-hidden ${mission.completed ? 'opacity-60' : ''} ${isToday ? 'border-neon-cyan/30 neon-glow' : ''}`}
            >
              {isToday && (
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan" />
              )}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  mission.completed ? 'bg-neon-green/10' : isToday ? 'bg-neon-cyan/10' : 'bg-cyber-700/50'
                }`}>
                  {mission.completed ? '✅' : dayIcons[i % dayIcons.length]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-sm ${mission.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {isToday ? mission.name.replace('🔥 Today: ', '') : mission.name}
                    </h3>
                    {isToday && !mission.completed && (
                      <span className="text-[10px] text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded-full font-mono">TODAY</span>
                    )}
                    {mission.completed && (
                      <span className="text-[10px] text-neon-green font-mono">Done</span>
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
                  {mission.completed ? (
                    <span className="text-xs text-neon-green font-mono flex items-center gap-1">
                      <CheckCircle size={12} /> Done
                    </span>
                  ) : (
                    <Button size="sm" variant="primary" onClick={() => handleStart(mission.id)}>
                      Go <ArrowRight size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}

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
    </div>
  );
}
