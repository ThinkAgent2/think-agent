'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { getIdeasWithVotes, updateIdeaProposal } from '@/lib/supabase/queries';
import type { IdeaWithVotes } from '@/types/database';

export default function AdminIdeasPage() {
  const { user } = useAuth();
  const t = useTranslations('admin.ideas');
  const tIdeas = useTranslations('ideas');
  const [ideas, setIdeas] = useState<IdeaWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [githubUsernames, setGithubUsernames] = useState<Record<string, string>>({});
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadIdeas() {
      setIsLoading(true);
      const data = await getIdeasWithVotes(null);
      setIdeas(data.filter((idea) => idea.statut !== 'Validee'));
      setIsLoading(false);
    }
    loadIdeas();
  }, []);

  if (!user || user.role !== 'Administrateur') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('accessDenied')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleValidate = async (idea: IdeaWithVotes) => {
    const username = githubUsernames[idea.id]?.trim();
    if (!username) {
      alert(t('githubRequired'));
      return;
    }

    const updated = await updateIdeaProposal(idea.id, {
      statut: 'Validee',
      github_username: username,
    });

    if (updated) {
      setIdeas((prev) => prev.map((item) => (item.id === idea.id ? { ...item, ...updated } : item)));
    }
  };

  const handleReject = async (idea: IdeaWithVotes) => {
    const note = rejectionNotes[idea.id]?.trim();
    if (!note) {
      alert(t('rejectionRequired'));
      return;
    }

    const updated = await updateIdeaProposal(idea.id, {
      statut: 'Refusee',
      validation_commentaire: note,
    });

    if (updated) {
      setIdeas((prev) => prev.filter((item) => item.id !== idea.id));
      setRejectionNotes((prev) => ({ ...prev, [idea.id]: '' }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

          {isLoading ? (
            <p className="text-muted-foreground">{t('loading')}</p>
          ) : ideas.length === 0 ? (
            <p className="text-muted-foreground">{t('noPending')}</p>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <div key={idea.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {idea.themes.map((theme) => (
                          <Badge key={theme} variant="outline">
                            {tIdeas(`themes.${theme}`)}
                          </Badge>
                        ))}
                        <Badge className="bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40">
                          {tIdeas(`status.${idea.statut}`)}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold">{idea.titre}</h3>
                      <p className="text-sm text-muted-foreground">{idea.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{tIdeas('votes', { count: idea.votes })}</div>
                  </div>

                  {idea.screenshots && idea.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {idea.screenshots.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noreferrer">
                          <img
                            src={url}
                            alt={idea.titre}
                            className="w-full h-24 object-cover rounded-md border border-border"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('githubLabel')}</label>
                      <Input
                        value={githubUsernames[idea.id] || ''}
                        onChange={(event) =>
                          setGithubUsernames((prev) => ({
                            ...prev,
                            [idea.id]: event.target.value,
                          }))
                        }
                        placeholder={t('githubPlaceholder')}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={() => handleValidate(idea)}>{t('validate')}</Button>
                      <Button variant="outline" onClick={() => handleReject(idea)}>
                        {t('reject')}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('rejectionComment')}</label>
                    <Input
                      value={rejectionNotes[idea.id] || ''}
                      onChange={(event) =>
                        setRejectionNotes((prev) => ({
                          ...prev,
                          [idea.id]: event.target.value,
                        }))
                      }
                      placeholder={t('rejectionPlaceholder')}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
