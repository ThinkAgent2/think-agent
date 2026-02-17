'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
    async function loadIdeas() {
      setIsLoading(true);
      const data = await getIdeasWithVotes(user?.id ?? null);
      setIdeas(data.filter((idea) => idea.statut === 'Proposee'));
      setIsLoading(false);
    }
    loadIdeas();
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
