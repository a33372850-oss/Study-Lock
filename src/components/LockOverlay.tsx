import React, { useState } from 'react';
import { ShieldAlert, BookOpen, ArrowLeft, AlertTriangle } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../utils/constants';

interface LockOverlayProps {
  blockedAppName: string;
  remainingSeconds: number;
  onDismiss: () => void;
  onEmergencyUnlock: () => void;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({
  blockedAppName,
  remainingSeconds,
  onDismiss,
  onEmergencyUnlock,
}) => {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Strict math challenge to prevent impulsive unlocking: e.g., 37 + 58 = 95
  const num1 = 38;
  const num2 = 47;
  const expectedAnswer = (num1 + num2).toString();

  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyEmergency = () => {
    if (mathAnswer.trim() === expectedAnswer) {
      onEmergencyUnlock();
      setShowEmergencyDialog(false);
    } else {
      setErrorMsg('Incorrect answer. Focus protection remains active!');
    }
  };

  const quote = MOTIVATIONAL_QUOTES[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-[#090616] via-[#120E2C] to-[#251854] text-white p-6 sm:p-8 animate-in fade-in duration-200">
      {/* Top System Bar Simulation */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span className="font-medium text-slate-300">ANDROID SYSTEM ACCESSIBILITY BLOCKER</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span>STRICT LOCK RUNNING</span>
        </div>
      </div>

      {/* Main Lock Card */}
      <div className="my-auto max-w-lg mx-auto w-full text-center">
        {/* Glowing App Icon Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-[#7000FF]/30 blur-2xl rounded-full" />
          <div className="relative w-24 h-24 rounded-3xl bg-[#1B1445] border border-[#7000FF]/50 flex items-center justify-center shadow-2xl shadow-[#7000FF]/30">
            <span className="text-5xl select-none animate-bounce">📚</span>
          </div>
        </div>

        {/* Primary Hindi Warning (Exact text required) */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3 leading-snug">
          अभी पढ़ाई का समय है!
          <span className="block text-[#00F5D4] mt-1 text-xl sm:text-2xl">अपने भविष्य पर ध्यान दो।</span>
        </h1>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium mb-6">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Access blocked for: <strong>{blockedAppName}</strong></span>
        </div>

        {/* Timer Box */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
            Study Session Remaining Time
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono-numbers text-white tracking-tight">
            {formatTime(remainingSeconds)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            This app is restricted until your scheduled focus timer ends.
          </p>
        </div>

        {/* Inspirational Wisdom */}
        <div className="bg-[#7000FF]/10 border border-[#7000FF]/25 rounded-2xl p-4 text-left mb-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-[#00F5D4] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">
                {quote.subHindi}
              </p>
              <p className="text-xs text-slate-400 mt-1 italic">
                "{quote.english}"
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <button
            onClick={onDismiss}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#4F46E5] hover:from-[#6000E0] hover:to-[#4338CA] text-white font-bold text-base shadow-lg shadow-[#7000FF]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            वापस जाएं (Back to Study Dashboard)
          </button>

          <button
            onClick={() => setShowEmergencyDialog(true)}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors py-2"
          >
            Emergency Unlock Protocol (Strict Verification)
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-400">
        STUDY LOCK Real-Time Accessibility Service • Auto-restores all apps when timer hits 00:00:00
      </div>

      {/* Emergency Math Puzzle Dialog */}
      {showEmergencyDialog && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161138] border border-[#7000FF]/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Emergency Unlock Safeguard</h3>
            <p className="text-xs text-slate-300 mb-4">
              To prevent accidental or impulsive unlocking, solve this focus challenge:
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-lg font-bold text-[#00F5D4] mb-4">
              {num1} + {num2} = ?
            </div>
            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => {
                setMathAnswer(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter answer"
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white text-center font-mono font-bold mb-3 focus:outline-none focus:border-[#7000FF]"
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs text-red-400 mb-3">{errorMsg}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowEmergencyDialog(false);
                  setMathAnswer('');
                  setErrorMsg('');
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyEmergency}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-500"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
