'use client';

import { useTranslations } from 'next-intl';
import { getThemeProgress, getThemeTitle } from '@/services/progressionService';

interface ThemeProgressCirclesProps {
  explorerCount: number;
  crafterCount: number;
  architectCount: number;
}

const circleConfig = [
  { key: 'Explorer', color: 'text-accent-vert', bg: 'bg-accent-vert/10', fill: '#72F39A' },
  { key: 'Crafter', color: 'text-exalt-blue', bg: 'bg-exalt-blue/10', fill: '#2BD3FF' },
  { key: 'Architecte', color: 'text-accent-rose', bg: 'bg-accent-rose/10', fill: '#FF77C8' },
] as const;

export function ThemeProgressCircles({ explorerCount, crafterCount, architectCount }: ThemeProgressCirclesProps) {
  const t = useTranslations('profile');
  const counts = {
    Explorer: explorerCount,
    Crafter: crafterCount,
    Architecte: architectCount,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {circleConfig.map((circle) => {
        const count = counts[circle.key];
        const { progress, nextTarget } = getThemeProgress(count);
        const title = getThemeTitle(count);
        const percent = Math.round(progress * 100);
        const fill = circle.fill;
        return (
          <div key={circle.key} className={`rounded-xl border border-border p-4 ${circle.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t(`circle.${circle.key}`)}</p>
                <p className={`text-2xl font-semibold ${circle.color}`}>{title}</p>
              </div>
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  background: `conic-gradient(${fill} ${percent}%, hsl(var(--muted)) 0%)`,
                }}
              >
                <span className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                  {percent}%
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {nextTarget ? t('circle.next', { count: nextTarget }) : t('circle.max')}
            </p>
          </div>
        );
      })}
    </div>
  );
}

