'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { deleteChallengeAdmin } from '@/app/actions/admin';
import { updateChallenge } from '@/lib/supabase/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Challenge } from '@/types/database';

interface ChallengeEditFormProps {
  challenge: Challenge;
  onCancel: () => void;
  onSave: (updated: Challenge) => void;
}

export function ChallengeEditForm({ challenge, onCancel, onSave }: ChallengeEditFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRepublishing, setIsRepublishing] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updates = {
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
    };

    const updated = await updateChallenge(challenge.id, updates);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Titre */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
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

          {/* Niveau + Type + Difficulté */}
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

          {/* Type évaluation + XP */}
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

          {/* Outils recommandés */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Outils recommandés</label>
            <Input
              name="outils_recommandes"
              value={formData.outils_recommandes}
              onChange={handleChange}
            />
          </div>

          {/* Critères d'évaluation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Critères d'évaluation</label>
            <Textarea
              name="criteres_evaluation"
              value={formData.criteres_evaluation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Plan solution */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan solution</label>
            <Textarea
              name="plan_solution"
              value={formData.plan_solution}
              onChange={handleChange}
            />
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sources</label>
            <Textarea
              name="sources"
              value={formData.sources}
              onChange={handleChange}
            />
          </div>

          {/* Vision impact */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vision impact</label>
            <Textarea
              name="vision_impact"
              value={formData.vision_impact ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* Le saviez-vous */}
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
    </form>
  );
}
