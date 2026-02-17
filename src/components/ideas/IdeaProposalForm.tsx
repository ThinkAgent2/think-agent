'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createIdeaProposal } from '@/lib/supabase/queries';
import type { IdeaTheme, IdeaProposal } from '@/types/database';
import { FileUpload } from '@/components/challenges/FileUpload';
import type { UploadedFile } from '@/lib/supabase/storage';

interface IdeaProposalFormProps {
  authorId: string;
  onSuccess?: (idea: IdeaProposal) => void;
}

const THEMES: { value: IdeaTheme; labelKey: string }[] = [
  { value: 'correction_bug', labelKey: 'themes.correction_bug' },
  { value: 'nouvelle_fonctionnalite', labelKey: 'themes.nouvelle_fonctionnalite' },
  { value: 'amelioration_ui', labelKey: 'themes.amelioration_ui' },
];

export function IdeaProposalForm({ authorId, onSuccess }: IdeaProposalFormProps) {
  const t = useTranslations('ideas.propose');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    themes: [] as IdeaTheme[],
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

    setIsSubmitting(true);

    const newIdea: Omit<IdeaProposal, 'id' | 'created_at' | 'updated_at'> = {
      titre: formData.titre.trim(),
      description: formData.description.trim(),
      auteur_id: authorId,
      themes: formData.themes,
      screenshots: uploadedFiles.map((file) => file.url),
      statut: 'Proposee',
      github_username: null,
      validation_commentaire: null,
    };

    const { data, error } = await createIdeaProposal(newIdea);
    setIsSubmitting(false);

    if (data) {
      onSuccess?.(data);
      setFormError(null);
      alert(t('success'));
      setFormData({ titre: '', description: '', themes: [] });
      setUploadedFiles([]);
    } else {
      setFormError(error || t('errorGeneric'));
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
                    {t(theme.labelKey)}
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
