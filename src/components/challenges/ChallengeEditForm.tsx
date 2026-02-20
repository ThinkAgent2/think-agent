'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth';
import { deleteChallengeAdmin } from '@/app/actions/admin';
import { updateChallenge } from '@/lib/supabase/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MultiSelectMarques } from '@/components/ui/multi-select-marques';
import { MultiSelectThematiques } from '@/components/ui/multi-select-thematiques';
import type { Challenge, Marque, Thematique, VortexStage } from '@/types/database';

interface ChallengeEditFormProps {
  challenge: Challenge;
  onCancel: () => void;
  onSave: (updated: Challenge) => void;
}

const VORTEX_STAGES: { value: VortexStage; label: string }[] = [
  { value: 'contextualize', label: '1. Cadrer (Contextualize)' },
  { value: 'empathize', label: '2. Découvrir (Empathize)' },
  { value: 'synthesize', label: '3. Définir (Synthesize)' },
  { value: 'hypothesize', label: '4. Idéer (Hypothesize)' },
  { value: 'externalize', label: '5. Construire (Externalize)' },
  { value: 'sensitize', label: '6. Tester (Sensitize)' },
  { value: 'systematize', label: '7. Apprendre (Systematize)' },
];

export function ChallengeEditForm({ challenge, onCancel, onSave }: ChallengeEditFormProps) {
  const { user } = useAuth();
  const tAdmin = useTranslations('admin.validation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRepublishing, setIsRepublishing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    titre: challenge.titre,
    description: challenge.description,
    niveau_associe: challenge.niveau_associe,
    type: challenge.type,
    difficulte: challenge.difficulte,
    type_evaluation: challenge.type_evaluation,
    criteres_evaluation: challenge.criteres_evaluation,
    outils_recommandes: challenge.outils_recommandes.join(', '),
    xp: challenge.xp,
    marques: challenge.marques,
    etape_vortex: challenge.etape_vortex,
    thematiques: challenge.thematiques,
    participants: challenge.participants,
    vision_impact: challenge.vision_impact,
    le_saviez_vous: challenge.le_saviez_vous,
    sources: challenge.sources?.join('\n') || '',
    plan_solution: challenge.plan_solution || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarquesChange = (marques: Marque[]) => {
    setFormData((prev) => ({ ...prev, marques }));
  };

  const handleThematiquesChange = (thematiques: Thematique[]) => {
    setFormData((prev) => ({ ...prev, thematiques }));
  };

  const buildUpdates = () => ({
    ...formData,
    difficulte: Number(formData.difficulte),
    xp: Number(formData.xp),
    outils_recommandes: formData.outils_recommandes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    sources: formData.sources
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    plan_solution: formData.plan_solution || null,
    etape_vortex: (formData.etape_vortex || null) as VortexStage | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updated = await updateChallenge(challenge.id, buildUpdates());
    setIsSubmitting(false);

    if (updated) {
      onSave(updated);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      alert('Vous devez être connecté pour supprimer un challenge.');
      return;
    }

    const confirmed = window.confirm('Supprimer ce challenge ? Cette action est irréversible.');
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteChallengeAdmin(challenge.id);
    setIsDeleting(false);

    if (result.success) {
      alert('Challenge supprimé.');
      onCancel();
      window.location.href = '/challenges';
    } else {
      alert(`Erreur lors de la suppression: ${result.error || 'inconnue'}`);
    }
  };

  const handleRepublish = async () => {
    setIsRepublishing(true);
    const updated = await updateChallenge(challenge.id, { statut: 'Propose', validation_commentaire: null });
    setIsRepublishing(false);

    if (updated) {
      onSave(updated);
      alert('Challenge renvoyé en validation.');
    } else {
      alert('Erreur lors du renvoi en validation.');
    }
  };

  const isPublishReady = () => {
    return Boolean(
      formData.titre?.trim() &&
      formData.description?.trim() &&
      formData.niveau_associe &&
      formData.type &&
      formData.difficulte &&
      formData.type_evaluation &&
      formData.xp &&
      formData.participants &&
      formData.marques &&
      formData.marques.length > 0 &&
      formData.thematiques &&
      formData.thematiques.length > 0 &&
      formData.criteres_evaluation?.trim() &&
      formData.vision_impact?.trim() &&
      formData.le_saviez_vous?.trim() &&
      formData.sources.trim() &&
      formData.plan_solution?.trim()
    );
  };

  const handlePublish = async () => {
    if (!isPublishReady()) {
      alert(tAdmin('publishMissingFields'));
      return;
    }

    setIsPublishing(true);
    const updated = await updateChallenge(challenge.id, {
      ...buildUpdates(),
      statut: 'Publie',
    });
    setIsPublishing(false);

    if (updated) {
      onSave(updated);
      alert('Challenge publié.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full h-32 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau</label>
              <Input
                name="niveau_associe"
                value={formData.niveau_associe}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Input
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulté</label>
              <Input
                name="difficulte"
                value={formData.difficulte}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'évaluation</label>
              <Input
                name="type_evaluation"
                value={formData.type_evaluation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">XP</label>
              <Input
                name="xp"
                value={formData.xp}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Outils recommandés (optionnel)</label>
            <Input
              name="outils_recommandes"
              value={formData.outils_recommandes}
              onChange={handleChange}
              placeholder="Séparés par des virgules : ChatGPT, n8n, Cursor..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Critères d'évaluation</label>
            <Textarea
              name="criteres_evaluation"
              value={formData.criteres_evaluation}
              onChange={handleChange}
              required
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
            <label className="text-sm font-medium">Phase Vortex *</label>
            <select
              name="etape_vortex"
              value={formData.etape_vortex ?? ''}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  etape_vortex: event.target.value as VortexStage | null,
                }))
              }
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan solution</label>
            <Textarea
              name="plan_solution"
              value={formData.plan_solution}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sources</label>
            <Textarea
              name="sources"
              value={formData.sources}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vision impact</label>
            <Textarea
              name="vision_impact"
              value={formData.vision_impact ?? ''}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Le saviez-vous</label>
            <Textarea
              name="le_saviez_vous"
              value={formData.le_saviez_vous ?? ''}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </Button>
        {challenge.statut === 'Refuse' && (
          <Button type="button" variant="outline" onClick={handleRepublish} disabled={isRepublishing}>
            {isRepublishing ? 'Publication...' : 'Renvoyer en validation'}
          </Button>
        )}
      </div>

      {challenge.statut === 'Valide' && (
        <div className="pt-4 border-t border-border">
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-accent-jaune hover:bg-accent-jaune/80 text-black font-semibold"
          >
            {isPublishing ? 'Publication...' : tAdmin('completeAndPublish')}
          </Button>
        </div>
      )}
    </form>
  );
}
