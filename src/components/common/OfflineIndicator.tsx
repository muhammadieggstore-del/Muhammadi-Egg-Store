import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline status"
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 z-50 flex items-center justify-between gap-3 rounded-xl bg-neutral-900/95 text-white px-4 py-3 shadow-xl backdrop-blur-md border border-neutral-700 max-w-md mx-auto"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs font-medium">Offline mode: You can still view cached products & call/WhatsApp us directly.</span>
      </div>
      <a
        href="tel:+916392855719"
        className="shrink-0 px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold text-[11px] hover:bg-amber-400"
      >
        Call Store
      </a>
    </aside>
  );
};
