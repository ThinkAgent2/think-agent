'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { getIdeasWithVotes, voteIdea } from '@/lib/supabase/queries';
import { IdeaCard } from '@/components/ideas/IdeaCard';
import type { IdeaWithVotes } from '@/types/database';

export default function IdeasPage() {
  const { user } = useAuth();
  const t = useTranslations('ideas');
  const [ideas, setIdeas] = useState<IdeaWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadIdeas() {
      setIsLoading(true);
      try {
        const data = await getIdeasWithVotes(user?.id ?? null);
        if (!isCancelled) {
          setIdeas(data.filter((idea) => idea.statut === 'Proposee'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadIdeas();
    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const handleVote = async (idea: IdeaWithVotes) => {
    if (!user) return;
    setIsVoting(idea.id);
    const success = await voteIdea(idea.id, user.id);
    if (success) {
      setIdeas((prev) =>
        prev.map((item) =>
          item.id === idea.id
            ? { ...item, votes: item.votes + 1, hasVoted: true }
            : item
        )
      );
    }
    setIsVoting(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <aside className="lg:col-span-1">
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h2 className="text-lg font-semibold">{t('proposeTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('proposeDescription')}</p>
                <Link href="/ideas/propose">
                  <Button size="sm" className="bg-exalt-blue hover:bg-exalt-blue/80 text-white">
                    {t('proposeCta')}
                  </Button>
                </Link>
              </div>
            </aside>

            <section className="lg:col-span-2">
              {!user && (
                <p className="text-sm text-muted-foreground mb-4">{t('loginRequiredToVote')}</p>
              )}

              {isLoading ? (
                <p className="text-muted-foreground">{t('loading')}</p>
              ) : ideas.length === 0 ? (
                <p className="text-muted-foreground">{t('empty')}</p>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      canVote={!!user}
                      onVote={handleVote}
                      disabled={isVoting === idea.id}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
