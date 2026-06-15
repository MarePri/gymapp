import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { GlassHeader } from '../ui/GlassHeader';
import { Dumbbell, CheckCircle, Timer, ArrowLeft, Zap, Trophy, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import type { DifficultyRating } from '../../types';

export function WorkoutPage() {
  const { activeSession, completeSet, completeExercise, completeWorkout, cancelWorkout } = useWorkoutStore();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [rating, setRating] = useState<DifficultyRating | null>(null);

  useEffect(() => {
    if (!activeSession) return;
    const start = new Date(activeSession.startTime).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    setShowRating(true);
  };

  const handleRateAndFinish = (r: DifficultyRating) => {
    setRating(r);
    const xp = completeWorkout(r);
    setXpEarned(xp);
    setShowRating(false);
    setShowSummary(true);
  };

  if (!activeSession) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Workout" subtitle="No active session" />
        <Card className="text-center py-12">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Dumbbell size={48} className="mx-auto mb-4 text-gray-600" />
          </motion.div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">No Active Workout</h2>
          <p className="text-sm text-gray-500 mb-4">Start a mission from the Daily Plan</p>
          <Button onClick={() => navigate('/missions')}>Go to Daily Plan</Button>
        </Card>
      </div>
    );
  }

  const totalSets = activeSession.exercises.reduce((a, e) => a + e.sets.length, 0);
  const completedSets = activeSession.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0);

  return (
    <div className="space-y-4 pb-4">
      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-card-bg border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center"
            >
              <Trophy size={40} className="mx-auto mb-3 text-neon-amber" />
              <h2 className="text-lg font-bold text-white mb-1">Great Work!</h2>
              <p className="text-sm text-gray-400 mb-5">How was this workout?</p>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handleRateAndFinish('easy')}
                  className="flex-1 p-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-center hover:bg-neon-green/20 transition-all cursor-pointer"
                >
                  <ThumbsUp className="w-6 h-6 text-neon-green mx-auto mb-1" />
                  <span className="text-xs text-neon-green font-semibold">Easy</span>
                </button>
                <button
                  onClick={() => handleRateAndFinish('medium')}
                  className="flex-1 p-4 rounded-xl bg-neon-amber/10 border border-neon-amber/30 text-center hover:bg-neon-amber/20 transition-all cursor-pointer"
                >
                  <Minus className="w-6 h-6 text-neon-amber mx-auto mb-1" />
                  <span className="text-xs text-neon-amber font-semibold">Medium</span>
                </button>
                <button
                  onClick={() => handleRateAndFinish('hard')}
                  className="flex-1 p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-center hover:bg-neon-pink/20 transition-all cursor-pointer"
                >
                  <ThumbsDown className="w-6 h-6 text-neon-pink mx-auto mb-1" />
                  <span className="text-xs text-neon-pink font-semibold">Hard</span>
                </button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRateAndFinish('medium')}>Skip rating</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card-bg border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center"
            >
              <Trophy size={48} className="mx-auto mb-2 text-neon-amber" />
              <h2 className="text-xl font-bold text-white mb-1">Mission Complete!</h2>
              <p className="text-3xl font-bold text-neon-cyan my-3">+{xpEarned} XP</p>
              
              {rating && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xs text-gray-400">Rated:</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    rating === 'easy' ? 'bg-neon-green/10 text-neon-green' :
                    rating === 'medium' ? 'bg-neon-amber/10 text-neon-amber' :
                    'bg-neon-pink/10 text-neon-pink'
                  }`}>
                    {rating === 'easy' ? 'Easy' : rating === 'medium' ? 'Medium' : 'Hard'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-xl p-2">
                  <Timer size={14} className="mx-auto text-neon-cyan mb-1" />
                  <span className="text-sm font-bold text-white">{formatTime(elapsed)}</span>
                  <span className="text-[10px] block text-gray-500 font-mono">Duration</span>
                </div>
                <div className="glass rounded-xl p-2">
                  <CheckCircle size={14} className="mx-auto text-neon-green mb-1" />
                  <span className="text-sm font-bold text-white">{completedSets}/{totalSets}</span>
                  <span className="text-[10px] block text-gray-500 font-mono">Sets</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" fullWidth onClick={() => { setShowSummary(false); navigate('/missions'); }}>
                  Next Mission
                </Button>
                <Button fullWidth onClick={() => { setShowSummary(false); navigate('/strength'); }}>
                  Benchmarks
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => { cancelWorkout(); navigate('/missions'); }} className="p-1 text-gray-400 hover:text-white cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">{activeSession.missionName}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <Timer size={12} /> {formatTime(elapsed)}
            <span className="text-gray-600">|</span>
            <span>{completedSets}/{totalSets} sets</span>
          </div>
        </div>
      </div>

      <ProgressBar value={completedSets} max={totalSets} color="cyan" size="sm" />

      {/* Exercises */}
      <div className="space-y-3">
        {activeSession.exercises.map((ex) => {
          const allComplete = ex.sets.every(s => s.completed);
          return (
            <Card key={ex.exerciseId} className={allComplete ? 'border-neon-green/20' : ''}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm text-white">{ex.exerciseName}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">{ex.muscleGroup}</span>
                </div>
                {allComplete && <CheckCircle size={16} className="text-neon-green" />}
              </div>
              {ex.notes && <p className="text-[10px] text-gray-600 font-mono mb-2">{ex.notes}</p>}
              <div className="space-y-1.5">
                {ex.sets.map((set) => (
                  <div key={set.id} className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                    set.completed ? 'bg-neon-green/5' : 'bg-cyber-700/30'
                  }`}>
                    <span className="text-gray-500 font-mono text-xs w-14">Set {ex.sets.indexOf(set) + 1}</span>
                    <span className="text-gray-300 font-mono">{set.weight}kg × {set.reps}</span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => completeSet(ex.exerciseId, set.id)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        set.completed ? 'bg-neon-green/20 text-neon-green' : 'bg-cyber-600/50 text-gray-500 hover:text-white'
                      }`}
                    >
                      <CheckCircle size={16} />
                    </motion.button>
                  </div>
                ))}
              </div>
              {!allComplete && (
                <Button size="sm" variant="ghost" className="mt-2 w-full" onClick={() => completeExercise(ex.exerciseId)}>
                  Complete All Sets
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Complete Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="primary" size="lg" fullWidth onClick={handleComplete} icon={<Zap size={18} />}>
          Complete Workout
        </Button>
      </motion.div>
    </div>
  );
}
