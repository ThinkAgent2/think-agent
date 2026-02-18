'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { ChallengeFilters } from '@/components/challenges/ChallengeFilters';
import { Loader2, Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { getChallenges, getUserParticipations } from '@/lib/supabase/queries';
import { useAuth } from '@/lib/auth';
import type { Challenge, Participation, ChallengeFilters as Filters } from '@/types/database';

export default function ChallengesPage() {
  const { user } = useAuth();
  const locale = useLocale();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('challenges');
  const tCommon = useTranslations('common');

  // Charger les challenges
  useEffect(() => {
    let isCancelled = false;

    async function loadChallenges() {
      setIsLoading(true);
      try {
        const data = await getChallenges(filters, locale);
        if (!isCancelled) {
          setChallenges(data);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadChallenges();
    return () => {
      isCancelled = true;
    };
  }, [filters, locale]);

  // Charger les participations de l'utilisateur
  useEffect(() => {
    async function loadParticipations() {
      if (user) {
        const data = await getUserParticipations(user.id);
        setParticipations(data);
      }
    }
    loadParticipations();
  }, [user]);

  // Trouver la participation pour un challenge
  const getParticipation = (challengeId: string): Participation | undefined => {
    return participations.find(p => p.challenge_id === challengeId);
  };

  // Grouper par niveau
  const challengesByLevel = {
    Explorer: challenges.filter((c) => c.niveau_associe === 'Explorer'),
    Crafter: challenges.filter((c) => c.niveau_associe === 'Crafter'),
    Architecte: challenges.filter((c) => c.niveau_associe === 'Architecte'),
  };

  const challengeCount = challenges.length;
  const countText = challengeCount > 1 
    ? t('countPlural', { count: challengeCount })
    : t('count', { count: challengeCount });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('catalog')}</h1>
              <p className="text-muted-foreground">
                {isLoading ? tCommon('loading') : countText}
              </p>
            </div>
            {user?.role === 'Administrateur' && (
              <Link href="/challenges/new">
                <Button className="bg-accent-jaune hover:bg-accent-jaune/80 text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('newChallenge')}
                </Button>
              </Link>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar filters */}
            <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto z-10 space-y-6 pr-2">
              <ChallengeFilters filters={filters} onFiltersChange={setFilters} />
              {user && (
                <Link href="/challenges/propose" className="block">
                  <Button className="w-full bg-exalt-blue hover:bg-exalt-blue/80 text-white font-semibold">
                    {t('proposeChallenge')}
                  </Button>
                </Link>
              )}
            </aside>

            {/* Challenges grid */}
            <div className="space-y-12">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-exalt-blue" />
                </div>
              ) : (
                <>
                  {/* Explorer */}
                  {challengesByLevel.Explorer.length > 0 && (
                    <section>
                      <h2 className="mb-6 text-2xl font-bold text-accent-vert flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-accent-vert" />
                        Explorer
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {challengesByLevel.Explorer.map((challenge) => (
                          <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            participation={getParticipation(challenge.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Crafter */}
                  {challengesByLevel.Crafter.length > 0 && (
                    <section>
                      <h2 className="mb-6 text-2xl font-bold text-exalt-blue flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-exalt-blue" />
                        Crafter
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {challengesByLevel.Crafter.map((challenge) => (
                          <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            participation={getParticipation(challenge.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Architecte */}
                  {challengesByLevel.Architecte.length > 0 && (
                    <section>
                      <h2 className="mb-6 text-2xl font-bold text-accent-rose flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-accent-rose" />
                        Architecte
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {challengesByLevel.Architecte.map((challenge) => (
                          <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            participation={getParticipation(challenge.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Empty state */}
                  {challenges.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        {t('empty')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
