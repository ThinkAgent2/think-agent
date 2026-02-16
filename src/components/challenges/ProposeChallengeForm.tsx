'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectMarques } from '@/components/ui/multi-select-marques';
import { MultiSelectThematiques } from '@/components/ui/multi-select-thematiques';
import { Loader2, Send, Paperclip } from 'lucide-react';
import { createChallenge } from '@/lib/supabase/queries';
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

    if (!formData.titre.trim() || !formData.description.trim()) {
      alert('Titre et description sont obligatoires');
      return;
    }

    setIsSubmitting(true);

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

    const created = await createChallenge(newChallenge);
    setIsSubmitting(false);

    if (created) {
      onSuccess?.(created);
      alert('Challenge proposé ! Un admin va le valider.');
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
      alert('Erreur lors de la proposition.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposer un challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre *</label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex: Audit IA interne"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décris le challenge, son objectif..."
              required
              className="w-full h-24 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau</label>
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
                <label className="text-sm font-medium">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulté</label>
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
                <label className="text-sm font-medium">XP</label>
                <Input
                  name="xp"
                  type="number"
                  value={formData.xp}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Participants</label>
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
            <label className="text-sm font-medium">Critères d'évaluation</label>
            <textarea
              name="criteres_evaluation"
              value={formData.criteres_evaluation}
              onChange={handleChange}
              placeholder="Comment évaluer la réussite..."
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Outils recommandés</label>
            <Input
              name="outils_recommandes"
              value={formData.outils_recommandes}
              onChange={handleChange}
              placeholder="ChatGPT, Notion..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vision & Impact</label>
            <textarea
              name="vision_impact"
              value={formData.vision_impact}
              onChange={handleChange}
              placeholder="Pourquoi ce challenge est important..."
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Le saviez-vous ?</label>
            <textarea
              name="le_saviez_vous"
              value={formData.le_saviez_vous}
              onChange={handleChange}
              placeholder="Anecdote ou hook engageant..."
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sources & Références</label>
            <textarea
              name="sources"
              value={formData.sources}
              onChange={handleChange}
              placeholder="Une URL par ligne..."
              className="w-full h-20 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Solution proposée</label>
            <textarea
              name="solution_proposee"
              value={formData.solution_proposee}
              onChange={handleChange}
              placeholder="Décris ta solution idéale..."
              className="w-full h-24 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Pièces jointes (optionnel)
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
            <label className="text-sm font-medium">Marques concernées</label>
            <MultiSelectMarques
              value={formData.marques}
              onChange={handleMarquesChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Thématiques IA</label>
            <MultiSelectThematiques
              value={formData.thematiques}
              onChange={handleThematiquesChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phase Vortex</label>
            <select
              name="etape_vortex"
              value={formData.etape_vortex}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none"
            >
              <option value="">Non définie</option>
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
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Proposer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
