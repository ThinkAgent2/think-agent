'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import type { Challenge, Solution, User } from '@/types/database';
import { formatNameFromEmail } from '@/lib/userName';

interface SolutionRow extends Solution {
  user: Pick<User, 'id' | 'email' | 'nom'> | null;
}

export default function AdminChallengeStatsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const t = useTranslations('challenges.stats');
  const tCommon = useTranslations('common');
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);

  const isAdmin = user?.role === 'Administrateur';

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      const supabase = createClient();

      const { data: challengeData } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single();

      const { data: solutionsData } = await supabase
        .from('solutions')
        .select(`*, user:users(id, email, nom)`)
        .eq('challenge_id', id)
        .order('created_at', { ascending: false });

      if (!isCancelled) {
        setChallenge((challengeData as Challenge) ?? null);
        setSolutions((solutionsData as SolutionRow[]) ?? []);
        setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  const stats = useMemo(() => {
    const totalAttempts = solutions.length;
    const submitted = solutions.filter((s) => s.statut === 'Soumise').length;
    const evaluated = solutions.filter((s) => s.statut === 'Évaluée').length;
    const validated = solutions.filter((s) => s.statut === 'Évaluée' && (s.note ?? 0) >= 3).length;
    const failed = solutions.filter((s) => s.statut === 'Évaluée' && (s.note ?? 0) < 3).length;
    const successRate = evaluated > 0 ? Math.round((validated / evaluated) * 100) : 0;
    return { totalAttempts, submitted, evaluated, validated, failed, successRate };
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
          <Link
            href={`/challenges/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon('back')}
          </Link>

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
              <CardContent className="text-3xl font-bold">{stats.totalAttempts}</CardContent>
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
              {solutions.length === 0 ? (
                <p className="text-sm text-muted-foreground">{tCommon('noResults')}</p>
              ) : (
                <div className="space-y-2">
                  {solutions.map((solution) => {
                    const name = solution.user?.nom || (solution.user?.email ? formatNameFromEmail(solution.user.email) : '—');
                    const statusLabel = solution.statut === 'Soumise'
                      ? t('submitted')
                      : (solution.note ?? 0) >= 3
                        ? t('validated')
                        : t('failed');
                    return (
                      <div key={solution.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{name}</p>
                          <p className="text-xs text-muted-foreground truncate">{solution.user?.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{statusLabel}</Badge>
                          <span className="text-xs text-muted-foreground">{t('score')}: {solution.note ?? '-'}</span>
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
