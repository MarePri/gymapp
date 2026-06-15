import { useState, useEffect, useMemo } from 'react';
import { useWorkoutStore } from '../../stores/workoutStore';
import type { ProgressionSuggestion } from '../../stores/workoutStore';
import { useUserStore } from '../../stores/userStore';
import { useGameStore } from '../../stores/gameStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { GlassHeader } from '../ui/GlassHeader';
import {
  Dumbbell, CheckCircle, Timer, ArrowLeft, Zap, Trophy, ThumbsUp,
  Minus, ThumbsDown, Plus, X, Flame, Star, Target, Trash2, Edit3,
  ChevronUp, Search, BookmarkPlus,
} from 'lucide-react';
import type { DifficultyRating } from '../../types';
import { ALL_EXERCISES, MUSCLE_GROUPS, searchExercises } from '../../data/exercises';
import type { ExerciseOption } from '../../data/exercises';

export function WorkoutPage() {
  const {
    activeSession, completeSet, completeExercise, completeWorkout,
    cancelWorkout, startFreeWorkout, addExerciseToSession, updateSet,
    removeExercise, pendingProgression, applyProgression, applyAllProgression,
    dismissProgression,
  } = useWorkoutStore();
  const character = useGameStore((s) => s.character);
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [rating, setRating] = useState<DifficultyRating | null>(null);
  const [prevLevel, setPrevLevel] = useState(character.level);

  // User custom exercises
  const customExercises = useUserStore((s) => s.customExercises);
  const addCustomExercise = useUserStore((s) => s.addCustomExercise);
  const removeCustomExercise = useUserStore((s) => s.removeCustomExercise);

  // Merge default + custom exercises
  const allExercises = useMemo(() => {
    const merged = [...ALL_EXERCISES];
    customExercises.forEach((ce) => {
      if (!merged.some((e) => e.name === ce.name)) {
        merged.push(ce);
      }
    });
    return merged;
  }, [customExercises]);

  // Free workout builder state
  const [showFreeBuilder, setShowFreeBuilder] = useState(false);
  const [freeExName, setFreeExName] = useState('');
  const [freeExMuscle, setFreeExMuscle] = useState('Chest');
  const [freeExSets, setFreeExSets] = useState(3);
  const [freeExReps, setFreeExReps] = useState(10);
  const [freeExWeight, setFreeExWeight] = useState(20);
  const [freeExercises, setFreeExercises] = useState<{ name: string; muscleGroup: string; sets: number; reps: number; weight: number }[]>([]);
  const [showExPicker, setShowExPicker] = useState(false);
  const [exSearch, setExSearch] = useState('');
  const [exFilterGroup, setExFilterGroup] = useState<string>('');
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExGroup, setNewExGroup] = useState('Chest');
  const [newExEquip, setNewExEquip] = useState('');

  // Inline editing for sets
  const [editingSet, setEditingSet] = useState<{ exerciseId: string; setId: string } | null>(null);
  const [editWeight, setEditWeight] = useState(0);
  const [editReps, setEditReps] = useState(0);

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
    setPrevLevel(character.level);
    setShowRating(true);
  };

  const handleRateAndFinish = (r: DifficultyRating) => {
    setRating(r);
    const result = completeWorkout(r);
    setXpEarned(result.xp);
    setShowRating(false);
    setShowSummary(true);
  };

  const leveledUp = character.level > prevLevel;

  const addFreeExercise = () => {
    if (!freeExName.trim()) return;
    setFreeExercises([...freeExercises, { name: freeExName.trim(), muscleGroup: freeExMuscle, sets: freeExSets, reps: freeExReps, weight: freeExWeight }]);
    setFreeExName('');
    setShowExPicker(false);
  };

  const pickExercise = (name: string, muscle: string) => {
    setFreeExName(name);
    setFreeExMuscle(muscle);
    setShowExPicker(false);
  };

  const launchFreeWorkout = () => {
    if (freeExercises.length === 0) return;
    startFreeWorkout(freeExercises);
    setShowFreeBuilder(false);
    setFreeExercises([]);
  };

  // ─── No active session → Show landing ───────────────────
  if (!activeSession) {
    return (
      <div className="space-y-4 pb-4">
        <GlassHeader title="Workout" subtitle="Start a new session" />
        <Card className="text-center py-12">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Dumbbell size={48} className="mx-auto mb-4 text-gray-600" />
          </motion.div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Ready to Train?</h2>
          <p className="text-sm text-gray-500 mb-6">Start a mission from the plan or build your own workout</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button onClick={() => navigate('/missions')} icon={<Target size={16} />}>
              Daily Missions
            </Button>
            <Button variant="secondary" onClick={() => setShowFreeBuilder(true)} icon={<Plus size={16} />}>
              Free Workout
            </Button>
          </div>
        </Card>

        {/* Free Workout Builder Modal */}
        <AnimatePresence>
          {showFreeBuilder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card-bg border border-white/10 rounded-3xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Build Free Workout</h2>
                  <button onClick={() => setShowFreeBuilder(false)} className="text-gray-500 hover:text-white cursor-pointer p-1">
                    <X size={18} />
                  </button>
                </div>

                {/* Added exercises */}
                <div className="space-y-2 mb-4">
                  {freeExercises.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4">No exercises yet. Add your first one below.</p>
                  )}
                  {freeExercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between bg-cyber-700/30 rounded-xl p-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{ex.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{ex.muscleGroup} · {ex.sets}×{ex.reps} @ {ex.weight}kg</p>
                      </div>
                      <button
                        onClick={() => setFreeExercises(freeExercises.filter((_, j) => j !== i))}
                        className="p-1 text-gray-500 hover:text-neon-pink cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add exercise form */}
                <div className="bg-cyber-700/20 rounded-2xl p-3 space-y-2.5 mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase">Add Exercise</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={exSearch || freeExName}
                      onChange={(e) => { setExSearch(e.target.value); setFreeExName(e.target.value); setShowExPicker(true); }}
                      onFocus={() => setShowExPicker(true)}
                      placeholder="Search or type exercise name..."
                      className="w-full bg-cyber-700/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-neon-cyan/40"
                    />
                    {showExPicker && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-cyber-700 border border-white/10 rounded-xl max-h-48 overflow-y-auto z-10">
                        {/* Muscle group filter chips */}
                        <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-white/5">
                          <button
                            onClick={() => setExFilterGroup('')}
                            className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                              !exFilterGroup ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            All
                          </button>
                          {['Chest','Back','Legs','Shoulders','Biceps','Triceps','Core','Neck','Calves','Glutes','Hamstrings','Forearms'].map((g) => (
                            <button
                              key={g}
                              onClick={() => setExFilterGroup(g === exFilterGroup ? '' : g)}
                              className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                                exFilterGroup === g ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                        <div className="overflow-y-auto max-h-32">
                          {allExercises
                            .filter(e => !exFilterGroup || e.muscleGroup === exFilterGroup)
                            .filter(e => e.name.toLowerCase().includes((exSearch || freeExName).toLowerCase()))
                            .slice(0, 10)
                            .map((e) => (
                              <button
                                key={e.name}
                                onClick={() => pickExercise(e.name, e.muscleGroup)}
                                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-neon-cyan/10 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                              >
                                <span className="font-medium truncate">{e.name}</span>
                                <span className="text-gray-500 flex-shrink-0 ml-2">
                                  {e.muscleGroup}{e.equipment ? ` · ${e.equipment}` : ''}
                                </span>
                              </button>
                            ))}
                          {/* Create custom option */}
                          {freeExName.trim() && !allExercises.some(e => e.name.toLowerCase() === freeExName.toLowerCase()) && (
                            <button
                              onClick={() => {
                                setNewExName(freeExName.trim());
                                setNewExGroup(freeExMuscle);
                                setShowCreateExercise(true);
                                setShowExPicker(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neon-cyan hover:bg-neon-cyan/10 transition-colors cursor-pointer flex items-center gap-2 border-t border-white/5"
                            >
                              <BookmarkPlus size={12} />
                              Create "{freeExName.trim()}" as custom exercise
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 font-mono block mb-0.5">Sets</label>
                      <select
                        value={freeExSets}
                        onChange={(e) => setFreeExSets(Number(e.target.value))}
                        className="w-full bg-cyber-700/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-mono block mb-0.5">Reps</label>
                      <select
                        value={freeExReps}
                        onChange={(e) => setFreeExReps(Number(e.target.value))}
                        className="w-full bg-cyber-700/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        {[3,4,5,6,8,10,12,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-mono block mb-0.5">Weight (kg)</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={freeExWeight}
                        onChange={(e) => setFreeExWeight(Number(e.target.value))}
                        className="w-full bg-cyber-700/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addFreeExercise}
                    disabled={!freeExName.trim()}
                    className="w-full py-2 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded-xl text-xs font-semibold hover:bg-neon-cyan/20 transition-all disabled:opacity-30 cursor-pointer"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" fullWidth onClick={() => { setShowFreeBuilder(false); setFreeExercises([]); }}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={launchFreeWorkout}
                    disabled={freeExercises.length === 0}
                    icon={<Zap size={14} />}
                  >
                    Start Workout
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Custom Exercise Modal */}
        <AnimatePresence>
          {showCreateExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                className="bg-card-bg border border-white/10 rounded-3xl p-5 max-w-sm w-full"
              >
                <h2 className="text-base font-bold text-white mb-3">Create Custom Exercise</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-0.5">Exercise Name</label>
                    <input
                      type="text"
                      value={newExName}
                      onChange={(e) => setNewExName(e.target.value)}
                      placeholder="e.g. Cable Crunch"
                      className="w-full bg-cyber-700/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-neon-cyan/40"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-0.5">Muscle Group</label>
                    <select
                      value={newExGroup}
                      onChange={(e) => setNewExGroup(e.target.value)}
                      className="w-full bg-cyber-700/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                    >
                      {MUSCLE_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-0.5">Equipment (optional)</label>
                    <input
                      type="text"
                      value={newExEquip}
                      onChange={(e) => setNewExEquip(e.target.value)}
                      placeholder="e.g. Dumbbell, Cable, Barbell"
                      className="w-full bg-cyber-700/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-neon-cyan/40"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" fullWidth onClick={() => { setShowCreateExercise(false); setShowExPicker(true); }}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    disabled={!newExName.trim()}
                    onClick={() => {
                      addCustomExercise({
                        name: newExName.trim(),
                        muscleGroup: newExGroup,
                        equipment: newExEquip.trim() || undefined,
                      });
                      setFreeExName(newExName.trim());
                      setFreeExMuscle(newExGroup);
                      setShowCreateExercise(false);
                      setShowExPicker(false);
                    }}
                  >
                    Save Exercise
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Active session ─────────────────────────────────────
  const totalSets = activeSession.exercises.reduce((a, e) => a + e.sets.length, 0);
  const completedSets = activeSession.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0);
  const isFreeWorkout = activeSession.missionId === 'free-workout';

  const startEditSet = (exerciseId: string, setId: string, weight: number, reps: number) => {
    setEditingSet({ exerciseId, setId });
    setEditWeight(weight);
    setEditReps(reps);
  };

  const saveEditSet = () => {
    if (!editingSet) return;
    updateSet(editingSet.exerciseId, editingSet.setId, { weight: editWeight, reps: editReps });
    setEditingSet(null);
  };

  // Get muscle group volume
  const muscleVolume = activeSession.exercises.reduce<Record<string, number>>((acc, ex) => {
    const completed = ex.sets.filter(s => s.completed).length;
    acc[ex.muscleGroup] = (acc[ex.muscleGroup] || 0) + completed;
    return acc;
  }, {});

  return (
    <div className="space-y-4 pb-4">
      {/* ─── Rating Modal ─── */}
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
              <Button variant="ghost" size="sm" onClick={() => handleRateAndFinish('medium')}>
                Skip & Finish
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Enhanced Summary Modal ─── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-card-bg border border-white/10 rounded-3xl p-6 max-w-sm w-full"
            >
              {/* Level up celebration */}
              {leveledUp && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-2"
                >
                  <span className="text-4xl">🎉</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-4 right-4 text-neon-amber/20"
                  >
                    <Star size={40} />
                  </motion.div>
                </motion.div>
              )}

              <div className="text-center">
                <Trophy size={36} className={`mx-auto mb-1 ${leveledUp ? 'text-neon-amber' : 'text-neon-cyan'}`} />
                <h2 className="text-xl font-bold text-white">
                  {leveledUp ? `LEVEL UP! Lv.${character.level}` : 'Mission Complete!'}
                </h2>
                {leveledUp && (
                  <p className="text-xs text-neon-amber font-semibold mt-0.5">{character.title}</p>
                )}
              </div>

              {/* XP Display with progress ring */}
              <div className="flex items-center justify-center gap-4 my-4">
                <div className="text-center">
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-3xl font-bold text-neon-cyan"
                  >
                    +{xpEarned}
                  </motion.p>
                  <p className="text-[10px] text-gray-500 font-mono">XP EARNED</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-sm font-bold text-white font-mono">{character.xp}/{character.xpToNext}</p>
                  <p className="text-[10px] text-gray-500 font-mono">TO NEXT LEVEL</p>
                </div>
              </div>

              <ProgressBar value={character.xp} max={character.xpToNext} color="cyan" size="sm" />

              {/* Stats gained */}
              <div className="flex gap-2 mt-4 mb-3">
                {[
                  { key: 'power', label: '⚡', gain: 1 },
                  { key: 'physique', label: '🛡️', gain: 1 },
                  { key: 'endurance', label: '🔥', gain: 1 },
                  { key: 'discipline', label: '💎', gain: 2 },
                ].map((s) => (
                  <div key={s.key} className="flex-1 glass rounded-xl p-2 text-center">
                    <div className="text-xs mb-0.5">{s.label}</div>
                    <motion.div
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[10px] text-neon-green font-mono"
                    >
                      +{s.gain}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Duration & Sets */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1 glass rounded-xl p-2.5 text-center">
                  <Timer size={14} className="mx-auto text-neon-cyan mb-1" />
                  <span className="text-base font-bold text-white">{formatTime(elapsed)}</span>
                  <span className="text-[10px] block text-gray-500 font-mono">Duration</span>
                </div>
                <div className="flex-1 glass rounded-xl p-2.5 text-center">
                  <CheckCircle size={14} className="mx-auto text-neon-green mb-1" />
                  <span className="text-base font-bold text-white">{completedSets}/{totalSets}</span>
                  <span className="text-[10px] block text-gray-500 font-mono">Sets Done</span>
                </div>
              </div>

              {/* Muscle group volume */}
              {Object.keys(muscleVolume).length > 0 && (
                <div className="bg-cyber-700/20 rounded-xl p-3 mb-3">
                  <p className="text-[10px] text-gray-500 font-mono mb-1.5">Muscle Volume (sets)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(muscleVolume).sort((a, b) => b[1] - a[1]).map(([group, sets]) => (
                      <span key={group} className="text-[10px] bg-cyber-600/50 text-gray-300 px-2 py-0.5 rounded-full font-mono">
                        {group} ×{sets}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Progression Check */}
              {pendingProgression && pendingProgression.length > 0 && (
                <div className="bg-cyber-700/20 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-neon-cyan font-mono flex items-center gap-1">
                      <ChevronUp size={10} /> Progression Ready
                    </p>
                    <button
                      onClick={applyAllProgression}
                      className="text-[9px] text-neon-green hover:text-white font-mono bg-neon-green/10 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      Apply All
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {pendingProgression.map((p) => (
                      <div key={p.exercise} className="flex items-center justify-between bg-cyber-600/30 rounded-lg p-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-white font-medium truncate">{p.exercise}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {p.current}kg → <span className="text-neon-cyan">{p.suggested}kg</span>
                          </p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => applyProgression(p.exercise, p.suggested)}
                          className="text-[10px] bg-neon-cyan/10 text-neon-cyan px-2 py-1 rounded-lg font-mono hover:bg-neon-cyan/20 transition-all cursor-pointer flex-shrink-0"
                        >
                          Apply
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={dismissProgression}
                    className="w-full text-[10px] text-gray-500 hover:text-gray-300 font-mono mt-1.5 text-center transition-colors cursor-pointer"
                  >
                    Dismiss all
                  </button>
                </div>
              )}

              {/* Rating recap */}
              {rating && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[10px] text-gray-500 font-mono">Rated:</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    rating === 'easy' ? 'bg-neon-green/10 text-neon-green' :
                    rating === 'medium' ? 'bg-neon-amber/10 text-neon-amber' :
                    'bg-neon-pink/10 text-neon-pink'
                  }`}>
                    {rating === 'easy' ? 'Easy' : rating === 'medium' ? 'Medium' : 'Hard'}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <Button variant="secondary" fullWidth onClick={() => { setShowSummary(false); navigate('/missions'); }}>
                  Next Mission
                </Button>
                <Button fullWidth onClick={() => { setShowSummary(false); navigate('/strength'); }}>
                  Benchmarks
                </Button>
              </div>

              {/* Free workout: back to home */}
              {isFreeWorkout && (
                <Button variant="ghost" size="sm" fullWidth className="mt-2" onClick={() => { setShowSummary(false); }}>
                  Done
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Workout Header ─── */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => { cancelWorkout(); isFreeWorkout ? navigate('/workout') : navigate('/missions'); }}
          className="p-1 text-gray-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">{activeSession.missionName}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <Timer size={12} /> {formatTime(elapsed)}
            <span className="text-gray-600">|</span>
            <span>{completedSets}/{totalSets} sets</span>
            {isFreeWorkout && <span className="text-neon-cyan text-[10px]">FREE</span>}
          </div>
        </div>
      </div>

      <ProgressBar value={completedSets} max={totalSets} color="cyan" size="sm" />

      {/* ─── Exercises ─── */}
      <div className="space-y-3">
        {activeSession.exercises.map((ex) => {
          const allComplete = ex.sets.every(s => s.completed);
          return (
            <Card key={ex.exerciseId} className={allComplete ? 'border-neon-green/20' : ''}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-white truncate">{ex.exerciseName}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">{ex.muscleGroup}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {allComplete && <CheckCircle size={14} className="text-neon-green" />}
                  {isFreeWorkout && (
                    <button
                      onClick={() => removeExercise(ex.exerciseId)}
                      className="p-1 text-gray-500 hover:text-neon-pink cursor-pointer"
                      title="Remove exercise"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              {ex.notes && <p className="text-[10px] text-gray-600 font-mono mb-2">{ex.notes}</p>}
              <div className="space-y-1.5">
                {ex.sets.map((set) => {
                  const isEditing = editingSet?.setId === set.id && editingSet?.exerciseId === ex.exerciseId;
                  return (
                    <div key={set.id} className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                      set.completed ? 'bg-neon-green/5' : 'bg-cyber-700/30'
                    }`}>
                      <span className="text-gray-500 font-mono text-xs w-14">Set {ex.sets.indexOf(set) + 1}</span>

                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={editWeight}
                            onChange={(e) => setEditWeight(Number(e.target.value))}
                            className="w-14 bg-cyber-600 border border-neon-cyan/30 rounded px-1 py-0.5 text-xs text-white text-right"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEditSet(); if (e.key === 'Escape') setEditingSet(null); }}
                          />
                          <span className="text-[10px] text-gray-500">kg</span>
                          <input
                            type="number"
                            value={editReps}
                            onChange={(e) => setEditReps(Number(e.target.value))}
                            className="w-10 bg-cyber-600 border border-neon-cyan/30 rounded px-1 py-0.5 text-xs text-white text-right"
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEditSet(); if (e.key === 'Escape') setEditingSet(null); }}
                          />
                          <button onClick={saveEditSet} className="p-0.5 text-neon-green cursor-pointer">
                            <CheckCircle size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-300 font-mono">
                          {set.weight}kg × {set.reps}
                          {set.rpe && <span className="text-gray-500 text-[10px] ml-1">@{set.rpe}</span>}
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        {!set.completed && !isEditing && (
                          <button
                            onClick={() => startEditSet(ex.exerciseId, set.id, set.weight, set.reps)}
                            className="p-1 text-gray-500 hover:text-neon-cyan cursor-pointer"
                            title="Edit set"
                          >
                            <Edit3 size={11} />
                          </button>
                        )}
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
                    </div>
                  );
                })}
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

      {/* ─── Add exercise to free workout ─── */}
      {isFreeWorkout && (
        <Card padding="sm">
          <button
            onClick={() => setShowExPicker(!showExPicker)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer"
          >
            <Plus size={14} /> Add Exercise
          </button>

          <AnimatePresence>
            {showExPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Search */}
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={exSearch}
                    onChange={(e) => setExSearch(e.target.value)}
                    placeholder="Search exercises..."
                    className="w-full bg-cyber-700/50 border border-white/10 rounded-xl pl-7 pr-3 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:border-neon-cyan/40"
                  />
                </div>
                {/* Muscle group filter chips */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <button
                    onClick={() => setExFilterGroup('')}
                    className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                      !exFilterGroup ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {['Chest','Back','Legs','Shoulders','Biceps','Triceps','Core','Neck','Calves','Glutes','Hamstrings','Forearms'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setExFilterGroup(g === exFilterGroup ? '' : g)}
                      className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        exFilterGroup === g ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {allExercises
                    .filter(e => !exFilterGroup || e.muscleGroup === exFilterGroup)
                    .filter(e => e.name.toLowerCase().includes(exSearch.toLowerCase()))
                    .sort((a, b) => a.muscleGroup.localeCompare(b.muscleGroup))
                    .map((ex) => (
                      <button
                        key={ex.name}
                        onClick={() => {
                          const id = `${ex.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
                          addExerciseToSession({
                            exerciseId: id,
                            exerciseName: ex.name,
                            muscleGroup: ex.muscleGroup,
                            sets: Array.from({ length: 3 }, (_, si) => ({
                              id: `${id}-s${si}`,
                              weight: 20,
                              reps: 10,
                              completed: false,
                            })),
                          });
                          setShowExPicker(false);
                          setExSearch('');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-neon-cyan/10 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-medium truncate">{ex.name}</span>
                        <span className="text-gray-500 flex-shrink-0 ml-1">
                          {ex.muscleGroup}{ex.equipment ? ` · ${ex.equipment}` : ''}
                        </span>
                      </button>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* ─── Complete Button ─── */}
      {completedSets > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="primary" size="lg" fullWidth onClick={handleComplete} icon={<Zap size={18} />}>
            Complete Workout
          </Button>
        </motion.div>
      )}
    </div>
  );
}
