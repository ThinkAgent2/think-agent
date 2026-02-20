'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createIdeaProposal, updateIdeaProposal } from '@/lib/supabase/queries';
import type { IdeaTheme, IdeaProposal } from '@/types/database';
import { FileUpload } from '@/components/challenges/FileUpload';
import type { UploadedFile } from '@/lib/supabase/storage';

interface IdeaProposalFormProps {
  authorId: string;
  existingIdea?: IdeaProposal;
  onSuccess?: (idea: IdeaProposal) => void;
}

const THEMES: { value: IdeaTheme; labelKey: string }[] = [
  { value: 'correction_bug', labelKey: 'themes.correction_bug' },
  { value: 'nouvelle_fonctionnalite', labelKey: 'themes.nouvelle_fonctionnalite' },
  { value: 'amelioration_ui', labelKey: 'themes.amelioration_ui' },
];

export function IdeaProposalForm({ authorId, existingIdea, onSuccess }: IdeaProposalFormProps) {
  const t = useTranslations('ideas.propose');
  const tIdeas = useTranslations('ideas');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: existingIdea?.titre || '',
    description: existingIdea?.description || '',
    themes: existingIdea?.themes || ([] as IdeaTheme[]),
  });

  const toggleTheme = (theme: IdeaTheme) => {
    setFormData((prev) => {
      const exists = prev.themes.includes(theme);
      if (exists) {
        return { ...prev, themes: [] };
      }
      return { ...prev, themes: [theme] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.titre.trim() || !formData.description.trim()) {
      setFormError(t('errorRequired'));
      return;
    }

    if (formData.themes.length === 0) {
      setFormError(t('errorThemeRequired'));
      return;
    }

    if (
      existingIdea &&
      formData.titre.trim() === existingIdea.titre &&
      formData.description.trim() === existingIdea.description &&
      JSON.stringify(formData.themes) === JSON.stringify(existingIdea.themes || []) &&
      uploadedFiles.length === 0
    ) {
      setFormError(t('errorNoChanges'));
      return;
    }

    setIsSubmitting(true);

    const screenshots = uploadedFiles.length > 0
      ? uploadedFiles.map((file) => file.url)
      : (existingIdea?.screenshots || []);

    const newIdea: Omit<IdeaProposal, 'id' | 'created_at' | 'updated_at'> = {
      titre: formData.titre.trim(),
      description: formData.description.trim(),
      auteur_id: authorId,
      themes: formData.themes,
      screenshots,
      statut: 'Proposee',
      github_username: existingIdea?.github_username || null,
      validation_commentaire: null,
    };

    const result = existingIdea
      ? await updateIdeaProposal(existingIdea.id, {
          titre: newIdea.titre,
          description: newIdea.description,
          themes: newIdea.themes,
          screenshots: newIdea.screenshots,
          github_username: existingIdea?.github_username || null,
          statut: 'Proposee',
          validation_commentaire: null,
        })
      : (await createIdeaProposal(newIdea)).data;

    setIsSubmitting(false);

    if (result) {
      onSuccess?.(result);
      setFormError(null);
      alert(existingIdea ? t('updated') : t('success'));
      if (!existingIdea) {
        setFormData({ titre: '', description: '', themes: [] });
        setUploadedFiles([]);
      }
    } else {
      setFormError(t('errorGeneric'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('titleLabel')}</label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
              placeholder={t('titlePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('descriptionLabel')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={t('descriptionPlaceholder')}
              required
              className="w-full h-28 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('themesLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((theme) => {
                const active = formData.themes.includes(theme.value);
                return (
                  <Button
                    key={theme.value}
                    type="button"
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTheme(theme.value)}
                  >
                    {tIdeas(theme.labelKey)}
                  </Button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">{t('themesHint')}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('screenshots')}</label>
            <FileUpload
              userId={authorId}
              challengeId="idea-temp"
              onFilesChange={setUploadedFiles}
              maxFiles={3}
              maxSizeMB={10}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-exalt-blue hover:bg-exalt-blue/80 text-white font-semibold">
            {isSubmitting ? t('sending') : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
