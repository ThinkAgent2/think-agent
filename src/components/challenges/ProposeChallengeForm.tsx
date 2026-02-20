'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Paperclip } from 'lucide-react';
import { createChallengeProposal, findChallengeByTitle } from '@/lib/supabase/queries';
import { FileUpload } from '@/components/challenges/FileUpload';
import type { Challenge } from '@/types/database';
import type { UploadedFile } from '@/lib/supabase/storage';

interface ProposeChallengeFormProps {
  authorId: string;
  onSuccess?: (challenge: Challenge) => void;
}

export function ProposeChallengeForm({ authorId, onSuccess }: ProposeChallengeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    sources: '',
    solution_proposee: '',
  });

  const t = useTranslations('challenges.propose.form');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError(null);

    const sources = formData.sources
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!formData.titre.trim() || !formData.description.trim()) {
      setFormError(t('errorRequired'));
      return;
    }

    if (!sources.length || !formData.solution_proposee.trim()) {
      setFormError(t('errorRequiredFull'));
      return;
    }

    setIsSubmitting(true);

    const existing = await findChallengeByTitle(formData.titre.trim());
    if (existing && existing.statut !== 'Refuse') {
      setIsSubmitting(false);
      setFormError(t('errorDuplicate'));
      return;
    }

    const newChallenge: Omit<Challenge, 'id' | 'created_at'> = {
      titre: formData.titre,
      description: formData.description,
      niveau_associe: 'Explorer',
      type: 'Exercice',
      difficulte: 2,
      type_evaluation: 'Manuelle',
      xp: 100,
      statut: 'Propose',
      marques: [],
      etape_vortex: null,
      thematiques: [],
      participants: 'Solo',
      outils_recommandes: [],
      criteres_evaluation: '',
      vision_impact: null,
      le_saviez_vous: null,
      sources,
      plan_solution: null,
      auteur_id: authorId,
      solution_proposee: formData.solution_proposee,
      solution_proposee_fichiers: uploadedFiles.map((file) => file.url),
    };

    const { data, error } = await createChallengeProposal(newChallenge);
    setIsSubmitting(false);

    if (data) {
      onSuccess?.(data);
      setFormError(null);
      alert(t('success'));
      setFormData({
        titre: '',
        description: '',
        sources: '',
        solution_proposee: '',
      });
    } else {
      setFormError(error || t('errorGeneric'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{useTranslations('challenges.propose')('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {t('adminFillsNotice')}
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('titleLabel')}</label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder={t('titlePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('descriptionLabel')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('descriptionPlaceholder')}
              required
              className="w-full h-24 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('sources')}</label>
            <textarea
              name="sources"
              value={formData.sources}
              onChange={handleChange}
              placeholder={t('sourcesPlaceholder')}
              required
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('proposedSolution')}</label>
            <textarea
              name="solution_proposee"
              value={formData.solution_proposee}
              onChange={handleChange}
              placeholder={t('proposedSolutionPlaceholder')}
              required
              className="w-full h-24 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              {t('attachments')}
            </label>
            <FileUpload
              userId={authorId}
              challengeId="proposal-temp"
              onFilesChange={setUploadedFiles}
              maxFiles={3}
              maxSizeMB={10}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-exalt-blue hover:bg-exalt-blue/80 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('sending')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t('submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
