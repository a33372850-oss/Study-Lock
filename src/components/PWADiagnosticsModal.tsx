import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Smartphone, 
  QrCode, 
  RefreshCw,
  Layers,
  ShieldCheck,
  X
} from 'lucide-react';

interface PWADiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWADiagnosticsModal: React.FC<PWADiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const [manifestStatus, setManifestStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [swStatus, setSwStatus] = useState<'checking' | 'active' | 'not_registered'>('checking');
  const [iconsStatus, setIconsStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [isInIframe, setIsInIframe] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // Check if running inside iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Generate QR Code
    if (appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#0A071E',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code generation error', err));
    }

    // Run diagnostics
    runDiagnostics();
  }, [appUrl]);

  const runDiagnostics = async () => {
    // 1. Check Manifest
    try {
      setManifestStatus('checking');
      const res = await fetch('/manifest.json');
      if (res.ok) {
        const data = await res.json();
        if (data.name && data.short_name && data.icons && data.icons.length >= 2) {
          setManifestStatus('valid');
        } else {
          setManifestStatus('invalid');
        }
      } else {
        setManifestStatus('invalid');
      }
    } catch {
      setManifestStatus('invalid');
    }

    // 2. Check Service Worker
    try {
      setSwStatus('checking');
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration('/');
        if (reg && (reg.active || reg.installing || reg.waiting)) {
          setSwStatus('active');
        } else {
          setSwStatus('not_registered');
        }
      } else {
        setSwStatus('not_registered');
      }
    } catch {
      setSwStatus('not_registered');
    }

    // 3. Check PNG icons
    try {
      setIconsStatus('checking');
      const img192 = new Image();
      img192.src = '/pwa-192x192.png';
      img192.onload = () => {
        const img512 = new Image();
        img512.src = '/pwa-512x512.png';
        img512.onload = () => setIconsStatus('valid');
        img512.onerror = () => setIconsStatus('invalid');
      };
      img192.onerror = () => setIconsStatus('invalid');
    } catch {
      setIconsStatus('invalid');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#140E34] border border-white/20 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#00F5D4]/15 text-[#00F5D4] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">PWA & Phone Install Fixer</h3>
            <span className="text-xs text-[#00F5D4]">Live Technical Diagnostics</span>
          </div>
        </div>

        {/* Core reason banner if in iframe */}
        {isInIframe && (
          <div className="my-4 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>इंस्टॉल क्यों नहीं दिख रहा? (Why Install is Blocked here)</span>
            </div>
            <p>
              आप अभी AI Studio के <strong>Preview Window (iframe)</strong> के अंदर हैं। Google Chrome और Android सुरक्षा कारणों से <strong>iframe के अंदर Install Popup ब्लॉक रखते हैं</strong>।
            </p>
            <p className="font-semibold text-white">
              समाधान: ऐप को सीधे <strong>नया टैब (New Tab)</strong> या अपने फोन के Chrome में खोलें!
            </p>
            <div className="pt-1 flex gap-2">
              <a
                href={appUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                नया टैब में खोलें (Open in Standalone Tab)
              </a>
            </div>
          </div>
        )}

        {/* Live Diagnostics Checklist */}
        <div className="space-y-2.5 my-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>PWA Engine Health</span>
            <button onClick={runDiagnostics} className="text-[#00F5D4] hover:underline flex items-center gap-1 normal-case text-[11px]">
              <RefreshCw className="w-3 h-3" /> Re-check
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Manifest */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
              {manifestStatus === 'valid' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              )}
              <div>
                <span className="font-bold text-white block">Manifest.json</span>
                <span className="text-[10px] text-slate-400">
                  {manifestStatus === 'valid' ? 'Valid (W3C Standard)' : 'Checking...'}
                </span>
              </div>
            </div>

            {/* Service Worker */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
              {swStatus === 'active' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-white block">Service Worker</span>
                <span className="text-[10px] text-slate-400">Registered (/sw.js)</span>
              </div>
            </div>

            {/* Icons */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
              {iconsStatus === 'valid' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-white block">PNG Icons</span>
                <span className="text-[10px] text-slate-400">192px, 512px, Mask</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scan with phone QR Code */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 my-4 flex flex-col sm:flex-row items-center gap-4">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="Scan to open on phone"
              className="w-28 h-28 rounded-xl bg-white p-1.5 shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-slate-400" />
            </div>
          )}

          <div className="text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#00F5D4] uppercase tracking-wider block mb-0.5">
              मोबाइल से स्कैन करें (Scan with Phone)
            </span>
            <h4 className="text-sm font-bold text-white mb-1">
              फोन के कैमरे से सीधे स्कैन करें
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
              अपने मोबाइल का कैमरा या Google Lens ऑन करके यह QR कोड स्कैन करें, फिर Chrome में <strong>"Install app"</strong> दबाएं।
            </p>
            <button
              onClick={copyUrl}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 mx-auto sm:mx-0 transition-colors"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedUrl ? 'URL Copied!' : 'Copy Link for Phone'}
            </button>
          </div>
        </div>

        {/* PWABuilder explanation note */}
        <div className="bg-[#0A071E] rounded-xl p-3 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-white block mb-0.5">PWABuilder के बारे में जरूरी जानकारी:</strong>
          PWABuilder वेबसाइट Google Cloud Run की प्राइवेट कुकी सिक्योरिटी (`__cookie_check`) के कारण AI Studio के सीधे dev लिंक को सीधे स्कैन नहीं कर पाती। लेकिन आपको PWABuilder की ज़रूरत ही नहीं है — ऊपर दिए गए लिंक को फोन में खोलते ही यह <strong>डायरेक्ट आपके फोन में Install</strong> हो जाती है!
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
