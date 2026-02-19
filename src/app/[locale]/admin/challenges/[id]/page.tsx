'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import { getAdminChallengeStats } from '@/app/actions/admin.stats';
import type { Challenge, Solution, User } from '@/types/database';
import { formatNameFromEmail } from '@/lib/userName';
import { localizeChallenge } from '@/lib/supabase/localization';

interface SolutionRow extends Solution {
  user: Pick<User, 'id' | 'email' | 'nom'> | null;
}

export default function AdminChallengeStatsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations('challenges.stats');
  const tCommon = useTranslations('common');
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);
  const [participants, setParticipants] = useState<Array<{ user: Pick<User, 'id' | 'email' | 'nom'> | null; user_id?: string; statut: string }>>([]);
  const [participantsCount, setParticipantsCount] = useState(0);

  const isAdmin = user?.role === 'Administrateur';

  useEffect(() => {
    let isCancelled = false;

    if (typeof window !== 'undefined') {
      const lastRoute = sessionStorage.getItem('lastRoute');
      if (lastRoute) {
        sessionStorage.setItem('statsFrom', lastRoute);
      }
    }

    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      const supabase = createClient();

      const { data: challengeData } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single();

      const statsData = await getAdminChallengeStats(String(id));

      if (!isCancelled) {
        const localizedChallenge = challengeData ? localizeChallenge(challengeData as Challenge, locale) : null;
        setChallenge(localizedChallenge);
        setSolutions(statsData?.solutions ?? []);
        setParticipants(statsData?.participants ?? []);
        setParticipantsCount(statsData?.participantsCount ?? 0);
        setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  const solutionsByUserId = useMemo(() => {
    const map = new Map<string, Solution>();
    solutions.forEach((solution) => {
      map.set(solution.user_id, solution);
    });
    return map;
  }, [solutions]);

  const stats = useMemo(() => {
    const submitted = solutions.filter((s) => s.statut === 'Soumise').length;
    const evaluated = solutions.filter((s) => s.statut === 'Évaluée').length;
    const validated = solutions.filter((s) => s.statut === 'Évaluée' && (s.note ?? 0) >= 3).length;
    const failed = solutions.filter((s) => s.statut === 'Évaluée' && (s.note ?? 0) < 3).length;
    const successRate = evaluated > 0 ? Math.round((validated / evaluated) * 100) : 0;
    return { submitted, evaluated, validated, failed, successRate };
  }, [solutions]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{tCommon('noAccess')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-exalt-blue" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <button
            onClick={() => {
              const lastRoute = sessionStorage.getItem('lastRoute');
              if (lastRoute && lastRoute !== window.location.pathname) {
                window.location.href = lastRoute;
                return;
              }
              window.history.back();
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon('back')}
          </button>

          <div>
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>

          {challenge && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{challenge.titre}</CardTitle>
                <CardDescription className="flex flex-wrap gap-2">
                  <Badge variant="outline">{challenge.niveau_associe}</Badge>
                  <Badge variant="outline">{challenge.difficulte} ★</Badge>
                  <Badge variant="outline">{challenge.type}</Badge>
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('totalAttempts')}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{participantsCount}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('submitted')}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{stats.submitted}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('evaluated')}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{stats.evaluated}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('validated')}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-accent-vert">{stats.validated}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('failed')}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-destructive">{stats.failed}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('successRate')}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{stats.successRate}%</CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('listTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">{tCommon('noResults')}</p>
              ) : (
                <div className="space-y-2">
                  {participants.map((participant, index) => {
                    const name = participant.user?.nom || (participant.user?.email ? formatNameFromEmail(participant.user.email) : '—');
                    const userId = participant.user_id || participant.user?.id;
                    const solution = userId ? solutionsByUserId.get(userId) : undefined;
                    const statusLabel = solution
                      ? solution.statut === 'Soumise'
                        ? t('submitted')
                        : (solution.note ?? 0) >= 3
                          ? t('validated')
                          : t('failed')
                      : participant.statut === 'En_cours'
                        ? t('inProgress')
                        : t('submitted');

                    return (
                      <div key={`${userId ?? 'unknown'}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                        <div className="min-w-0">
                          {userId ? (
                            <Link href={`/users/${userId}`} className="font-medium truncate hover:text-accent-cyan">
                              {name}
                            </Link>
                          ) : (
                            <p className="font-medium truncate">{name}</p>
                          )}
                          <p className="text-xs text-muted-foreground truncate">{participant.user?.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{statusLabel}</Badge>
                          {solution && (
                            <span className="text-xs text-muted-foreground">{t('score')}: {solution.note ?? '-'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
