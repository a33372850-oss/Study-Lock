import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Plus, 
  RotateCcw, 
  BookOpen, 
  Lock, 
  Check,
  Instagram,
  Youtube,
  MessageCircle,
  FileText,
  GraduationCap
} from 'lucide-react';
import { AppPolicy } from '../types';
import { DEFAULT_APPS } from '../utils/constants';

interface AppPolicyManagerProps {
  appPolicies: AppPolicy[];
  onUpdatePolicies: (newPolicies: AppPolicy[]) => void;
}

export const AppPolicyManager: React.FC<AppPolicyManagerProps> = ({
  appPolicies,
  onUpdatePolicies,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'blocked' | 'allowed'>('all');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPackage, setCustomPackage] = useState('');
  const [customIsBlocked, setCustomIsBlocked] = useState(true);

  const filteredApps = appPolicies.filter((app) => {
    const matchesSearch = 
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === 'blocked') return matchesSearch && app.isBlocked;
    if (filterCategory === 'allowed') return matchesSearch && !app.isBlocked;
    return matchesSearch;
  });

  const handleToggleBlock = (packageName: string) => {
    const updated = appPolicies.map((app) => {
      if (app.packageName === packageName) {
        return { ...app, isBlocked: !app.isBlocked };
      }
      return app;
    });
    onUpdatePolicies(updated);
  };

  const handleApplyStrictPreset = () => {
    onUpdatePolicies(DEFAULT_APPS);
  };

  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPackage.trim()) return;

    const newApp: AppPolicy = {
      appName: customName.trim(),
      packageName: customPackage.trim(),
      category: customIsBlocked ? 'games' : 'study',
      isBlocked: customIsBlocked,
      iconName: customIsBlocked ? 'gamepad-2' : 'book-open',
    };

    onUpdatePolicies([...appPolicies, newApp]);
    setShowAddCustom(false);
    setCustomName('');
    setCustomPackage('');
  };

  const blockedCount = appPolicies.filter(a => a.isBlocked).length;
  const allowedCount = appPolicies.filter(a => !a.isBlocked).length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">App Blocking & Whitelist Control</h2>
            <p className="text-xs text-slate-300 mt-1">
              Select which apps trigger the Hindi Study Lock overlay and which educational apps remain accessible.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyStrictPreset}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset to recommended study defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={() => setShowAddCustom(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#4F46E5] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#7000FF]/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add App
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by app name or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7000FF]"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterCategory === 'all'
                  ? 'bg-[#7000FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({appPolicies.length})
            </button>
            <button
              onClick={() => setFilterCategory('blocked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                filterCategory === 'blocked'
                  ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3 h-3" />
              Blocked ({blockedCount})
            </button>
            <button
              onClick={() => setFilterCategory('allowed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                filterCategory === 'allowed'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Check className="w-3 h-3" />
              Allowed ({allowedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Apps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredApps.map((app) => (
          <div
            key={app.packageName}
            className={`border rounded-2xl p-4 flex items-center justify-between gap-3 transition-colors ${
              app.isBlocked
                ? 'bg-[#150F33] border-red-500/20'
                : 'bg-[#0E1528] border-emerald-500/20'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  app.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {app.isBlocked ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm truncate">{app.appName}</h4>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      app.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {app.isBlocked ? 'Blocked' : 'Allowed'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  {app.packageName}
                </p>
              </div>
            </div>

            {/* Toggle Action */}
            <button
              onClick={() => handleToggleBlock(app.packageName)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                app.isBlocked
                  ? 'bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-white/10'
                  : 'bg-slate-800 hover:bg-red-600/30 text-slate-300 hover:text-red-300 border border-white/10'
              }`}
            >
              {app.isBlocked ? 'Allow App' : 'Block App'}
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom App Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161138] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add App Package</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the Android package name of the application you want to manage.
            </p>

            <form onSubmit={handleAddCustomApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Duolingo, Telegram, Reddit"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7000FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Android Package Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. org.telegram.messenger"
                  value={customPackage}
                  onChange={(e) => setCustomPackage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#7000FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Policy Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomIsBlocked(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      customIsBlocked
                        ? 'bg-red-500/30 text-red-300 border-red-500/50'
                        : 'bg-black/20 text-slate-400 border-white/5'
                    }`}
                  >
                    Lock & Block App
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomIsBlocked(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      !customIsBlocked
                        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                        : 'bg-black/20 text-slate-400 border-white/5'
                    }`}
                  >
                    Whitelist / Allow
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-[#7000FF] text-white text-xs font-bold shadow-lg shadow-[#7000FF]/30"
                >
                  Save App Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
