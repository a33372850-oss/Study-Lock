import React, { useState } from 'react';
import { 
  Download, 
  Github, 
  Smartphone, 
  Check, 
  Copy, 
  FolderArchive, 
  Terminal, 
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { generateAndroidProjectZip } from '../utils/androidProjectExport';

export const ApkExportModal: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'StudyLock-FocusMode-Android-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export zip', err);
    } finally {
      setIsExporting(false);
    }
  };

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://studylock.app';

  const copyAppUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedAppUrl(true);
    setTimeout(() => setCopiedAppUrl(false), 2500);
  };

  const workflowCode = `name: Build Study Lock APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
    - uses: gradle/actions/setup-gradle@v3
    - name: Build APK
      run: ./gradlew assembleDebug
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: StudyLock-APK
        path: app/build/outputs/apk/debug/*.apk
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(workflowCode);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Primary Action Card */}
      <div className="bg-gradient-to-r from-[#171040] via-[#1A1249] to-[#0D1535] border border-[#7000FF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            100% PWA & ANDROID READY
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Install as Android PWA or Package to APK
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            STUDY LOCK is now fully configured as a Progressive Web App (PWA) with a valid W3C Manifest, high-resolution PNG icons (192x192, 512x512, maskable), and active Service Worker. You can install it directly on your Android phone or use PWABuilder / Android Studio.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#4F46E5] hover:from-[#6000E0] hover:to-[#4338CA] text-white font-bold text-xs shadow-xl shadow-[#7000FF]/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <FolderArchive className="w-4 h-4" />
              {isExporting ? 'Generating ZIP...' : 'Download Full Android Studio Project (.ZIP)'}
            </button>
            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-[#00F5D4]" />
              Open PWABuilder.com
            </a>
          </div>
        </div>
      </div>

      {/* PWABuilder Android Packaging Card */}
      <div className="bg-[#130E2E] border border-[#00F5D4]/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/15 text-[#00F5D4] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00F5D4] uppercase tracking-wider">PWABuilder Android Packaging (TWA)</span>
              <h3 className="font-bold text-white text-base">Generate Signed Android APK via PWABuilder</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyAppUrl}
              className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-xs text-white border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              {copiedAppUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAppUrl ? 'URL Copied!' : 'Copy App URL'}
            </button>
          </div>
        </div>

        {/* PWABuilder Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00F5D4] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Manifest URL</span>
              <span className="text-[11px] text-slate-400">/manifest.json (Valid)</span>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00F5D4] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">PNG App Icons</span>
              <span className="text-[11px] text-slate-400">192px, 512px & Maskable</span>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00F5D4] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Service Worker</span>
              <span className="text-[11px] text-slate-400">/sw.js (Fetch & Cache)</span>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00F5D4] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Display Mode</span>
              <span className="text-[11px] text-slate-400">standalone (Fullscreen)</span>
            </div>
          </div>
        </div>

        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>Click <strong>"Copy App URL"</strong> above to copy your live app URL.</li>
          <li>Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-[#00F5D4] underline font-medium">PWABuilder.com</a> and paste the URL.</li>
          <li>Click <strong>Start</strong>. PWABuilder will verify the Manifest and Service Worker with green scores.</li>
          <li>Click <strong>Package for Stores ➔ Android</strong>. PWABuilder builds your signed Android APK / AAB package ready for direct installation or Google Play Store release!</li>
        </ol>
      </div>

      {/* Two Alternate Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: GitHub Free Cloud APK */}
        <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#00F5D4] uppercase tracking-wider">Method 2</span>
                <h3 className="font-bold text-white text-base">Build APK via GitHub Actions</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              <strong>बिना कंप्यूटर के मोबाइल से ही APK डाउनलोड करें:</strong>
            </p>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside mb-4 leading-relaxed">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#00F5D4] underline">GitHub.com</a> पर फ्री अकाउंट बनाएं।</li>
              <li>नई रिपॉजिटरी बनाएं: <code className="text-white bg-black/40 px-1 py-0.5 rounded">StudyLockApp</code></li>
              <li>डाउनलोड की गई ZIP फाइल की सभी फाइलें अपलोड करें।</li>
              <li>GitHub पर <strong>Actions</strong> टैब में जाएँ और <code className="text-white bg-black/40 px-1 py-0.5 rounded">Run workflow</code> पर क्लिक करें।</li>
              <li>2 मिनट में <strong>Artifacts</strong> से अपनी तैयार <strong>StudyLock.apk</strong> डाउनलोड कर लें!</li>
            </ol>
          </div>

          <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Workflow file included in ZIP</span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-xs text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedWorkflow ? 'Copied' : 'Copy Workflow'}
            </button>
          </div>
        </div>

        {/* Method 2: Android Studio Laptop */}
        <div className="bg-[#130E2E] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[#00F5D4]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Method 3</span>
                <h3 className="font-bold text-white text-base">Build via Android Studio (PC)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              <strong>अगर आपके पास लैपटॉप / कंप्यूटर है:</strong>
            </p>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside mb-4 leading-relaxed">
              <li>ZIP फाइल को Unzip (Extract) करें।</li>
              <li>Android Studio खोलें ➔ <strong>Open...</strong> ➔ प्रोजेक्ट फोल्डर चुनें।</li>
              <li>Gradle Sync पूरा होने का इंतज़ार करें।</li>
              <li>ऊपर मेनू में जाएँ: <strong>Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)</strong> पर क्लिक करें।</li>
              <li>नीचे आए पॉपअप में <strong>locate</strong> पर क्लिक करें और APK को फोन में ट्रांसफर कर लें!</li>
            </ol>
          </div>

          <div className="mt-2 pt-3 border-t border-white/10 text-xs text-slate-400">
            Target SDK: Android 14+ (SDK 35), Min SDK: Android 8.0 (SDK 26)
          </div>
        </div>
      </div>
    </div>
  );
};
