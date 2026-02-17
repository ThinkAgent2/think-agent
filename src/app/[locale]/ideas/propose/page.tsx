'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IdeaProposalForm } from '@/components/ideas/IdeaProposalForm';
import { useAuth } from '@/lib/auth';
import { getUserIdeas } from '@/lib/supabase/queries';
import { useEffect, useState } from 'react';

export default function ProposeIdeaPage() {
  const { user } = useAuth();
  const t = useTranslations('ideas.propose');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function loadCount() {
      if (!user) return;
      const ideas = await getUserIdeas(user.id);
      setPendingCount(ideas.filter((idea) => idea.statut === 'Proposee').length);
    }
    loadCount();
  }, [user]);

  const limitReached = pendingCount >= 3;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToIdeas')}
          </Link>

          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

          {user ? (
            limitReached ? (
              <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                {t('limitReached')}
              </div>
            ) : (
              <IdeaProposalForm authorId={user.id} />
            )
          ) : (
            <p className="text-muted-foreground">{t('loginRequired')}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
