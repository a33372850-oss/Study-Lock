import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Coffee, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Clock, 
  Target, 
  Calendar,
  AlertCircle,
  Headphones,
  CheckCircle2,
  RefreshCw,
  Waves,
  CloudRain,
  Music,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import { AmbientSoundType, FocusSoundState, StudySchedule, StudyStats } from '../types';
import { focusAudio } from '../utils/audioEngine';
import { MOTIVATIONAL_QUOTES } from '../utils/constants';

interface DashboardProps {
  isLocked: boolean;
  remainingSeconds: number;
  totalSessionSeconds: number;
  stats: StudyStats;
  activeSchedule: StudySchedule | null;
  onToggleLock: () => void;
  onStartBreak: () => void;
  isBreakActive: boolean;
  breakRemainingSeconds: number;
  onQuickSimulateBlock: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isLocked,
  remainingSeconds,
  totalSessionSeconds,
  stats,
  activeSchedule,
  onToggleLock,
  onStartBreak,
  isBreakActive,
  breakRemainingSeconds,
  onQuickSimulateBlock,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [soundState, setSoundState] = useState<FocusSoundState>(() => {
    const saved = localStorage.getItem('studylock_sound_state');
    return saved ? JSON.parse(saved) : {
      soundType: 'lofi',
      isPlaying: false,
      volume: 0.6,
      autoPlayOnLock: true,
    };
  });
  const [showDeactivateWarning, setShowDeactivateWarning] = useState(false);

  // Persist sound state
  useEffect(() => {
    localStorage.setItem('studylock_sound_state', JSON.stringify(soundState));
  }, [soundState]);

  // Auto-play / stop sound when Study Lock changes if autoPlayOnLock is true
  useEffect(() => {
    if (soundState.autoPlayOnLock) {
      if (isLocked && !soundState.isPlaying && soundState.soundType !== 'none') {
        focusAudio.play(soundState.soundType, soundState.volume);
        setSoundState(prev => ({ ...prev, isPlaying: true }));
      } else if (!isLocked && soundState.isPlaying) {
        focusAudio.stop();
        setSoundState(prev => ({ ...prev, isPlaying: false }));
      }
    }
  }, [isLocked, soundState.autoPlayOnLock]);

  // Audio Toggle Handler
  const handleToggleSound = (type: AmbientSoundType) => {
    if (soundState.isPlaying && soundState.soundType === type) {
      focusAudio.stop();
      setSoundState(prev => ({ ...prev, isPlaying: false }));
    } else {
      focusAudio.play(type, soundState.volume);
      setSoundState(prev => ({ ...prev, isPlaying: true, soundType: type }));
    }
  };

  const handleStopAll = () => {
    focusAudio.stop();
    setSoundState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleVolumeChange = (vol: number) => {
    setSoundState(prev => ({ ...prev, volume: vol }));
    focusAudio.setVolume(vol);
  };

  const toggleAutoPlayOnLock = () => {
    setSoundState(prev => ({ ...prev, autoPlayOnLock: !prev.autoPlayOnLock }));
  };

  const formatHMS = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressRatio = totalSessionSeconds > 0 
    ? Math.max(0, Math.min(1, 1 - (remainingSeconds / totalSessionSeconds)))
    : 0;
  const strokeDashoffset = 565.48 * (1 - (isLocked ? (1 - progressRatio) : 0));

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleLockClick = () => {
    if (isLocked) {
      setShowDeactivateWarning(true);
    } else {
      onToggleLock();
    }
  };

  const confirmDeactivate = () => {
    setShowDeactivateWarning(false);
    onToggleLock();
  };

  // Ambient Sounds Configuration
  const ambientSounds: {
    type: AmbientSoundType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    bgAccent: string;
  }[] = [
    {
      type: 'lofi',
      title: 'Lo-fi Beats',
      description: 'Chill Rhodes piano chords & vinyl crackle at 60 BPM for rhythmic studying',
      icon: <Music className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgAccent: 'bg-purple-500/10',
    },
    {
      type: 'rain',
      title: 'Rain',
      description: 'Gentle raindrops on glass with warm low-pass atmospheric mist',
      icon: <CloudRain className="w-5 h-5 text-sky-400" />,
      color: 'text-sky-400',
      borderColor: 'border-sky-500/40',
      bgAccent: 'bg-sky-500/10',
    },
    {
      type: 'whitenoise',
      title: 'White Noise',
      description: 'Warm, low-frequency acoustic masking to block outside distractions',
      icon: <Waves className="w-5 h-5 text-[#00F5D4]" />,
      color: 'text-[#00F5D4]',
      borderColor: 'border-[#00F5D4]/40',
      bgAccent: 'bg-[#00F5D4]/10',
    },
    {
      type: 'binaural',
      title: 'Binaural Beats',
      description: 'Synchronized Alpha 40Hz wave stimulation for sustained high cognition',
      icon: <Radio className="w-5 h-5 text-indigo-400" />,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
      bgAccent: 'bg-indigo-500/10',
    },
  ];

  // Week days bar representation
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeeklyMin = Math.max(...stats.weeklyMinutes, 120);

  return (
    <div className="space-y-6">
      {/* Top Status & Schedule Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#130E2E]/80 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLocked ? 'bg-[#00F5D4] animate-pulse' : 'bg-slate-600'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Focus Mode Status:</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                isBreakActive 
                  ? 'bg-amber-500/20 text-amber-300' 
                  : isLocked 
                    ? 'bg-emerald-500/20 text-[#00F5D4]' 
                    : 'bg-slate-800 text-slate-300'
              }`}>
                {isBreakActive ? '☕ 5-MIN BREAK ACTIVE' : isLocked ? 'ACTIVE LOCK RUNNING' : 'IDLE / READY'}
              </span>
            </div>
            {activeSchedule && (
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7000FF]" />
                Scheduled: <strong>{activeSchedule.title}</strong> (
                {activeSchedule.startHour.toString().padStart(2, '0')}:{activeSchedule.startMinute.toString().padStart(2, '0')} –{' '}
                {activeSchedule.endHour.toString().padStart(2, '0')}:{activeSchedule.endMinute.toString().padStart(2, '0')}
                )
              </p>
            )}
          </div>
        </div>

        {/* Quick Test Blocker Shortcut */}
        <button
          onClick={onQuickSimulateBlock}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#7000FF]/20 hover:bg-[#7000FF]/30 text-[#00F5D4] border border-[#7000FF]/40 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Test Instagram/App Lock Screen
        </button>
      </div>

      {/* Main Hero & Countdown Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Timer Ring Card */}
        <div className="lg:col-span-7 bg-[#130E2E] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#7000FF]/15 blur-3xl pointer-events-none rounded-full" />

          <div className="w-full flex items-center justify-between mb-4 z-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Study Countdown
            </span>
            <span className="text-xs font-mono text-[#00F5D4]">
              {isLocked ? 'STRICT FOCUS' : 'READY TO STUDY'}
            </span>
          </div>

          {/* Glowing Animated Circular Timer */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-[#22194D]"
                strokeWidth="12"
                fill="none"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="url(#gradientTimer)"
                strokeWidth="12"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="gradientTimer" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7000FF" />
                  <stop offset="50%" stopColor="#00F5D4" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
                {isBreakActive ? 'Break Time' : isLocked ? 'Remaining Focus' : 'Study Duration'}
              </span>
              <span className="text-4xl sm:text-5xl font-black font-mono-numbers text-white tracking-tight drop-shadow-md">
                {isBreakActive ? formatHMS(breakRemainingSeconds) : formatHMS(remainingSeconds)}
              </span>
              <span className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#00F5D4]" />
                {isLocked ? 'Distractions Locked' : '3h Scheduled Session'}
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="w-full space-y-3 z-10 mt-2">
            <button
              onClick={handleLockClick}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl ${
                isLocked 
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-900/30' 
                  : 'bg-gradient-to-r from-[#7000FF] to-[#4F46E5] hover:from-[#6000E0] hover:to-[#4338CA] text-white shadow-[#7000FF]/40 active:scale-[0.99]'
              }`}
            >
              {isLocked ? (
                <>
                  <Pause className="w-5 h-5" />
                  Deactivate Lock & Unlock Apps
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Start Scheduled Study Session
                </>
              )}
            </button>

            {/* Break Button (Allowed during active focus) */}
            {isLocked && (
              <button
                onClick={onStartBreak}
                disabled={isBreakActive}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-2 ${
                  isBreakActive 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-400" />
                {isBreakActive ? 'Break In Progress (Auto-Resumes in 5 min)' : 'Take a 5-Minute Brain Break'}
              </button>
            )}
          </div>
        </div>

        {/* Right Stats & Daily Wisdom */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Today's Focus</span>
                <Target className="w-4 h-4 text-[#00F5D4]" />
              </div>
              <div className="text-2xl font-bold font-mono-numbers text-white">
                {(stats.todaySeconds / 3600).toFixed(1)} hrs
              </div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#7000FF] to-[#00F5D4] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((stats.todaySeconds / 60) / stats.dailyGoalMinutes) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Daily Goal: {Math.round(stats.dailyGoalMinutes / 60)} hrs
              </span>
            </div>

            <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Daily Streak</span>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold font-mono-numbers text-white flex items-center gap-1">
                {stats.currentStreakDays} Days
              </div>
              <p className="text-[11px] text-orange-300 mt-2 font-medium">
                🔥 Habit is building strong!
              </p>
            </div>
          </div>

          {/* Quick Live Status Card */}
          <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#7000FF]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Audio Immersion
                </h3>
              </div>
              {soundState.isPlaying ? (
                <span className="text-[10px] font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-ping" />
                  PLAYING {soundState.soundType.toUpperCase()}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">AUDIO READY</span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {soundState.autoPlayOnLock ? (
                <span>⚡ <strong>Auto-Sync Active:</strong> Selected ambient sound automatically starts when you arm Study Lock.</span>
              ) : (
                <span>Sound can be manually toggled anytime in the Ambient Focus section below.</span>
              )}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => handleToggleSound(soundState.soundType === 'none' ? 'lofi' : soundState.soundType)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  soundState.isPlaying
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-[#7000FF] text-white hover:bg-[#6000E0]'
                }`}
              >
                {soundState.isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {soundState.isPlaying ? 'Mute Audio' : 'Start Focus Audio'}
              </button>

              <button
                onClick={toggleAutoPlayOnLock}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                  soundState.autoPlayOnLock
                    ? 'bg-[#00F5D4]/10 text-[#00F5D4] border-[#00F5D4]/30'
                    : 'bg-black/20 text-slate-400 border-white/5'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${soundState.autoPlayOnLock ? 'opacity-100' : 'opacity-30'}`} />
                Auto-play on Lock
              </button>
            </div>
          </div>

          {/* Hindi & English Wisdom Box */}
          <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-4 relative group">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold text-[#7000FF]">
                <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
                MOTIVATION
              </span>
              <button
                onClick={handleNextQuote}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Next inspirational thought"
              >
                <RefreshCw className="w-3 h-3" />
                Next
              </button>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              {currentQuote.hindi}
            </p>
            <p className="text-xs text-slate-400 mt-1 italic">
              "{currentQuote.english}"
            </p>
          </div>
        </div>
      </div>

      {/* NEW DEDICATED SECTION: Ambient Focus Sounds While Study Lock Is Active */}
      <section className="bg-[#130E2E] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background Flare */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7000FF] to-[#00F5D4] flex items-center justify-center text-white shadow-md shadow-[#7000FF]/30">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Ambient Focus Sounds (Study Background Audio)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Play soothing acoustic environments to mask distractions and deepen concentration while Study Lock is active.
                </p>
              </div>
            </div>
          </div>

          {/* Global Audio Controls: Auto-Play toggle & Volume */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-play with Study Lock Switch */}
            <button
              onClick={toggleAutoPlayOnLock}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                soundState.autoPlayOnLock
                  ? 'bg-[#00F5D4]/15 border-[#00F5D4]/40 text-[#00F5D4]'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Automatically start/stop ambient sound when Study Lock activates"
            >
              <span className={`w-2 h-2 rounded-full ${soundState.autoPlayOnLock ? 'bg-[#00F5D4] animate-ping' : 'bg-slate-500'}`} />
              Auto-Play on Study Lock: {soundState.autoPlayOnLock ? 'ON' : 'OFF'}
            </button>

            {/* Stop Button */}
            {soundState.isPlaying && (
              <button
                onClick={handleStopAll}
                className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                Stop Sound
              </button>
            )}
          </div>
        </div>

        {/* Ambient Sound Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {ambientSounds.map((snd) => {
            const isThisPlaying = soundState.isPlaying && soundState.soundType === snd.type;
            const isSelected = soundState.soundType === snd.type;

            return (
              <div
                key={snd.type}
                className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  isThisPlaying
                    ? `${snd.bgAccent} ${snd.borderColor} shadow-lg shadow-[#7000FF]/15 ring-1 ring-white/20`
                    : isSelected
                      ? 'bg-[#18123C] border-white/20'
                      : 'bg-[#0E0A22] border-white/5 hover:border-white/15 hover:bg-[#120E2C]'
                }`}
              >
                {/* Active Equalizer animation when playing */}
                {isThisPlaying && (
                  <div className="absolute top-4 right-4 flex items-end gap-1 h-4">
                    <span className="w-1 bg-[#00F5D4] rounded-full animate-pulse h-3" />
                    <span className="w-1 bg-[#00F5D4] rounded-full animate-bounce h-4" />
                    <span className="w-1 bg-[#00F5D4] rounded-full animate-pulse h-2" />
                    <span className="w-1 bg-[#00F5D4] rounded-full animate-bounce h-3.5" />
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${snd.bgAccent} border border-white/10 shrink-0`}>
                      {snd.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">
                        {snd.title}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isThisPlaying ? snd.color : 'text-slate-500'}`}>
                        {isThisPlaying ? '● NOW PLAYING' : isSelected ? 'SELECTED' : 'READY'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {snd.description}
                  </p>
                </div>

                {/* Play / Toggle Button */}
                <button
                  onClick={() => handleToggleSound(snd.type)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isThisPlaying
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                      : isSelected
                        ? 'bg-gradient-to-r from-[#7000FF] to-[#4F46E5] text-white shadow-md shadow-[#7000FF]/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                  }`}
                >
                  {isThisPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      Pause Sound
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Play {snd.title}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Volume & Audio Configuration Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Volume Slider */}
          <div className="flex items-center gap-3 max-w-sm w-full">
            <VolumeX 
              className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" 
              onClick={() => handleVolumeChange(0)} 
            />
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Ambient Volume</span>
                <span className="font-mono text-white font-semibold">{Math.round(soundState.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundState.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#7000FF] h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <Volume2 
              className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" 
              onClick={() => handleVolumeChange(1)} 
            />
          </div>

          {/* Quick Notice */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
            <span>
              Generated in real-time via Web Audio API • 100% offline & battery efficient
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Progress Bar Chart */}
      <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Weekly Study Analytics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Total 7-day study consistency and time investment
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total This Week: </span>
            <span className="text-sm font-bold font-mono text-[#00F5D4]">
              {(stats.weeklyMinutes.reduce((a, b) => a + b, 0) / 60).toFixed(1)} hrs
            </span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-32 pt-4">
          {stats.weeklyMinutes.map((mins, idx) => {
            const heightPercent = Math.max(8, Math.round((mins / maxWeeklyMin) * 100));
            const isToday = idx === 5; // Saturday in current context
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-400">
                  {(mins / 60).toFixed(1)}h
                </span>
                <div className="w-full max-w-[36px] bg-slate-800 rounded-t-lg h-full max-h-[85px] flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday 
                        ? 'bg-gradient-to-t from-[#7000FF] to-[#00F5D4]' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[11px] font-medium ${isToday ? 'text-[#00F5D4] font-bold' : 'text-slate-400'}`}>
                  {weekDays[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strict Mode Deactivate Warning Confirmation */}
      {showDeactivateWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161138] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-1">
              Stop Active Study Lock?
            </h3>
            <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">
              You still have <strong>{formatHMS(remainingSeconds)}</strong> left in this focus schedule.
              Stopping now will unlock distracting apps and break your daily streak discipline.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateWarning(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#4F46E5] text-white text-sm font-bold shadow-lg shadow-[#7000FF]/30"
              >
                Continue Studying
              </button>
              <button
                onClick={confirmDeactivate}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 text-sm font-medium"
              >
                Disable Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
