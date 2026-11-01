import { AppPolicy, StudySchedule } from '../types';

export const DEFAULT_SCHEDULES: StudySchedule[] = [
  {
    id: 'sched-1',
    title: 'Evening Deep Study',
    startHour: 17, // 5:00 PM
    startMinute: 0,
    endHour: 20,   // 8:00 PM
    endMinute: 0,
    daysOfWeek: [1, 2, 3, 4, 5, 6], // Mon - Sat
    isEnabled: true,
  },
  {
    id: 'sched-2',
    title: 'Early Morning Revision',
    startHour: 6,  // 6:00 AM
    startMinute: 0,
    endHour: 7,    // 7:30 AM
    endMinute: 30,
    daysOfWeek: [1, 2, 3, 4, 5],
    isEnabled: false,
  },
];

export const DEFAULT_APPS: AppPolicy[] = [
  // Distracting Apps (Default Blocked)
  {
    packageName: 'com.instagram.android',
    appName: 'Instagram',
    category: 'social',
    isBlocked: true,
    iconName: 'instagram',
  },
  {
    packageName: 'com.whatsapp',
    appName: 'WhatsApp',
    category: 'chat',
    isBlocked: true,
    iconName: 'message-circle',
  },
  {
    packageName: 'com.google.android.youtube',
    appName: 'YouTube',
    category: 'video',
    isBlocked: true,
    iconName: 'youtube',
  },
  {
    packageName: 'com.snapchat.android',
    appName: 'Snapchat',
    category: 'social',
    isBlocked: true,
    iconName: 'camera',
  },
  {
    packageName: 'com.facebook.katana',
    appName: 'Facebook',
    category: 'social',
    isBlocked: true,
    iconName: 'facebook',
  },
  {
    packageName: 'com.twitter.android',
    appName: 'X (Twitter)',
    category: 'social',
    isBlocked: true,
    iconName: 'twitter',
  },
  {
    packageName: 'com.dts.freefireth',
    appName: 'BGMI & Mobile Games',
    category: 'games',
    isBlocked: true,
    iconName: 'gamepad-2',
  },
  {
    packageName: 'com.netflix.mediaclient',
    appName: 'Netflix & OTT',
    category: 'video',
    isBlocked: true,
    iconName: 'film',
  },

  // Whitelisted / Allowed Educational Apps
  {
    packageName: 'com.adobe.reader',
    appName: 'Adobe Acrobat PDF',
    category: 'study',
    isBlocked: false,
    iconName: 'file-text',
  },
  {
    packageName: 'live.pw.akash',
    appName: 'Physics Wallah (PW)',
    category: 'study',
    isBlocked: false,
    iconName: 'graduation-cap',
  },
  {
    packageName: 'org.khanacademy.android',
    appName: 'Khan Academy',
    category: 'study',
    isBlocked: false,
    iconName: 'book-open',
  },
  {
    packageName: 'nic.ncert.epathshala',
    appName: 'ePathshala (NCERT Books)',
    category: 'study',
    isBlocked: false,
    iconName: 'library',
  },
  {
    packageName: 'notion.id',
    appName: 'Notion Notes',
    category: 'tools',
    isBlocked: false,
    iconName: 'edit-3',
  },
  {
    packageName: 'com.google.android.apps.docs',
    appName: 'Google Drive & Docs',
    category: 'tools',
    isBlocked: false,
    iconName: 'folder',
  },
];

export const MOTIVATIONAL_QUOTES = [
  {
    hindi: '📚 अभी पढ़ाई का समय है! अपने भविष्य पर ध्यान दो।',
    subHindi: 'जो आज पसीने से लिखेगा, वही कल अपना मुकद्दर बदलेगा।',
    english: 'Study hard in silence, let your success make the noise.',
  },
  {
    hindi: 'समय और शिक्षा का सही उपयोग ही इंसान को सफल बना देता है।',
    subHindi: 'सोशल मीडिया कल भी रहेगा, लेकिन यह कीमती समय वापस नहीं आएगा।',
    english: 'Consistency is what transforms average into excellence.',
  },
  {
    hindi: 'सपनों को सच करने से पहले, उन्हें गंभीरता से जीना पड़ता है।',
    subHindi: 'एक-एक मिनट का हिसाब रखो, हर घंटे की मेहनत तुम्हारी पहचान बनेगी।',
    english: 'Do something today that your future self will thank you for.',
  },
  {
    hindi: 'मंजिलें उन्हीं को मिलती हैं जिनके सपनों में जान होती है!',
    subHindi: 'पंखों से कुछ नहीं होता, हौसलों से उड़ान होती है।',
    english: 'Discipline is choosing between what you want now and what you want most.',
  },
  {
    hindi: 'किताबों से दोस्ती कर लो, कभी किसी के सामने झुकना नहीं पड़ेगा।',
    subHindi: 'आज की एकाग्रता, कल की सबसे बड़ी ताकत बनेगी।',
    english: 'Focus is the gateway to mastery and peace of mind.',
  },
];
