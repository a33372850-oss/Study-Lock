import React, { useState } from 'react';
import { 
  Instagram, 
  MessageCircle, 
  Youtube, 
  Camera, 
  Facebook, 
  Twitter, 
  Gamepad2, 
  Film, 
  FileText, 
  GraduationCap, 
  BookOpen, 
  Library, 
  Edit3, 
  Folder,
  Lock,
  CheckCircle2,
  Play,
  Pause,
  Info
} from 'lucide-react';
import { AppPolicy } from '../types';

interface AppSimulatorProps {
  isLocked: boolean;
  appPolicies: AppPolicy[];
  onTriggerBlock: (appName: string, pkg: string) => void;
  onToggleLock: () => void;
  remainingSeconds: number;
}

export const AppSimulator: React.FC<AppSimulatorProps> = ({
  isLocked,
  appPolicies,
  onTriggerBlock,
  onToggleLock,
  remainingSeconds,
}) => {
  const [activeAllowedApp, setActiveAllowedApp] = useState<AppPolicy | null>(null);
  const [activeNormalApp, setActiveNormalApp] = useState<AppPolicy | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'instagram':
        return <Instagram className="w-6 h-6 text-pink-400" />;
      case 'message-circle':
        return <MessageCircle className="w-6 h-6 text-emerald-400" />;
      case 'youtube':
        return <Youtube className="w-6 h-6 text-red-400" />;
      case 'camera':
        return <Camera className="w-6 h-6 text-yellow-300" />;
      case 'facebook':
        return <Facebook className="w-6 h-6 text-blue-400" />;
      case 'twitter':
        return <Twitter className="w-6 h-6 text-sky-400" />;
      case 'gamepad-2':
        return <Gamepad2 className="w-6 h-6 text-orange-400" />;
      case 'film':
        return <Film className="w-6 h-6 text-red-500" />;
      case 'file-text':
        return <FileText className="w-6 h-6 text-red-400" />;
      case 'graduation-cap':
        return <GraduationCap className="w-6 h-6 text-amber-400" />;
      case 'book-open':
        return <BookOpen className="w-6 h-6 text-emerald-300" />;
      case 'library':
        return <Library className="w-6 h-6 text-blue-300" />;
      case 'edit-3':
        return <Edit3 className="w-6 h-6 text-purple-300" />;
      case 'folder':
        return <Folder className="w-6 h-6 text-yellow-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-indigo-400" />;
    }
  };

  const handleAppClick = (app: AppPolicy) => {
    if (isLocked && app.isBlocked) {
      // Trigger the Hindi Lock Overlay immediately!
      onTriggerBlock(app.appName, app.packageName);
    } else if (app.category === 'study' || app.category === 'tools') {
      // Allowed educational app
      setActiveAllowedApp(app);
      setActiveNormalApp(null);
    } else {
      // Normal launch when lock is idle
      setActiveNormalApp(app);
      setActiveAllowedApp(null);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Test Controller Banner */}
      <div className="bg-[#161138] border border-[#7000FF]/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-pulse" />
              <h2 className="text-lg font-bold text-white">Live Phone App Blocker Simulator</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Preview test: Click on Instagram, WhatsApp, YouTube, etc. below to test the automatic blocking engine.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLock}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                isLocked 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                  : 'bg-[#7000FF] text-white hover:bg-[#6000E0] shadow-[#7000FF]/30'
              }`}
            >
              {isLocked ? (
                <>
                  <Pause className="w-4 h-4" />
                  Deactivate Study Lock
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Arm & Start Study Lock
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current State Indicator */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded-md ${isLocked ? 'bg-emerald-500/20 text-[#00F5D4]' : 'bg-slate-800 text-slate-300'}`}>
              {isLocked ? `LOCKED (Time remaining: ${formatTime(remainingSeconds)})` : 'IDLE / UNLOCKED'}
            </span>
          </div>
          <div className="text-slate-400">
            {isLocked 
              ? 'Distracting apps will be blocked with the Hindi overlay' 
              : 'All apps are currently freely accessible'}
          </div>
        </div>
      </div>

      {/* Simulator Device Grid */}
      <div className="bg-[#0C0822] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Simulated Phone Home Screen
          </h3>
          <span className="text-xs text-slate-400">Tap any app icon to test launch</span>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {appPolicies.map((app) => (
            <button
              key={app.packageName}
              onClick={() => handleAppClick(app)}
              className={`group relative p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border ${
                app.isBlocked
                  ? isLocked
                    ? 'bg-red-950/20 hover:bg-red-950/40 border-red-500/30 hover:border-red-400 cursor-pointer hover:scale-105'
                    : 'bg-[#161138]/60 hover:bg-[#1B1445] border-white/5 hover:border-white/20'
                  : 'bg-emerald-950/20 hover:bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-400 cursor-pointer hover:scale-105'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {app.isBlocked ? (
                  isLocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
                      <Lock className="w-2.5 h-2.5" />
                      BLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-black/40 px-1.5 py-0.5 rounded">
                      Will Block
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    ALLOWED
                  </span>
                )}
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                {getIcon(app.iconName)}
              </div>

              {/* App Label */}
              <span className="text-xs font-semibold text-white tracking-tight line-clamp-1">
                {app.appName}
              </span>
              <span className="text-[10px] text-slate-400 capitalize mt-0.5">
                {app.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Opened Educational App Modal */}
      {activeAllowedApp && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161138] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  {getIcon(activeAllowedApp.iconName)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{activeAllowedApp.appName}</h4>
                  <span className="text-xs text-emerald-400 font-medium">Educational Whitelisted App</span>
                </div>
              </div>
              <button
                onClick={() => setActiveAllowedApp(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                Access Allowed During Study Session!
              </p>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Because <strong>{activeAllowedApp.appName}</strong> is on your allowed educational list, Study Lock permits you to learn without interruptions.
              </p>
            </div>

            <button
              onClick={() => setActiveAllowedApp(null)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
            >
              Back to Study
            </button>
          </div>
        </div>
      )}

      {/* Simulated Normal App Open (when lock is off) */}
      {activeNormalApp && !isLocked && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161138] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  {getIcon(activeNormalApp.iconName)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{activeNormalApp.appName}</h4>
                  <span className="text-xs text-slate-400">Normal Phone Mode (Unlocked)</span>
                </div>
              </div>
              <button
                onClick={() => setActiveNormalApp(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center mx-auto mb-3">
                <Info className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                App Opened Normally
              </p>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Study Lock is currently <strong>IDLE / OFF</strong>. To test how this app gets blocked, click <strong>"Arm & Start Study Lock"</strong> at the top, then try opening it again!
              </p>
            </div>

            <button
              onClick={() => setActiveNormalApp(null)}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
