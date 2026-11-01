import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { StudySchedule } from '../types';

interface ScheduleManagerProps {
  schedules: StudySchedule[];
  onUpdateSchedules: (newSchedules: StudySchedule[]) => void;
  isStudyLockActive: boolean;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedules,
  onUpdateSchedules,
  isStudyLockActive,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startHour, setStartHour] = useState(17); // 5 PM
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(20);     // 8 PM
  const [endMinute, setEndMinute] = useState(0);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // Mon-Sat

  const daysLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleToggleSchedule = (id: string) => {
    const updated = schedules.map(s => {
      if (s.id === id) {
        return { ...s, isEnabled: !s.isEnabled };
      }
      return s;
    });
    onUpdateSchedules(updated);
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    onUpdateSchedules(updated);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSchedule: StudySchedule = {
      id: `sched-${Date.now()}`,
      title: title.trim(),
      startHour: Number(startHour),
      startMinute: Number(startMinute),
      endHour: Number(endHour),
      endMinute: Number(endMinute),
      daysOfWeek: selectedDays,
      isEnabled: true,
    };

    onUpdateSchedules([...schedules, newSchedule]);
    setShowAddModal(false);
    setTitle('');
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#130E2E] border border-white/10 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Automated Study Schedules</h2>
          <p className="text-xs text-slate-300 mt-1">
            Study Lock automatically arms at the start time and automatically unlocks when the session ends.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#4F46E5] hover:from-[#6000E0] hover:to-[#4338CA] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7000FF]/30 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Schedule
        </button>
      </div>

      {/* Active Schedules Alert */}
      {isStudyLockActive && (
        <div className="bg-[#7000FF]/15 border border-[#7000FF]/30 rounded-xl p-4 flex items-center gap-3 text-xs text-[#00F5D4]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong>Active Session in Progress:</strong> Any modifications to schedules will automatically sync with the background AlarmManager and AccessibilityService.
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`border rounded-2xl p-5 transition-all ${
              schedule.isEnabled 
                ? 'bg-[#130E2E] border-white/10 hover:border-[#7000FF]/50 shadow-lg' 
                : 'bg-[#0E0A22]/60 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">
                  {schedule.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00F5D4] mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {formatTime(schedule.startHour, schedule.startMinute)} – {formatTime(schedule.endHour, schedule.endMinute)}
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={schedule.isEnabled}
                  onChange={() => handleToggleSchedule(schedule.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7000FF]"></div>
              </label>
            </div>

            {/* Days Pills */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
              {daysLabel.map((d, index) => {
                const isSelected = schedule.daysOfWeek.includes(index);
                return (
                  <span
                    key={index}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      isSelected
                        ? 'bg-[#7000FF]/20 text-[#00F5D4] border border-[#7000FF]/40'
                        : 'bg-black/20 text-slate-500'
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>

            {/* Footer with Delete */}
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-white/5">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3 text-[#7000FF]" />
                Auto-Activates via AlarmManager
              </span>
              <button
                onClick={() => handleDeleteSchedule(schedule.id)}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                title="Delete Schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161138] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Create Daily Study Schedule</h3>
            <p className="text-xs text-slate-400 mb-5">
              Distracting apps will automatically lock during this exact time frame.
            </p>

            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Schedule Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening JEE Revision, Night Deep Focus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7000FF]"
                />
              </div>

              {/* Time pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Start Time
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(Number(e.target.value))}
                      className="flex-1 px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}:00 {i >= 12 ? 'PM' : 'AM'}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startMinute}
                      onChange={(e) => setStartMinute(Number(e.target.value))}
                      className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                    >
                      <option value={0}>:00</option>
                      <option value={15}>:15</option>
                      <option value={30}>:30</option>
                      <option value={45}>:45</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    End Time
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(Number(e.target.value))}
                      className="flex-1 px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}:00 {i >= 12 ? 'PM' : 'AM'}
                        </option>
                      ))}
                    </select>
                    <select
                      value={endMinute}
                      onChange={(e) => setEndMinute(Number(e.target.value))}
                      className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                    >
                      <option value={0}>:00</option>
                      <option value={15}>:15</option>
                      <option value={30}>:30</option>
                      <option value={45}>:45</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Day selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Active Days of Week
                </label>
                <div className="flex gap-1.5 justify-between">
                  {daysLabel.map((d, index) => {
                    const isSelected = selectedDays.includes(index);
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => toggleDay(index)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#7000FF] text-white shadow-md shadow-[#7000FF]/30'
                            : 'bg-black/30 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {d.slice(0, 1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#4F46E5] text-white text-xs font-bold shadow-lg shadow-[#7000FF]/30"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
