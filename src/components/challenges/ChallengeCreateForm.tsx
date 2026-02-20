'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, X } from 'lucide-react';
import { createChallenge } from '@/lib/supabase/queries';
import type { Challenge } from '@/types/database';

interface ChallengeCreateFormProps {
  onSuccess: (challenge: Challenge) => void;
  onCancel: () => void;
}

export function ChallengeCreateForm({ onSuccess, onCancel }: ChallengeCreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    sources: '',
    solution: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titre.trim() || !formData.description.trim()) {
      alert('Titre et description sont obligatoires');
      return;
    }

    const sources = formData.sources
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!sources.length || !formData.solution.trim()) {
      alert('Sources & Références et solution sont obligatoires');
      return;
    }

    setIsSubmitting(true);

    const newChallenge: Omit<Challenge, 'id' | 'created_at'> = {
      titre: formData.titre,
      description: formData.description,
      niveau_associe: 'Explorer',
      type: 'Exercice',
      difficulte: 2,
      type_evaluation: 'Manuelle',
      xp: 100,
      statut: 'Actif',
      marques: [],
      etape_vortex: null,
      thematiques: [],
      participants: 'Solo',
      outils_recommandes: [],
      criteres_evaluation: '',
      vision_impact: null,
      le_saviez_vous: null,
      sources,
      plan_solution: formData.solution,
    };

    const created = await createChallenge(newChallenge);
    setIsSubmitting(false);

    if (created) {
      onSuccess(created);
    } else {
      alert('Erreur lors de la création du challenge');
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
            <label className="text-sm font-medium">Titre *</label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex: Le Conseiller McKinsey"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décris le challenge, son objectif, ce que les participants vont apprendre..."
              required
              className="w-full h-32 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sources & Références</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            name="sources"
            value={formData.sources}
            onChange={handleChange}
            placeholder="Une URL par ligne..."
            required
            className="w-full h-24 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solution *</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            placeholder="Décris la solution attendue..."
            required
            className="w-full h-32 p-3 rounded-lg bg-background border border-border focus:border-accent-cyan focus:outline-none resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent-jaune hover:bg-accent-jaune/80 text-black font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Créer le challenge
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
