import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import type { UserProfile } from '../../types';
import { Dumbbell, ArrowRight, ArrowLeft, Check, Ruler, Weight, Heart } from 'lucide-react';
import { Card } from '../ui/Card';

const STEPS = ['Welcome', 'Your Stats', 'Goals', 'Focus Areas', 'Experience', 'Confirm'];

const FOCUS_OPTIONS = [
  { id: 'chest', label: 'Chest', emoji: '🏋️' },
  { id: 'arms', label: 'Arms', emoji: '💪' },
  { id: 'neck', label: 'Neck', emoji: '🦒' },
  { id: 'back', label: 'Back', emoji: '🔱' },
  { id: 'legs', label: 'Legs', emoji: '🦵' },
  { id: 'shoulders', label: 'Shoulders', emoji: '🔺' },
  { id: 'abs', label: 'Core/Abs', emoji: '🔥' },
  { id: 'full_body', label: 'Full Body', emoji: '⚡' },
];

const GOAL_OPTIONS = [
  { id: 'hypertrophy', label: 'Muscle Growth', desc: 'Bigger muscles, better shape', icon: '💪' },
  { id: 'strength', label: 'Strength', desc: 'Lift heavier, get stronger', icon: '🏋️' },
  { id: 'recomposition', label: 'Body Recomp', desc: 'Build muscle, lose fat', icon: '⚖️' },
  { id: 'endurance', label: 'Endurance', desc: 'Train longer, recover faster', icon: '🏃' },
];

const EXP_OPTIONS = [
  { id: 'beginner', label: 'Beginner', desc: '< 6 months training', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: '6 months - 2 years', icon: '🔥' },
  { id: 'advanced', label: 'Advanced', desc: '2+ years training', icon: '⚡' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { setProfile, completeOnboarding } = useUserStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    height: 180,
    weight: 80,
    age: 25,
    gender: 'male' as const,
    focusAreas: ['chest', 'arms', 'neck'] as string[],
    goal: 'hypertrophy' as UserProfile['goal'],
    experience: 'intermediate' as UserProfile['experience'],
  });

  const toggleFocus = (id: string) => {
    setForm((f) => ({
      ...f,
      focusAreas: f.focusAreas.includes(id)
        ? f.focusAreas.filter((x) => x !== id)
        : [...f.focusAreas, id],
    }));
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: form.name || 'Prixi',
      height: form.height,
      weight: form.weight,
      age: form.age,
      gender: form.gender,
      experience: form.experience,
      focusAreas: form.focusAreas,
      goal: form.goal,
      onboarded: false,
    };
    setProfile(profile);
    completeOnboarding();
    navigate('/');
  };

  const canProceed = () => {
    switch (step) {
      case 1: return form.height > 0 && form.weight > 0 && form.age > 0;
      case 3: return form.focusAreas.length > 0;
      default: return true;
    }
  };

  const totalSteps = STEPS.length - 1;

  return (
    <div className="min-h-screen bg-cyber-900 flex flex-col">
      {/* Progress bar */}
      <div className="max-w-lg mx-auto w-full px-4 pt-6 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <Dumbbell className="text-neon-cyan w-5 h-5" />
          <span className="text-sm font-bold text-white">Set Up Prixi</span>
          <span className="ml-auto text-xs text-gray-500 font-mono">Step {step + 1}/{STEPS.length}</span>
        </div>
        <ProgressBar value={step} max={totalSteps} color="cyan" size="sm" />
      </div>

      <div className="max-w-lg mx-auto w-full px-4 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center border border-neon-cyan/30"
                >
                  <Dumbbell className="w-12 h-12 text-neon-cyan" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome to Prixi</h1>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Your personal fitness RPG. Let's set up your profile so I can build the perfect workout plan for you.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { emoji: '📋', label: 'Daily Plans' },
                    { emoji: '📈', label: 'Track Progress' },
                    { emoji: '🎯', label: 'Smart Coaching' },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-xl p-3">
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Your Stats */}
            {step === 1 && (
              <div className="flex-1 space-y-5 py-4">
                <h2 className="text-xl font-bold text-white">Your Stats</h2>
                <p className="text-sm text-gray-400">This helps me calculate your starting weights.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 font-mono mb-1.5 block">Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Prixi"
                      className="w-full bg-cyber-700/50 border border-cyber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 font-mono mb-1.5 block flex items-center gap-1">
                        <Ruler size={12} /> Height (cm)
                      </label>
                      <input
                        type="number"
                        value={form.height}
                        onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                        className="w-full bg-cyber-700/50 border border-cyber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-mono mb-1.5 block flex items-center gap-1">
                        <Weight size={12} /> Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                        className="w-full bg-cyber-700/50 border border-cyber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 font-mono mb-1.5 block">Age</label>
                      <input
                        type="number"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                        className="w-full bg-cyber-700/50 border border-cyber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-mono mb-1.5 block">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                        className="w-full bg-cyber-700/50 border border-cyber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors appearance-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <div className="flex-1 space-y-4 py-4">
                <h2 className="text-xl font-bold text-white">Your Goal</h2>
                <p className="text-sm text-gray-400">What do you want to achieve?</p>
                <div className="space-y-3">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setForm({ ...form, goal: g.id as UserProfile['goal'] })}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                        form.goal === g.id
                          ? 'bg-neon-cyan/10 border-neon-cyan/40 neon-glow'
                          : 'bg-card-bg border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{g.label}</div>
                        <div className="text-xs text-gray-500">{g.desc}</div>
                      </div>
                      {form.goal === g.id && <Check className="ml-auto text-neon-cyan w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Focus Areas */}
            {step === 3 && (
              <div className="flex-1 space-y-4 py-4">
                <h2 className="text-xl font-bold text-white">Focus Areas</h2>
                <p className="text-sm text-gray-400">
                  I'll prioritize these muscle groups. Select all that apply.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {FOCUS_OPTIONS.map((f) => {
                    const selected = form.focusAreas.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFocus(f.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          selected
                            ? 'bg-neon-cyan/10 border-neon-cyan/40 neon-glow'
                            : 'bg-card-bg border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">{f.emoji}</span>
                        <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-400'}`}>
                          {f.label}
                        </span>
                        {selected && <Check className="ml-auto text-neon-cyan w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
                {form.focusAreas.length === 0 && (
                  <p className="text-xs text-neon-pink font-mono">Select at least one focus area</p>
                )}
              </div>
            )}

            {/* Step 4: Experience */}
            {step === 4 && (
              <div className="flex-1 space-y-4 py-4">
                <h2 className="text-xl font-bold text-white">Experience Level</h2>
                <p className="text-sm text-gray-400">This calibrates your starting weights.</p>
                <div className="space-y-3">
                  {EXP_OPTIONS.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setForm({ ...form, experience: e.id as UserProfile['experience'] })}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                        form.experience === e.id
                          ? 'bg-neon-cyan/10 border-neon-cyan/40 neon-glow'
                          : 'bg-card-bg border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">{e.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{e.label}</div>
                        <div className="text-xs text-gray-500">{e.desc}</div>
                      </div>
                      {form.experience === e.id && <Check className="ml-auto text-neon-cyan w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {step === 5 && (
              <div className="flex-1 space-y-5 py-4">
                <h2 className="text-xl font-bold text-white">Ready to Go!</h2>
                <p className="text-sm text-gray-400">Here's your profile summary:</p>
                <Card className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">Name</span>
                      <p className="text-sm text-white font-semibold">{form.name || 'Prixi'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">Goal</span>
                      <p className="text-sm text-white font-semibold capitalize">{form.goal}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">Height/Weight</span>
                      <p className="text-sm text-white font-semibold">{form.height}cm / {form.weight}kg</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">Experience</span>
                      <p className="text-sm text-white font-semibold capitalize">{form.experience}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Focus Areas</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {form.focusAreas.map((f) => (
                        <span key={f} className="text-xs bg-neon-cyan/10 text-neon-cyan px-2 py-0.5 rounded-full">
                          {FOCUS_OPTIONS.find(o => o.id === f)?.emoji} {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
                <div className="glass rounded-xl p-4 text-sm text-gray-400">
                  <Heart className="w-4 h-4 text-neon-pink inline mr-1" />
                  I'll generate a personalized PPL split prioritizing your focus areas.
                  Your starting weights are calibrated to your experience level.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 py-6">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => setStep(step - 1)} icon={<ArrowLeft size={16} />}>
              Back
            </Button>
          ) : <div />}
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              icon={<ArrowRight size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinish} icon={<Check size={16} />}>
              Start Your Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

