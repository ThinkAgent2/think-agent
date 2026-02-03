'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { ChallengeFilters } from '@/components/challenges/ChallengeFilters';
import type { Challenge, ChallengeFilters as Filters } from '@/types/database';

// Données mock pour le développement
const mockChallenges: Challenge[] = [
  {
    id: '1',
    titre: 'Les Basiques du Prompting',
    description: 'Quiz interactif pour maîtriser les fondamentaux du prompting : zero-shot, few-shot, chain-of-thought, persona. La base indispensable pour tous les autres challenges.',
    niveau_associe: 'Explorer',
    type: 'Quiz',
    difficulte: 1,
    duree_estimee: '15 min',
    type_evaluation: 'Automatique',
    outils_recommandes: ['Chat IA'],
    criteres_evaluation: 'Score au quiz ≥ 80%',
    xp: 50,
    statut: 'Actif',
    prerequis: null,
    solution_reference: null,
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Solo',
    livrables: ['Quiz complété'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    titre: 'Le Gardien des Données',
    description: 'Quiz sur la confidentialité, le RGPD et les bonnes pratiques d\'anonymisation. Indispensable pour utiliser l\'IA de manière responsable.',
    niveau_associe: 'Explorer',
    type: 'Quiz',
    difficulte: 1,
    duree_estimee: '15 min',
    type_evaluation: 'Automatique',
    outils_recommandes: ['Chat IA'],
    criteres_evaluation: 'Score au quiz ≥ 80%',
    xp: 50,
    statut: 'Actif',
    prerequis: null,
    solution_reference: null,
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Solo',
    livrables: ['Quiz complété'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    titre: 'Le Coffre-Fort',
    description: 'Créer un assistant résistant au prompt injection. Apprends à sécuriser tes prompts contre les tentatives de manipulation.',
    niveau_associe: 'Explorer',
    type: 'Exercice',
    difficulte: 2,
    duree_estimee: '30 min',
    type_evaluation: 'Automatique',
    outils_recommandes: ['Chat IA'],
    criteres_evaluation: 'Assistant résiste à 5 attaques de test',
    xp: 75,
    statut: 'Actif',
    prerequis: ['1', '2'],
    solution_reference: null,
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Solo',
    livrables: ['Prompt système', 'Documentation défenses'],
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    titre: 'La Fabrique à Experts',
    description: 'Créer une formation complète avec NotebookLM : modules structurés, quiz de validation et podcast audio généré automatiquement.',
    niveau_associe: 'Explorer',
    type: 'Projet',
    difficulte: 2,
    duree_estimee: '1h',
    type_evaluation: 'Manuelle',
    outils_recommandes: ['NotebookLM', 'Google Docs'],
    criteres_evaluation: 'Formation avec 3+ modules, quiz et podcast',
    xp: 75,
    statut: 'Actif',
    prerequis: ['1', '2'],
    solution_reference: null,
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Solo',
    livrables: ['Formation NotebookLM', 'Podcast audio'],
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    titre: 'Le Conseiller McKinsey',
    description: 'Créer un assistant stratégique maîtrisant les frameworks MECE, Pyramide de Minto et Issue Trees. L\'IA qui challenge vraiment tes idées.',
    niveau_associe: 'Crafter',
    type: 'Projet',
    difficulte: 3,
    duree_estimee: '2h',
    type_evaluation: 'Manuelle',
    outils_recommandes: ['Chat IA', 'Google Docs'],
    criteres_evaluation: 'Assistant fonctionnel + session documentée',
    xp: 150,
    statut: 'Actif',
    prerequis: ['1', '2'],
    solution_reference: 'Prompt système recommandé avec frameworks intégrés...',
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Solo',
    livrables: ['Assistant', 'Documentation session'],
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    titre: 'PRD Manager',
    description: 'Assistant qui mène des entretiens structurés et rédige des PRD (Product Requirements Document) professionnels.',
    niveau_associe: 'Crafter',
    type: 'Projet',
    difficulte: 3,
    duree_estimee: '2h',
    type_evaluation: 'Manuelle',
    outils_recommandes: ['Chat IA', 'Google Docs'],
    criteres_evaluation: 'Assistant + PRD généré sur cas réel',
    xp: 150,
    statut: 'Actif',
    prerequis: ['1', '2'],
    solution_reference: null,
    solution_fichiers: null,
    marque: 'FLOW',
    participants: 'Solo',
    livrables: ['Assistant', 'PRD exemple'],
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    titre: 'Veille Augmentée',
    description: 'Pipeline n8n de veille automatisée : collecte RSS, filtrage par pertinence IA, synthèse quotidienne et livraison Slack/Email.',
    niveau_associe: 'Crafter',
    type: 'Projet',
    difficulte: 3,
    duree_estimee: '2h',
    type_evaluation: 'Manuelle',
    outils_recommandes: ['n8n', 'OpenAI', 'Slack'],
    criteres_evaluation: 'Workflow fonctionnel + 2 sources minimum',
    xp: 150,
    statut: 'Actif',
    prerequis: ['1', '2'],
    solution_reference: null,
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Solo',
    livrables: ['Workflow n8n', 'Exemple de newsletter'],
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    titre: 'L\'Employé Numérique',
    description: 'Agent conversationnel capable de créer des workflows n8n à partir de descriptions en langage naturel. Le meta-challenge.',
    niveau_associe: 'Architecte',
    type: 'Projet',
    difficulte: 4,
    duree_estimee: '4h',
    type_evaluation: 'Manuelle',
    outils_recommandes: ['Chat IA', 'n8n', 'API n8n'],
    criteres_evaluation: 'Agent créant des workflows fonctionnels',
    xp: 300,
    statut: 'Actif',
    prerequis: ['7'],
    solution_reference: null,
    solution_fichiers: null,
    marque: 'FORGE',
    participants: 'Solo',
    livrables: ['Agent', '3 workflows générés'],
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    titre: 'AgCraft (Boss Final) 🏆',
    description: 'Interface RTS pour piloter des agents IA. Crée un système où tu supervises plusieurs agents qui collaborent sur des tâches complexes.',
    niveau_associe: 'Architecte',
    type: 'Projet',
    difficulte: 5,
    duree_estimee: '16h',
    type_evaluation: 'Manuelle',
    outils_recommandes: ['Multi-agents', 'API', 'Interface custom'],
    criteres_evaluation: 'Système multi-agents fonctionnel',
    xp: 400,
    statut: 'Actif',
    prerequis: ['8'],
    solution_reference: null,
    solution_fichiers: null,
    marque: 'Tous',
    participants: 'Équipe',
    livrables: ['Système complet', 'Documentation architecture'],
    created_at: new Date().toISOString(),
  },
];

export default function ChallengesPage() {
  const [filters, setFilters] = useState<Filters>({});

  // Filtrer les challenges
  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (filters.niveau && challenge.niveau_associe !== filters.niveau) return false;
    if (filters.marque && filters.marque !== 'Tous' && challenge.marque !== filters.marque && challenge.marque !== 'Tous') return false;
    if (filters.difficulte && challenge.difficulte !== filters.difficulte) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !challenge.titre.toLowerCase().includes(search) &&
        !challenge.description.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    return true;
  });

  // Grouper par niveau
  const challengesByLevel = {
    Explorer: filteredChallenges.filter((c) => c.niveau_associe === 'Explorer'),
    Crafter: filteredChallenges.filter((c) => c.niveau_associe === 'Crafter'),
    Architecte: filteredChallenges.filter((c) => c.niveau_associe === 'Architecte'),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Catalogue des Challenges</h1>
            <p className="text-muted-foreground">
              {filteredChallenges.length} challenge{filteredChallenges.length > 1 ? 's' : ''} disponible{filteredChallenges.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar filters */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <ChallengeFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Challenges grid */}
            <div className="space-y-12">
              {/* Explorer */}
              {challengesByLevel.Explorer.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold text-accent-vert flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-accent-vert" />
                    Explorer
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {challengesByLevel.Explorer.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                </section>
              )}

              {/* Crafter */}
              {challengesByLevel.Crafter.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold text-exalt-blue flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-exalt-blue" />
                    Crafter
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {challengesByLevel.Crafter.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                </section>
              )}

              {/* Architecte */}
              {challengesByLevel.Architecte.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold text-accent-rose flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-accent-rose" />
                    Architecte
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {challengesByLevel.Architecte.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {filteredChallenges.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Aucun challenge ne correspond à tes critères.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
