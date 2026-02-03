'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, Zap, Target, Clock, CheckCircle, 
  Medal, Flame, Users, Star, Crown, Rocket, Brain
} from 'lucide-react';
import type { User, Badge as BadgeType, Challenge, Participation } from '@/types/database';

// Mock user data
const mockUser: User = {
  id: 'user-1',
  email: 'jean.dupont@exalt.fr',
  nom: 'Jean Dupont',
  metier_id: 'pm',
  marque_id: 'flow',
  localisation: 'Paris',
  niveau_actuel: 'Crafter',
  role: 'Utilisateur',
  points_totaux: 425,
  created_at: '2025-01-15T10:00:00Z',
};

// Mock badges
const mockBadges: (BadgeType & { obtained: boolean })[] = [
  { id: '1', nom: 'Premier Pas', description: 'Premier challenge validé', emoji: '🌱', conditions: {}, obtained: true },
  { id: '2', nom: 'Bâtisseur', description: 'Premier outil créé (Crafter)', emoji: '🛠️', conditions: {}, obtained: true },
  { id: '3', nom: 'Binôme', description: 'Challenge réalisé en duo', emoji: '🤝', conditions: {}, obtained: false },
  { id: '4', nom: 'On Fire', description: '3 challenges validés en 1 mois', emoji: '🔥', conditions: {}, obtained: true },
  { id: '5', nom: 'Explorer Complet', description: 'Tous les challenges Explorer validés', emoji: '🏆', conditions: {}, obtained: false },
];

// Mock challenges en cours / terminés
const mockParticipations: { challenge: Challenge; participation: Participation }[] = [
  {
    challenge: {
      id: '5',
      titre: 'Le Conseiller McKinsey',
      description: 'Créer un assistant stratégique...',
      niveau_associe: 'Crafter',
      type: 'Projet',
      difficulte: 3,
      duree_estimee: '2h',
      type_evaluation: 'Manuelle',
      outils_recommandes: ['Chat IA'],
      criteres_evaluation: '',
      xp: 150,
      statut: 'Actif',
      prerequis: null,
      solution_reference: null,
      solution_fichiers: null,
      marque: 'Tous',
      participants: 'Solo',
      livrables: [],
      created_at: '',
    },
    participation: { user_id: 'user-1', challenge_id: '5', statut: 'En_cours', created_at: '2025-02-01T10:00:00Z' },
  },
  {
    challenge: {
      id: '1',
      titre: 'Les Basiques du Prompting',
      description: 'Quiz interactif...',
      niveau_associe: 'Explorer',
      type: 'Quiz',
      difficulte: 1,
      duree_estimee: '15 min',
      type_evaluation: 'Automatique',
      outils_recommandes: ['Chat IA'],
      criteres_evaluation: '',
      xp: 50,
      statut: 'Actif',
      prerequis: null,
      solution_reference: null,
      solution_fichiers: null,
      marque: 'Tous',
      participants: 'Solo',
      livrables: [],
      created_at: '',
    },
    participation: { user_id: 'user-1', challenge_id: '1', statut: 'Terminé', created_at: '2025-01-20T10:00:00Z' },
  },
  {
    challenge: {
      id: '2',
      titre: 'Le Gardien des Données',
      description: 'Quiz RGPD...',
      niveau_associe: 'Explorer',
      type: 'Quiz',
      difficulte: 1,
      duree_estimee: '15 min',
      type_evaluation: 'Automatique',
      outils_recommandes: ['Chat IA'],
      criteres_evaluation: '',
      xp: 50,
      statut: 'Actif',
      prerequis: null,
      solution_reference: null,
      solution_fichiers: null,
      marque: 'Tous',
      participants: 'Solo',
      livrables: [],
      created_at: '',
    },
    participation: { user_id: 'user-1', challenge_id: '2', statut: 'Terminé', created_at: '2025-01-21T10:00:00Z' },
  },
  {
    challenge: {
      id: '3',
      titre: 'Le Coffre-Fort',
      description: 'Créer un assistant résistant...',
      niveau_associe: 'Explorer',
      type: 'Exercice',
      difficulte: 2,
      duree_estimee: '30 min',
      type_evaluation: 'Automatique',
      outils_recommandes: ['Chat IA'],
      criteres_evaluation: '',
      xp: 75,
      statut: 'Actif',
      prerequis: null,
      solution_reference: null,
      solution_fichiers: null,
      marque: 'Tous',
      participants: 'Solo',
      livrables: [],
      created_at: '',
    },
    participation: { user_id: 'user-1', challenge_id: '3', statut: 'Terminé', created_at: '2025-01-25T10:00:00Z' },
  },
];

// Mock leaderboard
const mockLeaderboard = [
  { rank: 1, nom: 'Marie Martin', niveau_actuel: 'Architecte', points_totaux: 1250, marque: 'VALUE' },
  { rank: 2, nom: 'Pierre Bernard', niveau_actuel: 'Architecte', points_totaux: 980, marque: 'FORGE' },
  { rank: 3, nom: 'Sophie Leroy', niveau_actuel: 'Crafter', points_totaux: 720, marque: 'FLOW' },
  { rank: 4, nom: 'Jean Dupont', niveau_actuel: 'Crafter', points_totaux: 425, marque: 'FLOW', isCurrentUser: true },
  { rank: 5, nom: 'Lucas Petit', niveau_actuel: 'Crafter', points_totaux: 400, marque: 'IT' },
];

const levelConfig = {
  Explorer: { color: 'bg-accent-vert text-black', icon: Brain, nextLevel: 'Crafter', xpNeeded: 150 },
  Crafter: { color: 'bg-exalt-blue text-white', icon: Rocket, nextLevel: 'Architecte', xpNeeded: 500 },
  Architecte: { color: 'bg-accent-rose text-white', icon: Crown, nextLevel: null, xpNeeded: null },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('en-cours');
  
  const config = levelConfig[mockUser.niveau_actuel];
  const LevelIcon = config.icon;
  
  const inProgress = mockParticipations.filter(p => p.participation.statut === 'En_cours');
  const completed = mockParticipations.filter(p => p.participation.statut === 'Terminé');

  // Calcul progression
  const currentLevelXP = mockUser.niveau_actuel === 'Explorer' ? 0 : mockUser.niveau_actuel === 'Crafter' ? 150 : 500;
  const xpInCurrentLevel = mockUser.points_totaux - currentLevelXP;
  const xpForNextLevel = config.xpNeeded ? config.xpNeeded - currentLevelXP : 0;
  const progressPercent = config.nextLevel ? Math.min(100, (xpInCurrentLevel / xpForNextLevel) * 100) : 100;

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={mockUser} />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <div className="space-y-8">
              {/* Profile header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-exalt-blue text-white text-2xl">
                        {mockUser.nom?.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">{mockUser.nom}</h1>
                        <Badge className={config.color}>
                          <LevelIcon className="h-3 w-3 mr-1" />
                          {mockUser.niveau_actuel}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{mockUser.email}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-accent-jaune" />
                          <span className="font-semibold">{mockUser.points_totaux} XP</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          <span>{completed.length} challenges terminés</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>{inProgress.length} en cours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progression vers niveau suivant */}
                  {config.nextLevel && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">Progression vers {config.nextLevel}</span>
                        <span className="font-medium">{xpInCurrentLevel} / {xpForNextLevel} XP</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Challenges tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Mes Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="en-cours" className="gap-2">
                        <Clock className="h-4 w-4" />
                        En cours ({inProgress.length})
                      </TabsTrigger>
                      <TabsTrigger value="termines" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Terminés ({completed.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="en-cours" className="space-y-3">
                      {inProgress.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Aucun challenge en cours. Explore le catalogue !
                        </p>
                      ) : (
                        inProgress.map(({ challenge }) => (
                          <div
                            key={challenge.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent-cyan transition-colors"
                          >
                            <div>
                              <h4 className="font-medium">{challenge.titre}</h4>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {challenge.niveau_associe}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {challenge.duree_estimee}
                                </span>
                                <span className="flex items-center gap-1 text-accent-jaune">
                                  <Zap className="h-3 w-3" />
                                  {challenge.xp} XP
                                </span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-accent-cyan hover:bg-accent-cyan/80 text-black">
                              Continuer
                            </Button>
                          </div>
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="termines" className="space-y-3">
                      {completed.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Aucun challenge terminé pour le moment.
                        </p>
                      ) : (
                        completed.map(({ challenge }) => (
                          <div
                            key={challenge.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50"
                          >
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-accent-vert" />
                              <div>
                                <h4 className="font-medium">{challenge.titre}</h4>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">
                                    {challenge.niveau_associe}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-accent-vert">
                                    <Zap className="h-3 w-3" />
                                    +{challenge.xp} XP
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Revoir
                            </Button>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Badges */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Medal className="h-5 w-5 text-accent-jaune" />
                    Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {mockBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                          badge.obtained
                            ? 'border-accent-jaune/50 bg-accent-jaune/10'
                            : 'border-border opacity-40'
                        }`}
                        title={badge.description}
                      >
                        <span className="text-2xl mb-1">{badge.emoji}</span>
                        <span className="text-xs text-center text-muted-foreground">
                          {badge.nom}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent-jaune" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Top 5 global</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockLeaderboard.map((entry, index) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          entry.isCurrentUser ? 'bg-exalt-blue/20 border border-exalt-blue/50' : ''
                        }`}
                      >
                        <span className={`w-6 text-center font-bold ${
                          index === 0 ? 'text-accent-jaune' :
                          index === 1 ? 'text-gray-400' :
                          index === 2 ? 'text-amber-600' :
                          'text-muted-foreground'
                        }`}>
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : entry.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">
                            {entry.nom}
                            {entry.isCurrentUser && <span className="text-exalt-blue ml-1">(toi)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{entry.marque}</p>
                        </div>
                        <span className="text-sm font-semibold text-accent-jaune">
                          {entry.points_totaux}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
