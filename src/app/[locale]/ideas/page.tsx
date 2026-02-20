'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { getIdeasWithVotes, voteIdea, updateUser } from '@/lib/supabase/queries';
import { IdeaCard } from '@/components/ideas/IdeaCard';
import type { IdeaWithVotes } from '@/types/database';

export default function IdeasPage() {
  const { user } = useAuth();
  const t = useTranslations('ideas');
  const tCommon = useTranslations('common');
  const [ideas, setIdeas] = useState<IdeaWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const hasGithub = Boolean(user?.github_username);

  useEffect(() => {
    let isCancelled = false;

    async function loadIdeas() {
      setIsLoading(true);
      try {
        if (!hasGithub) {
          setIdeas([]);
          return;
        }
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
  }, [user?.id, hasGithub]);

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

  const handleSaveGithub = async () => {
    if (!user) return;
    const trimmed = githubUsername.trim();
    if (!trimmed) {
      setSaveError(t('githubRequired'));
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    const updated = await updateUser(user.id, { github_username: trimmed });
    setIsSaving(false);
    if (!updated) {
      setSaveError(t('githubError'));
      return;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

          {!user ? (
            <p className="text-sm text-muted-foreground">{t('loginRequiredToVote')}</p>
          ) : !hasGithub ? (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3 max-w-xl">
              <h2 className="text-lg font-semibold">{t('githubGateTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('githubGateDescription')}</p>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('githubLabel')}</label>
                <Input
                  value={githubUsername}
                  onChange={(event) => setGithubUsername(event.target.value)}
                  placeholder={t('githubPlaceholder')}
                />
              </div>
              {saveError && (
                <p className="text-sm text-destructive">{saveError}</p>
              )}
              <Button
                onClick={handleSaveGithub}
                disabled={isSaving}
                className="bg-exalt-blue hover:bg-exalt-blue/80 text-white"
              >
                {isSaving ? tCommon('loading') : t('githubSave')}
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
