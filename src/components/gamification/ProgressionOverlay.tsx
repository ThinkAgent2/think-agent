'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';


export type ProgressionEventType = 'xp' | 'level' | 'title' | 'badge' | 'streak' | 'league';

const FlameIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2c1.8 2.2 2.6 4.6 2.3 7.1 2.2-1 4.2-3 5-5.6C22.7 8.6 19.5 20 12 22 4.5 20 1.3 8.6 4.7 3.5c.8 2.6 2.8 4.6 5 5.6C9.4 6.6 10.2 4.2 12 2z"/>
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
      <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center pt-10">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="pointer-events-none rounded-xl bg-card border border-border px-6 py-4 shadow-xl relative overflow-hidden"
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
                  <FlameIcon className="h-12 w-12" />
                </motion.div>
              )}
              {event.type === 'streak' && (
                <motion.div
                  className="absolute -top-8 -left-6 text-orange-400 drop-shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.15, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <FlameIcon className="h-12 w-12" />
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
