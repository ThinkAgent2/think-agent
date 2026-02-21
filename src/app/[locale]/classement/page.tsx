'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getLeaderboard } from '@/lib/supabase/queries';
import type { LeaderboardEntry } from '@/types/database';
import { Podium } from '@/components/gamification/Podium';
import { LeaderboardList } from '@/components/gamification/LeaderboardList';

export default function ClassementPage() {
  const t = useTranslations('leaderboard');
  const [global, setGlobal] = useState<LeaderboardEntry[]>([]);
  const [league, setLeague] = useState<LeaderboardEntry[]>([]);
  const [scope, setScope] = useState<'global' | 'league' | 'circle' | 'entity'>('global');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const [globalData, leagueData] = await Promise.all([
        getLeaderboard(50),
        getLeaderboard(50),
      ]);
      if (!cancelled) {
        setGlobal(globalData);
        setLeague(leagueData);
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
  const leagueTop3 = league.slice(0, 3);
  const leagueRest = league.slice(3);

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
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <button className={`px-3 py-1 rounded-full text-sm border ${scope === 'global' ? 'border-accent-cyan text-accent-cyan' : 'border-border text-muted-foreground'}`} onClick={() => setScope('global')}>{t('global')}</button>
                <button className={`px-3 py-1 rounded-full text-sm border ${scope === 'league' ? 'border-accent-cyan text-accent-cyan' : 'border-border text-muted-foreground'}`} onClick={() => setScope('league')}>{t('league')}</button>
                <button className={`px-3 py-1 rounded-full text-sm border ${scope === 'circle' ? 'border-accent-cyan text-accent-cyan' : 'border-border text-muted-foreground'}`} onClick={() => setScope('circle')}>{t('themes')}</button>
                <button className={`px-3 py-1 rounded-full text-sm border ${scope === 'entity' ? 'border-accent-cyan text-accent-cyan' : 'border-border text-muted-foreground'}`} onClick={() => setScope('entity')}>{t('entity')}</button>
              </div>

              {scope === 'global' && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">{t('global')}</h2>
                  <Podium entries={globalTop3} />
                  <div className="mt-4">
                    <LeaderboardList entries={globalRest} />
                  </div>
                </section>
              )}

              {scope === 'league' && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">{t('league')}</h2>
                  <Podium entries={leagueTop3} />
                  <div className="mt-4">
                    <LeaderboardList entries={leagueRest} />
                  </div>
                </section>
              )}

              {scope === 'circle' && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">{t('themes')}</h2>
                  <Podium entries={globalTop3} />
                  <div className="mt-4">
                    <LeaderboardList entries={globalRest} />
                  </div>
                </section>
              )}

              {scope === 'entity' && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">{t('entity')}</h2>
                  <Podium entries={globalTop3} />
                  <div className="mt-4">
                    <LeaderboardList entries={globalRest} />
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
