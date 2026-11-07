import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3.5 py-2 text-xs font-medium shadow-xl border border-neutral-700">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — Notes and study decks cached locally</span>
    </div>
  );
};
