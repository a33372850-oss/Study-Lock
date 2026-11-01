export interface StudySchedule {
  id: string;
  title: string;
  startHour: number;   // 0-23
  startMinute: number; // 0-59
  endHour: number;
  endMinute: number;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  isEnabled: boolean;
}

export interface AppPolicy {
  packageName: string;
  appName: string;
  category: 'social' | 'games' | 'video' | 'chat' | 'study' | 'tools';
  isBlocked: boolean;
  iconName: string;
}

export interface StudyStats {
  todaySeconds: number;
  dailyGoalMinutes: number;
  currentStreakDays: number;
  totalCompletedSessions: number;
  weeklyMinutes: number[]; // 7 days (Mon-Sun)
}

export type AmbientSoundType = 'none' | 'whitenoise' | 'rain' | 'lofi' | 'binaural' | 'clock';

export interface FocusSoundState {
  soundType: AmbientSoundType;
  isPlaying: boolean;
  volume: number; // 0 to 1
  autoPlayOnLock: boolean;
}

export type ViewTab = 'dashboard' | 'schedule' | 'apps' | 'simulator' | 'permissions' | 'apk_builder';
