'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getChallengesByStatus, updateChallenge, addUserXP } from '@/lib/supabase/queries';
import type { Challenge } from '@/types/database';

export function AdminChallengesContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});
  const t = useTranslations('admin.validation');
  const tCommon = useTranslations('common');

  useEffect(() => {
    async function loadProposals() {
      setIsLoading(true);
      const proposals = await getChallengesByStatus(['Propose', 'Valide', 'Refuse']);
      setChallenges(proposals);
      setIsLoading(false);
    }
    loadProposals();
  }, []);

  const handleValidate = async (challenge: Challenge) => {
    if (!challenge.auteur_id) return;

    await updateChallenge(challenge.id, { statut: 'Valide' });
    await addUserXP(challenge.auteur_id, challenge.xp);

    setChallenges((prev) =>
      prev.map((item) => (item.id === challenge.id ? { ...item, statut: 'Valide' } : item))
    );
  };

  const handleReject = async (challenge: Challenge) => {
    const note = rejectionNotes[challenge.id]?.trim();
    if (!note) {
      alert(t('rejectionRequired'));
      return;
    }

    await updateChallenge(challenge.id, { statut: 'Refuse', validation_commentaire: note });
    setChallenges((prev) => prev.filter((item) => item.id !== challenge.id));
    setRejectionNotes((prev) => ({ ...prev, [challenge.id]: '' }));
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-6">
        {t('subtitle')}
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-exalt-blue" />
        </div>
      ) : challenges.length === 0 ? (
        <p className="text-muted-foreground">{t('noPending')}</p>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{challenge.niveau_associe}</Badge>
                    <Badge variant="outline">{challenge.type}</Badge>
                    <Badge className="bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40">
                      {challenge.statut}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{challenge.titre}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {challenge.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/challenges/${challenge.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      {tCommon('view')}
                    </Button>
                  </Link>
                  {challenge.statut === 'Propose' && (
                    <Button size="sm" onClick={() => handleValidate(challenge)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('validate')}
                    </Button>
                  )}
                  {challenge.statut === 'Valide' && (
                    <Link href={`/challenges/${challenge.id}?edit=1`}>
                      <Button size="sm" variant="outline">
                        {t('completeAndPublish')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {challenge.statut === 'Propose' && (
                <div className="mt-4">
                  <label className="text-sm font-semibold">{t('rejectionComment')}</label>
                  <div className="flex flex-col gap-2 mt-2">
                    <Input
                      value={rejectionNotes[challenge.id] || ''}
                      onChange={(event) =>
                        setRejectionNotes((prev) => ({
                          ...prev,
                          [challenge.id]: event.target.value,
                        }))
                      }
                      placeholder={t('rejectionPlaceholder')}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleReject(challenge)}>
                      {t('reject')}
                    </Button>
                  </div>
                </div>
              )}

              {challenge.solution_proposee && (
                <div className="mt-4">
                  <p className="text-sm font-semibold">{t('proposedSolution')}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {challenge.solution_proposee}
                  </p>
                </div>
              )}
              {challenge.solution_proposee_fichiers && challenge.solution_proposee_fichiers.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold">{t('attachments')}</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {challenge.solution_proposee_fichiers.map((fileUrl) => (
                      <li key={fileUrl}>
                        <a className="text-exalt-blue hover:underline" href={fileUrl} target="_blank" rel="noreferrer">
                          {fileUrl}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function AdminChallengesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <AdminChallengesContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
