'use client';

import { useTranslations } from 'next-intl';
import { getThemeProgress, getThemeTitle } from '@/services/progressionService';

interface ThemeProgressCirclesProps {
  explorerCount: number;
  crafterCount: number;
  architectCount: number;
}

const circleConfig = [
  { key: 'Explorer', color: 'text-accent-vert', bg: 'bg-accent-vert/10' },
  { key: 'Crafter', color: 'text-exalt-blue', bg: 'bg-exalt-blue/10' },
  { key: 'Architecte', color: 'text-accent-rose', bg: 'bg-accent-rose/10' },
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
        return (
          <div key={circle.key} className={`rounded-xl border border-border p-4 ${circle.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t(`circle.${circle.key}`)}</p>
                <p className={`text-2xl font-semibold ${circle.color}`}>{title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{t('circle.progress')}</p>
                <p className="text-lg font-semibold">{percent}%</p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${circle.color.replace('text-', 'bg-')}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {nextTarget ? t('circle.next', { count: nextTarget }) : t('circle.max')}
            </p>
          </div>
        );
      })}
    </div>
  );
}
