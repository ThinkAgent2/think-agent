'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getLeaderboard, getLeaderboardRecent } from '@/lib/supabase/queries';
import type { LeaderboardEntry } from '@/types/database';
import { Podium } from '@/components/gamification/Podium';
import { LeaderboardList } from '@/components/gamification/LeaderboardList';

export default function ClassementPage() {
  const t = useTranslations('leaderboard');
  const [global, setGlobal] = useState<LeaderboardEntry[]>([]);
  const [weekly, setWeekly] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const [globalData, weeklyData] = await Promise.all([
        getLeaderboard(50),
        getLeaderboardRecent(50),
      ]);
      if (!cancelled) {
        setGlobal(globalData);
        setWeekly(weeklyData);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const globalTop3 = global.slice(0, 3);
  const globalRest = global.slice(3);
  const weeklyTop3 = weekly.slice(0, 3);
  const weeklyRest = weekly.slice(3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

          {isLoading ? (
            <p className="text-muted-foreground">{t('loading')}</p>
          ) : (
            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-semibold mb-4">{t('global')}</h2>
                <Podium entries={globalTop3} />
                <div className="mt-4">
                  <LeaderboardList entries={globalRest} />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">{t('weekly')}</h2>
                <Podium entries={weeklyTop3} />
                <div className="mt-4">
                  <LeaderboardList entries={weeklyRest} />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
