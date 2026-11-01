import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Bell, 
  BatteryCharging, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface PermissionsGuideProps {
  preventAccidentalDisable: boolean;
  onTogglePreventDisable: () => void;
}

export const PermissionsGuide: React.FC<PermissionsGuideProps> = ({
  preventAccidentalDisable,
  onTogglePreventDisable,
}) => {
  const [activeTab, setActiveTab] = useState<'permissions' | 'strict'>('permissions');

  const permissions = [
    {
      title: 'Accessibility Service (सर्विस डिटेक्शन)',
      tag: 'BIND_ACCESSIBILITY_SERVICE',
      desc: 'Detects the exact moment a distracting app (like Instagram or WhatsApp) is opened in real-time and immediately intercepts it to launch the Study Lock overlay.',
      status: 'Required',
      step: 'Settings > Accessibility > Installed Apps > STUDY LOCK > Turn ON',
      icon: <Layers className="w-5 h-5 text-[#00F5D4]" />,
    },
    {
      title: 'Display Over Other Apps (स्क्रीन ओवरले)',
      tag: 'SYSTEM_ALERT_WINDOW',
      desc: 'Allows the app to display the full-screen motivational Hindi banner ("📚 अभी पढ़ाई का समय है! अपने भविष्य पर ध्यान दो।") directly on top of blocked apps.',
      status: 'Required',
      step: 'Settings > Apps > Special App Access > Display Over Other Apps > Allow STUDY LOCK',
      icon: <Smartphone className="w-5 h-5 text-[#7000FF]" />,
    },
    {
      title: 'Exact Alarm Scheduling (सटीक टाइमर)',
      tag: 'SCHEDULE_EXACT_ALARM',
      desc: 'Wakes up your device precisely at 5:00 PM (or your scheduled start time) and automatically deactivates at 8:00 PM without requiring manual intervention.',
      status: 'Required',
      step: 'Settings > Apps > Special App Access > Alarms & Reminders > Allow',
      icon: <Bell className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Battery Optimization Whitelist (बैटरी बाईपास)',
      tag: 'IGNORE_BATTERY_OPTIMIZATIONS',
      desc: 'Ensures aggressive background task killers on Xiaomi (MIUI), Samsung (OneUI), and OnePlus (OxygenOS) do not terminate the blocker during study sessions.',
      status: 'Recommended',
      step: 'Settings > Battery > Battery Optimization > STUDY LOCK > Don\'t optimize',
      icon: <BatteryCharging className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-white">Android System Engine & Strict Safeguards</h2>
        <p className="text-xs text-slate-300 mt-1">
          Detailed transparency on how STUDY LOCK operates natively on Android without root or fake claims.
        </p>

        {/* Sub-tabs */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'permissions'
                ? 'bg-[#7000FF] text-white'
                : 'bg-black/20 text-slate-400 hover:text-white'
            }`}
          >
            Required Android Permissions
          </button>
          <button
            onClick={() => setActiveTab('strict')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'strict'
                ? 'bg-[#7000FF] text-white'
                : 'bg-black/20 text-slate-400 hover:text-white'
            }`}
          >
            Strict Focus Protection
          </button>
        </div>
      </div>

      {activeTab === 'permissions' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissions.map((perm, idx) => (
            <div
              key={idx}
              className="bg-[#130E2E] border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
                      {perm.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{perm.title}</h3>
                      <span className="text-[10px] font-mono text-[#00F5D4]">{perm.tag}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00F5D4]/10 text-[#00F5D4] shrink-0">
                    {perm.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {perm.desc}
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  How to Enable on Phone:
                </span>
                <span className="text-xs text-slate-200 font-mono">
                  {perm.step}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#7000FF]" />
                Prevent Accidental Disabling of Study Lock
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                When enabled, turning off an active study session or changing scheduled times requires solving a math focus challenge to prevent impulsive habits.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preventAccidentalDisable}
                onChange={onTogglePreventDisable}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7000FF]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-bold text-[#00F5D4] mb-1">Self-Discipline Rule</h4>
              <p className="text-xs text-slate-300">
                Automatic unlock occurs strictly when the timer reaches 00:00:00. No manual app-by-app resetting required.
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-bold text-[#7000FF] mb-1">Emergency Math Challenge</h4>
              <p className="text-xs text-slate-300">
                Any attempt to bypass the lock overlay requires answering a multi-digit arithmetic calculation.
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-bold text-amber-400 mb-1">Reboot Resistance</h4>
              <p className="text-xs text-slate-300">
                Android `BootReceiver` restores the exact lock status if the phone is restarted during a study window.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
