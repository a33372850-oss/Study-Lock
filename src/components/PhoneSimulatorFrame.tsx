import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneSimulatorFrameProps {
  children: React.ReactNode;
  isLocked: boolean;
}

export const PhoneSimulatorFrame: React.FC<PhoneSimulatorFrameProps> = ({ children, isLocked }) => {
  // Current time representation for phone status bar
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="mx-auto max-w-[430px] w-full rounded-[48px] p-3 bg-gradient-to-b from-[#2B235A] to-[#120E2E] shadow-2xl shadow-[#7000FF]/25 border-4 border-[#3D3375]">
      {/* Phone Screen Container */}
      <div className="relative rounded-[40px] bg-[#0A071E] overflow-hidden flex flex-col min-h-[780px] max-h-[850px] border border-white/10">
        {/* Top Status Bar */}
        <div className="sticky top-0 z-30 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 bg-[#0A071E]/90 backdrop-blur-md">
          {/* Time */}
          <span className="font-semibold text-xs tracking-tight">{timeStr}</span>

          {/* Camera Notch Punchhole */}
          <div className="w-4 h-4 rounded-full bg-black border border-white/20 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
          </div>

          {/* Icons: Signal, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-[#00F5D4]" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
          {children}
        </div>

        {/* Bottom Android Gesture Bar */}
        <div className="sticky bottom-0 z-30 pt-2 pb-3 flex items-center justify-center bg-[#0A071E]/90 backdrop-blur-md">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
