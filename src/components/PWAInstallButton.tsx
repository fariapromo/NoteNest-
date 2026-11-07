import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Laptop } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'sidebar' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running standalone, display a subtle "Installed App" badge or hide
  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg">
          <Check className="w-3.5 h-3.5" />
          <span>NoteNest Installed</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Install <strong>NoteNest</strong> on your phone or desktop for offline note study & instant sync.</span>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-semibold rounded-md transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install on Device</span>
          </button>
        </div>

        {showModal && <InstallModal onClose={() => setShowModal(false)} isIOS={isIOS} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 rounded-lg transition-colors whitespace-nowrap"
        title="Install NoteNest on your device"
      >
        <Download className="w-3.5 h-3.5 text-neutral-700" />
        <span>Install App</span>
      </button>

      {showModal && <InstallModal onClose={() => setShowModal(false)} isIOS={isIOS} />}
    </>
  );
};

const InstallModal: React.FC<{ onClose: () => void; isIOS: boolean }> = ({ onClose, isIOS }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Download className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Install NoteNest App</h3>
              <p className="text-xs text-neutral-500">Run natively on your phone, tablet, or laptop</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-neutral-700">
          {isIOS ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
              <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-700" />
                <span>iPhone / iPad (Safari)</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 text-neutral-600">
                <li>Tap the <strong>Share</strong> icon (box with upward arrow) at the bottom of Safari.</li>
                <li>Scroll down the menu and select <strong>&quot;Add to Home Screen&quot;</strong>.</li>
                <li>Tap <strong>&quot;Add&quot;</strong> in the top-right corner to launch NoteNest like a native app.</li>
              </ol>
            </div>
          ) : (
            <>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-2">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-neutral-700" />
                  <span>Desktop (Chrome, Edge, Brave)</span>
                </div>
                <p className="text-neutral-600">
                  Click the <strong>Install</strong> icon in the address bar (or menu &gt; <em>&quot;Install NoteNest...&quot;</em>) to run NoteNest in a distraction-free window.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-2">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-neutral-700" />
                  <span>Android (Chrome / Samsung Internet)</span>
                </div>
                <p className="text-neutral-600">
                  Tap the three dots (⋮) in the top-right and choose <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </p>
              </div>
            </>
          )}

          <div className="text-neutral-500 pt-1 text-[11px] leading-relaxed">
            Benefits: Full offline access to your saved notes, faster loading, distraction-free study mode, and home screen icon.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
