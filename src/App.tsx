/**
 * STUDY LOCK – Focus Mode
 * Modern Android Application & Real-Time Interactive Simulator
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  Smartphone, 
  Clock, 
  Sliders, 
  Layers, 
  FolderArchive, 
  Sparkles, 
  Lock, 
  Unlock,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Download
} from 'lucide-react';

import { AppPolicy, StudySchedule, StudyStats, ViewTab } from './types';
import { DEFAULT_APPS, DEFAULT_SCHEDULES } from './utils/constants';
import { Dashboard } from './components/Dashboard';
import { AppSimulator } from './components/AppSimulator';
import { ScheduleManager } from './components/ScheduleManager';
import { AppPolicyManager } from './components/AppPolicyManager';
import { PermissionsGuide } from './components/PermissionsGuide';
import { ApkExportModal } from './components/ApkExportModal';
import { LockOverlay } from './components/LockOverlay';
import { PhoneSimulatorFrame } from './components/PhoneSimulatorFrame';
import { PWAInstallButton } from './components/PWAInstallButton';
import { PWADiagnosticsModal } from './components/PWADiagnosticsModal';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [viewMode, setViewMode] = useState<'responsive' | 'phone_frame'>('responsive');

  // Iframe & Diagnostics State
  const [isInIframe, setIsInIframe] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  // Study Lock State
  const [isLocked, setIsLocked] = useState(false);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(3 * 3600); // 3 hours
  const [remainingSeconds, setRemainingSeconds] = useState(3 * 3600);
  
  // Break Mode
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(300); // 5 min

  // Data & Settings
  const [appPolicies, setAppPolicies] = useState<AppPolicy[]>(() => {
    const saved = localStorage.getItem('studylock_apps');
    return saved ? JSON.parse(saved) : DEFAULT_APPS;
  });

  const [schedules, setSchedules] = useState<StudySchedule[]>(() => {
    const saved = localStorage.getItem('studylock_schedules');
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULES;
  });

  const [stats, setStats] = useState<StudyStats>(() => {
    const saved = localStorage.getItem('studylock_stats');
    return saved ? JSON.parse(saved) : {
      todaySeconds: 3.5 * 3600,
      dailyGoalMinutes: 240, // 4 hours
      currentStreakDays: 7,
      totalCompletedSessions: 24,
      weeklyMinutes: [180, 210, 240, 195, 270, 210, 180],
    };
  });

  const [preventAccidentalDisable, setPreventAccidentalDisable] = useState(true);

  // Active Simulated Block Overlay state
  const [activeBlockedApp, setActiveBlockedApp] = useState<{ name: string; pkg: string } | null>(null);

  // Persist State
  useEffect(() => {
    localStorage.setItem('studylock_apps', JSON.stringify(appPolicies));
  }, [appPolicies]);

  useEffect(() => {
    localStorage.setItem('studylock_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('studylock_stats', JSON.stringify(stats));
  }, [stats]);

  // Main Timer Tick
  useEffect(() => {
    let timer: number | null = null;

    if (isLocked && remainingSeconds > 0 && !isBreakActive) {
      timer = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Session Finished! Trigger Celebration & Automatic Unlock
            triggerCelebration();
            setIsLocked(false);
            setStats(curr => ({
              ...curr,
              todaySeconds: curr.todaySeconds + totalSessionSeconds,
              totalCompletedSessions: curr.totalCompletedSessions + 1,
            }));
            return totalSessionSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, remainingSeconds, isBreakActive, totalSessionSeconds]);

  // Break Timer Tick
  useEffect(() => {
    let breakTimer: number | null = null;
    if (isBreakActive && breakRemainingSeconds > 0) {
      breakTimer = window.setInterval(() => {
        setBreakRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsBreakActive(false);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (breakTimer) clearInterval(breakTimer);
    };
  }, [isBreakActive, breakRemainingSeconds]);

  // Trigger Completion Celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7000FF', '#00F5D4', '#4F46E5', '#FF3366', '#FFD700'],
      });
    } catch {
      // ignore
    }
  };

  // Toggle Lock
  const handleToggleLock = () => {
    if (!isLocked) {
      setIsLocked(true);
      setIsBreakActive(false);
    } else {
      setIsLocked(false);
      setIsBreakActive(false);
    }
  };

  const handleStartBreak = () => {
    setIsBreakActive(true);
    setBreakRemainingSeconds(300);
  };

  // Active Schedule helper
  const activeSchedule = schedules.find(s => s.isEnabled) || null;

  return (
    <div className="min-h-screen bg-[#080614] text-slate-100 flex flex-col font-sans">
      {/* Iframe PWA Helper Notice Banner */}
      {isInIframe && (
        <div className="bg-gradient-to-r from-[#7000FF] via-[#5B37C7] to-[#1E1452] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-white/10 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping" />
            <span>
              <strong>PWA Install Note:</strong> Preview window me browser security direct install block karti hai. Phone me chalane ke liye New Tab kholein ya QR scan karein:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiagnostics(true)}
              className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-[11px] font-bold text-[#00F5D4] border border-[#00F5D4]/30 flex items-center gap-1 transition-colors"
            >
              📱 Scan QR Code
            </button>
            <a
              href={window.location.href}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#00F5D4] hover:bg-[#00F5D4]/90 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
            >
              Open in New Tab ↗
            </a>
          </div>
        </div>
      )}

      {/* Top Bar Contract: Brand title (one line) — Nav links — Primary action */}
      <header className="sticky top-0 z-40 bg-[#0A071E]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7000FF] to-[#00F5D4] flex items-center justify-center shadow-lg shadow-[#7000FF]/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white whitespace-nowrap shrink-0">
            STUDY LOCK
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard' ? 'text-[#00F5D4]' : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'simulator' ? 'text-[#00F5D4]' : 'hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            App Blocker Simulator
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'schedule' ? 'text-[#00F5D4]' : 'hover:text-white'
            }`}
          >
            Schedules
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'apps' ? 'text-[#00F5D4]' : 'hover:text-white'
            }`}
          >
            App Policies
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'permissions' ? 'text-[#00F5D4]' : 'hover:text-white'
            }`}
          >
            Android System Engine
          </button>
          <button
            onClick={() => setActiveTab('apk_builder')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-[#00F5D4] bg-[#00F5D4]/10 px-2.5 py-1 rounded-lg border border-[#00F5D4]/20 font-bold`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            APK & Source Project
          </button>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* Toggle Phone Simulator Frame View */}
          <button
            onClick={() => setViewMode(v => v === 'responsive' ? 'phone_frame' : 'responsive')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition-colors"
            title="Toggle between Responsive view and Android Phone frame view"
          >
            {viewMode === 'responsive' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span className="whitespace-nowrap">Phone Frame View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#7000FF]" />
                <span className="whitespace-nowrap">Expanded View</span>
              </>
            )}
          </button>

          {/* Quick Start / Stop Toggle */}
          <button
            onClick={handleToggleLock}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-lg ${
              isLocked
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                : 'bg-gradient-to-r from-[#7000FF] to-[#4F46E5] hover:from-[#6000E0] hover:to-[#4338CA] text-white shadow-[#7000FF]/30 active:scale-95'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Study Lock Active
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                Start Focus Mode
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto bg-[#0E0A24] border-b border-white/5 text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-[#7000FF] text-white' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'simulator' ? 'bg-[#7000FF] text-white' : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Test Blocker
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap ${
            activeTab === 'schedule' ? 'bg-[#7000FF] text-white' : 'text-slate-400'
          }`}
        >
          Schedules
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap ${
            activeTab === 'apps' ? 'bg-[#7000FF] text-white' : 'text-slate-400'
          }`}
        >
          App Policies
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap ${
            activeTab === 'permissions' ? 'bg-[#7000FF] text-white' : 'text-slate-400'
          }`}
        >
          Engine & Rules
        </button>
        <button
          onClick={() => setActiveTab('apk_builder')}
          className={`px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/30`}
        >
          APK & ZIP
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {viewMode === 'phone_frame' ? (
          <PhoneSimulatorFrame isLocked={isLocked}>
            {activeTab === 'dashboard' && (
              <Dashboard
                isLocked={isLocked}
                remainingSeconds={remainingSeconds}
                totalSessionSeconds={totalSessionSeconds}
                stats={stats}
                activeSchedule={activeSchedule}
                onToggleLock={handleToggleLock}
                onStartBreak={handleStartBreak}
                isBreakActive={isBreakActive}
                breakRemainingSeconds={breakRemainingSeconds}
                onQuickSimulateBlock={() => setActiveBlockedApp({ name: 'Instagram', pkg: 'com.instagram.android' })}
              />
            )}
            {activeTab === 'simulator' && (
              <AppSimulator
                isLocked={isLocked}
                appPolicies={appPolicies}
                onTriggerBlock={(appName, pkg) => setActiveBlockedApp({ name: appName, pkg })}
                onToggleLock={handleToggleLock}
                remainingSeconds={remainingSeconds}
              />
            )}
            {activeTab === 'schedule' && (
              <ScheduleManager
                schedules={schedules}
                onUpdateSchedules={setSchedules}
                isStudyLockActive={isLocked}
              />
            )}
            {activeTab === 'apps' && (
              <AppPolicyManager
                appPolicies={appPolicies}
                onUpdatePolicies={setAppPolicies}
              />
            )}
            {activeTab === 'permissions' && (
              <PermissionsGuide
                preventAccidentalDisable={preventAccidentalDisable}
                onTogglePreventDisable={() => setPreventAccidentalDisable(!preventAccidentalDisable)}
              />
            )}
            {activeTab === 'apk_builder' && (
              <ApkExportModal />
            )}
          </PhoneSimulatorFrame>
        ) : (
          <div>
            {activeTab === 'dashboard' && (
              <Dashboard
                isLocked={isLocked}
                remainingSeconds={remainingSeconds}
                totalSessionSeconds={totalSessionSeconds}
                stats={stats}
                activeSchedule={activeSchedule}
                onToggleLock={handleToggleLock}
                onStartBreak={handleStartBreak}
                isBreakActive={isBreakActive}
                breakRemainingSeconds={breakRemainingSeconds}
                onQuickSimulateBlock={() => setActiveBlockedApp({ name: 'Instagram', pkg: 'com.instagram.android' })}
              />
            )}
            {activeTab === 'simulator' && (
              <AppSimulator
                isLocked={isLocked}
                appPolicies={appPolicies}
                onTriggerBlock={(appName, pkg) => setActiveBlockedApp({ name: appName, pkg })}
                onToggleLock={handleToggleLock}
                remainingSeconds={remainingSeconds}
              />
            )}
            {activeTab === 'schedule' && (
              <ScheduleManager
                schedules={schedules}
                onUpdateSchedules={setSchedules}
                isStudyLockActive={isLocked}
              />
            )}
            {activeTab === 'apps' && (
              <AppPolicyManager
                appPolicies={appPolicies}
                onUpdatePolicies={setAppPolicies}
              />
            )}
            {activeTab === 'permissions' && (
              <PermissionsGuide
                preventAccidentalDisable={preventAccidentalDisable}
                onTogglePreventDisable={() => setPreventAccidentalDisable(!preventAccidentalDisable)}
              />
            )}
            {activeTab === 'apk_builder' && (
              <ApkExportModal />
            )}
          </div>
        )}
      </main>

      {/* Full-Screen Lock Overlay Simulation when blocked app is clicked */}
      {activeBlockedApp && (
        <LockOverlay
          blockedAppName={activeBlockedApp.name}
          remainingSeconds={remainingSeconds}
          onDismiss={() => setActiveBlockedApp(null)}
          onEmergencyUnlock={() => {
            setIsLocked(false);
            setActiveBlockedApp(null);
          }}
        />
      )}

      {/* PWA Diagnostics & QR Code Modal */}
      <PWADiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-400">
        STUDY LOCK – Focus Mode • Modern Android Jetpack Compose & Web Engine • Built for distraction-free academic excellence
      </footer>
    </div>
  );
}
