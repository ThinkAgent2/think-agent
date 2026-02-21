'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';


export type ProgressionEventType = 'xp' | 'level' | 'title' | 'badge' | 'streak' | 'league';

const FlameIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="flameGradient" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0%" stopColor="#ff6a00"/>
        <stop offset="50%" stopColor="#ffb000"/>
        <stop offset="100%" stopColor="#fff1b8"/>
      </linearGradient>
    </defs>
    <path fill="url(#flameGradient)" d="M32 4c5 6 7 12 6 19 6-3 11-9 13-16 7 10 4 30-19 37C12 37 9 17 16 7c2 7 8 13 13 16-1-7 2-13 3-19z"/>
  </svg>
);

interface ProgressionEvent {
  id: string;
  type: ProgressionEventType;
  title: string;
  description?: string;
}

interface ProgressionOverlayContextValue {
  pushEvent: (event: Omit<ProgressionEvent, 'id'>) => void;
}

const ProgressionOverlayContext = createContext<ProgressionOverlayContextValue | null>(null);

export function useProgressionOverlay() {
  const ctx = useContext(ProgressionOverlayContext);
  if (!ctx) throw new Error('ProgressionOverlayProvider missing');
  return ctx;
}

export function ProgressionOverlayProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<ProgressionEvent[]>([]);

  const pushEvent = (event: Omit<ProgressionEvent, 'id'>) => {
    setEvents((prev) => [
      ...prev,
      { ...event, id: `${Date.now()}-${Math.random()}` },
    ]);
    setTimeout(() => {
      setEvents((prev) => prev.slice(1));
    }, 4000);
  };

  const value = useMemo(() => ({ pushEvent }), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as unknown as { __pushProgressionEvent?: (event: Omit<ProgressionEvent, 'id'>) => void }).__pushProgressionEvent = pushEvent;
    return () => {
      (window as unknown as { __pushProgressionEvent?: (event: Omit<ProgressionEvent, 'id'>) => void }).__pushProgressionEvent = undefined;
    };
  }, [pushEvent]);

  return (
    <ProgressionOverlayContext.Provider value={value}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center pt-10 overflow-visible">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`pointer-events-none rounded-2xl bg-card/90 border px-6 py-4 shadow-2xl backdrop-blur relative overflow-visible min-h-[96px] ${event.type === 'title' && event.title.includes('Maître') ? 'border-orange-300/60 shadow-[0_0_45px_rgba(255,150,0,0.55)]' : 'border-border'}`}
            >
              <div className="text-sm uppercase tracking-wide text-accent-jaune">{event.type}</div>
              <div className="text-lg font-semibold">{event.title}</div>
              {event.type === 'title' && event.title.includes('Maître') && (
                <motion.div
                  className="absolute -top-8 -right-6 text-orange-400 drop-shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.15, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.2 }}><FlameIcon className="h-16 w-16 drop-shadow-[0_0_24px_rgba(255,140,0,0.9)]" /></motion.div>
                </motion.div>
              )}
              {event.type === 'streak' && (
                <motion.div
                  className="absolute -top-8 -left-6 text-orange-400 drop-shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.15, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.2 }}><FlameIcon className="h-16 w-16 drop-shadow-[0_0_24px_rgba(255,140,0,0.9)]" /></motion.div>
                </motion.div>
              )}
              {event.description && (
                <div className="text-sm text-muted-foreground">{event.description}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ProgressionOverlayContext.Provider>
  );
}
