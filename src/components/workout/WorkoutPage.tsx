import { useState, useEffect, useCallback } from 'react';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { GlassHeader } from '../ui/GlassHeader';
import { Dumbbell, CheckCircle, Timer, ArrowLeft, Zap, Trophy } from 'lucide-react';

function formatElapsed(startTime: string): string {
  const elapsed = Date.now() - new Date(startTime).getTime();
  const totalSeconds = Math.floor(elapsed / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

function getMissionColor(type: string): string {
  switch (type) {
    case 'armor':
      return 'border-l-neon-cyan';
    case 'strength':
      return 'border-l-neon-pink';
    case 'engine':
      return 'border-l-neon-green';
    case 'arena':
      return 'border-l-neon-amber';
    default:
      return 'border-l-neon-cyan';
  }
}

function getMissionGlow(type: string): string {
  switch (type) {
    case 'armor':
      return 'shadow-[0_0_20px_rgba(0,240,255,0.1)]';
    case 'strength':
      return 'shadow-[0_0_20px_rgba(255,45,120,0.1)]';
    case 'engine':
      return 'shadow-[0_0_20px_rgba(34,255,136,0.1)]';
    case 'arena':
      return 'shadow-[0_0_20px_rgba(255,184,0,0.1)]';
    default:
      return '';
  }
}

function getExerciseProgress(exercises: { sets: { completed: boolean }[] }[]): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  for (const ex of exercises) {
    for (const set of ex.sets) {
      total += 1;
      if (set.completed) completed += 1;
    }
  }
  return { completed, total };
}

interface SummaryData {
  xpEarned: number;
  duration: string;
  setsCompleted: number;
  totalSets: number;
}

export function WorkoutPage() {
  const navigate = useNavigate();
  const { activeSession, completeSet, completeExercise, completeWorkout, cancelWorkout } =
    useWorkoutStore();

  const [elapsed, setElapsed] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  // Update timer every second while session is active
  useEffect(() => {
    if (!activeSession || activeSession.completed) return;
    setElapsed(formatElapsed(activeSession.startTime));
    const interval = setInterval(() => {
      setElapsed(formatElapsed(activeSession!.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.startTime, activeSession?.completed, activeSession]);

  const handleCompleteWorkout = useCallback(() => {
    if (!activeSession) return;
    const xp = completeWorkout();
    const { completed, total } = getExerciseProgress(activeSession.exercises);
    const duration = formatElapsed(activeSession.startTime);

    setSummaryData({
      xpEarned: xp,
      duration,
      setsCompleted: completed,
      totalSets: total,
    });
    setShowSummary(true);
  }, [activeSession, completeWorkout]);

  const handleCancel = useCallback(() => {
    cancelWorkout();
    navigate('/missions');
  }, [cancelWorkout, navigate]);

  // Empty state — no active session
  if (!activeSession) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Workout" subtitle="Active Session" icon="💪" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-cyber-700/50 flex items-center justify-center border border-white/5">
              <Dumbbell className="w-10 h-10 text-gray-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyber-600 border border-white/5 flex items-center justify-center">
              <span className="text-xs text-gray-400">?</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Active Workout</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-xs">
            Select a mission to begin your training session
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={<SwordsIcon />}
            onClick={() => navigate('/missions')}
          >
            Browse Missions
          </Button>
        </motion.div>
      </div>
    );
  }

  const { completed, total } = getExerciseProgress(activeSession.exercises);

  // Summary overlay after workout completion
  if (showSummary && summaryData) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <GlassHeader title="Mission Complete!" subtitle={activeSession.missionName} icon="🏆" />

          <Card padding="lg" glow>
            <div className="flex flex-col items-center text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-amber/20 to-neon-cyan/20 flex items-center justify-center mb-4 border border-neon-amber/30"
              >
                <Trophy className="w-10 h-10 text-gold" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-1 mb-6"
              >
                <span className="text-4xl font-bold text-gradient-gold">
                  +{summaryData.xpEarned} XP
                </span>
                <p className="text-gray-400 text-sm">{activeSession.missionName}</p>
              </motion.div>

              <div className="grid grid-cols-3 gap-6 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <Timer className="w-5 h-5 text-neon-cyan mb-1" />
                  <span className="text-lg font-bold text-white">{summaryData.duration}</span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    Duration
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle className="w-5 h-5 text-neon-green mb-1" />
                  <span className="text-lg font-bold text-white">
                    {summaryData.setsCompleted}/{summaryData.totalSets}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    Sets Done
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <Zap className="w-5 h-5 text-neon-purple mb-1" />
                  <span className="text-lg font-bold text-white">{activeSession.missionType}</span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    Type
                  </span>
                </motion.div>
              </div>
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/missions')}
            >
              Back to Missions
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Active workout view
  return (
    <div className="space-y-4">
      {/* Header */}
      <GlassHeader
        title={activeSession.missionName}
        subtitle="Active Workout"
        icon="💪"
        action={
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-neon-pink transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Cancel
          </button>
        }
      />

      {/* Timer + Progress */}
      <Card padding="md" glow>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyber-700/50 flex items-center justify-center">
              <Timer className="w-4 h-4 text-neon-cyan" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                Elapsed Time
              </span>
              <p className="text-lg font-bold text-white font-mono">{elapsed || '0m 0s'}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
              Progress
            </span>
            <p className="text-lg font-bold text-white">
              {completed}/{total}
            </p>
          </div>
        </div>
        <ProgressBar value={completed} max={total} color="cyan" size="md" />
      </Card>

      {/* Exercises */}
      <div className="space-y-3">
        {activeSession.exercises.map((exercise, idx) => {
          const exSetsCompleted = exercise.sets.filter((s) => s.completed).length;
          const allSetsDone = exSetsCompleted === exercise.sets.length;

          return (
            <motion.div
              key={exercise.exerciseId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Card
                padding="md"
                className={`border-l-2 ${getMissionColor(activeSession.missionType)} ${getMissionGlow(activeSession.missionType)}`}
              >
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyber-700/50 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{exercise.exerciseName}</h3>
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                        {exercise.muscleGroup} · {exSetsCompleted}/{exercise.sets.length} sets
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={exSetsCompleted}
                    max={exercise.sets.length}
                    color={activeSession.missionType === 'armor' ? 'cyan' : activeSession.missionType === 'strength' ? 'pink' : activeSession.missionType === 'engine' ? 'green' : 'amber'}
                    size="sm"
                    className="w-20"
                  />
                </div>

                {/* Sets */}
                <div className="space-y-2 mb-3">
                  {exercise.sets.map((set, setIdx) => (
                    <motion.div
                      key={set.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!set.completed) completeSet(exercise.exerciseId, set.id);
                      }}
                      className={`
                        flex items-center justify-between p-2.5 rounded-xl cursor-pointer
                        transition-all duration-200
                        ${set.completed
                          ? 'bg-neon-green/5 border border-neon-green/20'
                          : 'bg-cyber-700/30 border border-white/5 hover:border-neon-cyan/20 hover:bg-cyber-600/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-5 h-5 rounded-md border flex items-center justify-center
                            transition-all duration-200
                            ${set.completed
                              ? 'bg-neon-green border-neon-green text-white'
                              : 'border-gray-600 hover:border-neon-cyan'
                            }
                          `}
                        >
                          {set.completed && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span className="text-xs text-gray-400 font-mono w-12">Set {setIdx + 1}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-white">
                          {set.weight}
                          <span className="text-xs text-gray-500 font-normal ml-0.5">kg</span>
                        </span>
                        <span className="text-gray-400 text-xs">×</span>
                        <span className="text-sm font-semibold text-white">{set.reps}</span>
                        {set.rpe != null && (
                          <span className="text-[10px] text-gray-500 font-mono">
                            @{set.rpe}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Complete Exercise Button */}
                {!allSetsDone && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => completeExercise(exercise.exerciseId)}
                  >
                    Complete Exercise
                  </Button>
                )}
                {allSetsDone && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-neon-green font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    All sets completed
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Complete Workout Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-2 mb-4"
          icon={<Zap className="w-5 h-5" />}
          onClick={handleCompleteWorkout}
        >
          Complete Workout
        </Button>
      </motion.div>
    </div>
  );
}

function SwordsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
    </svg>
  );
}
