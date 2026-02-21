'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ProgressionEventType = 'xp' | 'level' | 'title' | 'badge' | 'streak' | 'league';

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
              className="pointer-events-none rounded-xl bg-card border border-border px-6 py-4 shadow-xl"
            >
              <div className="text-sm uppercase tracking-wide text-accent-jaune">{event.type}</div>
              <div className="text-lg font-semibold">{event.title}</div>
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
