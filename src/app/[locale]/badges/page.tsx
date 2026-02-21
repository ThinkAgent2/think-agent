'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllBadges } from '@/lib/supabase/queries';
import type { Badge } from '@/types/database';

const rarityStyles: Record<string, string> = {
  common: 'bg-muted text-foreground',
  rare: 'bg-blue-500/15 text-blue-300',
  epic: 'bg-purple-500/20 text-purple-300',
  legendary: 'bg-yellow-500/20 text-yellow-300',
};

export default function BadgesPage() {
  const t = useTranslations('badges');
  const tProfile = useTranslations('profile');
  const locale = useLocale();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const data = await getAllBadges(locale);
      if (!cancelled) {
        setBadges(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('howToEarnDefault')}</p>

          {isLoading ? (
            <p className="text-muted-foreground">{t('loading', { default: 'Chargement...' })}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => {
                const rarity = badge.rarity || 'common';
                const description = rarity === 'legendary' ? tProfile('legendaryHidden') : badge.description;
                return (
                  <div key={badge.id} className={`rounded-lg border border-border p-3 ${rarityStyles[rarity] || ''}`}>
                    <div className="text-2xl">{badge.icon || badge.emoji}</div>
                    <div className="text-sm font-semibold mt-2">{badge.nom}</div>
                    {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
