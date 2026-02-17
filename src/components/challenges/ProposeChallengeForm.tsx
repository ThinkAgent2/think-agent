'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectMarques } from '@/components/ui/multi-select-marques';
import { MultiSelectThematiques } from '@/components/ui/multi-select-thematiques';
import { Loader2, Send, Paperclip } from 'lucide-react';
import { createChallengeProposal, findChallengeByTitle } from '@/lib/supabase/queries';
import { FileUpload } from '@/components/challenges/FileUpload';
import type { Challenge, UserLevel, ChallengeType, Marque, VortexStage, Thematique } from '@/types/database';
import type { UploadedFile } from '@/lib/supabase/storage';

interface ProposeChallengeFormProps {
  authorId: string;
  onSuccess?: (challenge: Challenge) => void;
}

const NIVEAUX: UserLevel[] = ['Explorer', 'Crafter', 'Architecte'];
const TYPES: ChallengeType[] = ['Quiz', 'Exercice', 'Projet', 'Use_Case'];
const PARTICIPANTS = ['Solo', 'Duo', 'Équipe'] as const;

const VORTEX_STAGES: { value: VortexStage; label: string }[] = [
  { value: 'contextualize', label: '1. Cadrer (Contextualize)' },
  { value: 'empathize', label: '2. Découvrir (Empathize)' },
  { value: 'synthesize', label: '3. Définir (Synthesize)' },
  { value: 'hypothesize', label: '4. Idéer (Hypothesize)' },
  { value: 'externalize', label: '5. Construire (Externalize)' },
  { value: 'sensitize', label: '6. Tester (Sensitize)' },
  { value: 'systematize', label: '7. Apprendre (Systematize)' },
];

export function ProposeChallengeForm({ authorId, onSuccess }: ProposeChallengeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    niveau_associe: 'Explorer' as UserLevel,
    type: 'Exercice' as ChallengeType,
    difficulte: 2,
    xp: 100,
    marques: [] as Marque[],
    etape_vortex: '' as string,
    thematiques: [] as Thematique[],
    participants: 'Solo' as 'Solo' | 'Duo' | 'Équipe',
    outils_recommandes: '',
    criteres_evaluation: '',
    vision_impact: '',
    le_saviez_vous: '',
    sources: '',
    solution_proposee: '',
  });

  const t = useTranslations('challenges.propose.form');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarquesChange = (marques: Marque[]) => {
    setFormData((prev) => ({ ...prev, marques }));
  };

  const handleThematiquesChange = (thematiques: Thematique[]) => {
    setFormData((prev) => ({ ...prev, thematiques }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError(null);

    if (!formData.titre.trim() || !formData.description.trim()) {
      setFormError(t('errorRequired'));
      return;
    }

    if (!formData.criteres_evaluation.trim() || !formData.vision_impact.trim() || !formData.solution_proposee.trim()) {
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
      niveau_associe: formData.niveau_associe,
      type: formData.type,
      difficulte: Number(formData.difficulte),
      type_evaluation: 'Manuelle',
      xp: Number(formData.xp),
      statut: 'Propose',
      marques: formData.marques,
      etape_vortex: (formData.etape_vortex || null) as VortexStage | null,
      thematiques: formData.thematiques,
      participants: formData.participants,
      outils_recommandes: formData.outils_recommandes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      criteres_evaluation: formData.criteres_evaluation,
      vision_impact: formData.vision_impact || null,
      le_saviez_vous: formData.le_saviez_vous || null,
      sources: formData.sources
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      plan_solution: null,
      auteur_id: authorId,
      solution_proposee: formData.solution_proposee || null,
      solution_proposee_fichiers: uploadedFiles.map((file) => file.url),
    };

    const { data, error } = await createChallengeProposal(newChallenge);
    setIsSubmitting(false);

    if (data) {
      onSuccess?.(data);
      setFormError(null);
      alert(t('success'));
      setFormData((prev) => ({
        ...prev,
        titre: '',
        description: '',
        outils_recommandes: '',
        criteres_evaluation: '',
        vision_impact: '',
        le_saviez_vous: '',
        sources: '',
        solution_proposee: '',
      }));
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

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('level')}</label>
              <select
                name="niveau_associe"
                value={formData.niveau_associe}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
              >
                {NIVEAUX.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('type')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
                >
                  {TYPES.map((tp) => (
                    <option key={tp} value={tp}>
                      {tp.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('difficulty')}</label>
                <select
                  name="difficulte"
                  value={formData.difficulte}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      {d} ⭐
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('xp')}</label>
                <Input
                  name="xp"
                  type="number"
                  value={formData.xp}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('participants')}</label>
                <select
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
                >
                  {PARTICIPANTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('evaluationCriteria')}</label>
            <textarea
              name="criteres_evaluation"
              value={formData.criteres_evaluation}
              onChange={handleChange}
              placeholder={t('evaluationPlaceholder')}
              required
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('recommendedTools')}</label>
            <Input
              name="outils_recommandes"
              value={formData.outils_recommandes}
              onChange={handleChange}
              placeholder={t('recommendedToolsPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('visionImpact')}</label>
            <textarea
              name="vision_impact"
              value={formData.vision_impact}
              onChange={handleChange}
              placeholder={t('visionPlaceholder')}
              required
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('didYouKnow')}</label>
            <textarea
              name="le_saviez_vous"
              value={formData.le_saviez_vous}
              onChange={handleChange}
              placeholder={t('didYouKnowPlaceholder')}
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('sources')}</label>
            <textarea
              name="sources"
              value={formData.sources}
              onChange={handleChange}
              placeholder={t('sourcesPlaceholder')}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('brands')}</label>
            <MultiSelectMarques
              value={formData.marques}
              onChange={handleMarquesChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('themes')}</label>
            <MultiSelectThematiques
              value={formData.thematiques}
              onChange={handleThematiquesChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('vortexPhase')}</label>
            <select
              name="etape_vortex"
              value={formData.etape_vortex}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
            >
              <option value="">{t('vortexNotDefined')}</option>
              {VORTEX_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
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
