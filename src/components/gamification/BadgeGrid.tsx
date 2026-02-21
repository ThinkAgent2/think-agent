'use client';

import { useTranslations } from 'next-intl';
import type { Badge } from '@/types/database';

const rarityStyles: Record<string, string> = {
  common: 'bg-muted text-foreground',
  rare: 'bg-blue-500/15 text-blue-300',
  epic: 'bg-purple-500/20 text-purple-300',
  legendary: 'bg-yellow-500/20 text-yellow-300',
};

interface BadgeGridProps {
  badges: Badge[];
  showLegendaryDescription?: boolean;
}

export function BadgeGrid({ badges, showLegendaryDescription = false }: BadgeGridProps) {
  const t = useTranslations('profile');
  if (badges.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('noBadges')}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => {
        const rarity = badge.rarity || 'common';
        const description = rarity === 'legendary' && !showLegendaryDescription
          ? t('legendaryHidden')
          : badge.description;
        return (
          <div key={badge.id} className={`rounded-lg border border-border p-3 ${rarityStyles[rarity] || ''}`}>
            <div className="text-2xl">{badge.icon || badge.emoji}</div>
            <div className="text-sm font-semibold mt-2">{badge.nom}</div>
            {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
          </div>
        );
      })}
    </div>
  );
}
