import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useGameStore } from '../../stores/gameStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useProgressStore } from '../../stores/progressStore';
import { Dumbbell, Zap, ArrowRight, RotateCcw } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  const profile = useUserStore((s) => s.profile);
  const [checking, setChecking] = useState(true);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    // Check if there's saved data after stores hydrate
    const savedProfile = useUserStore.getState().profile;
    const savedCharacter = useGameStore.getState().character;
    setHasSave(!!savedProfile && savedCharacter.level > 1);
    setChecking(false);
  }, []);

  const handleContinue = () => {
    if (profile?.onboarded) {
      navigate('/');
    } else {
      navigate('/onboarding');
    }
  };

  const handleNewGame = () => {
    // Wipe all stores
    useUserStore.getState().resetProfile();
    useGameStore.getState().resetAll();
    useWorkoutStore.getState().resetAll();
    useProgressStore.getState().resetAll();
    navigate('/onboarding');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Dumbbell size={40} className="text-neon-cyan" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo / Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center neon-glow mb-6"
      >
        <Dumbbell size={44} className="text-neon-cyan" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-white mb-2 tracking-tight"
      >
        Prixi
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-500 font-mono mb-1"
      >
        Level up your fitness
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[10px] text-gray-600 font-mono mb-10"
      >
        PPL Training · RPG Progression · Real Results
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs space-y-3"
      >
        {hasSave ? (
          <>
            <button
              onClick={handleContinue}
              className="w-full py-3.5 bg-neon-cyan text-cyber-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neon-cyan/90 transition-all cursor-pointer shadow-lg shadow-neon-cyan/20"
            >
              <Zap size={16} /> Continue Journey
            </button>
            <button
              onClick={handleNewGame}
              className="w-full py-3.5 bg-cyber-800 border border-white/10 text-gray-300 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-cyber-700 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw size={14} /> New Game
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-3.5 bg-neon-cyan text-cyber-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neon-cyan/90 transition-all cursor-pointer shadow-lg shadow-neon-cyan/20"
          >
            Get Started <ArrowRight size={16} />
          </button>
        )}
      </motion.div>

      {/* Version */}
      <p className="absolute bottom-6 text-[9px] text-gray-700 font-mono">v1.0</p>
    </div>
  );
}
