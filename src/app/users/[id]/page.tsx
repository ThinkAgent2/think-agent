'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Medal, Crown, Rocket, Brain, Loader2, ArrowLeft
} from 'lucide-react';
import { getAllBadges, getLeaderboard, getUserBadges, getUserById, getUserParticipations, getUserChallenges } from '@/lib/supabase/queries';
import { formatNameFromEmail } from '@/lib/userName';
import type { Badge as BadgeType, Challenge, Participation, LeaderboardEntry, User } from '@/types/database';

const levelConfig: Record<string, { color: string; icon: typeof Brain; nextLevel: string | null; xpNeeded: number | null }> = {
  Explorer: { color: 'bg-accent-vert text-black', icon: Brain, nextLevel: 'Crafter', xpNeeded: 150 },
  Crafter: { color: 'bg-exalt-blue text-white', icon: Rocket, nextLevel: 'Architecte', xpNeeded: 500 },
  Architecte: { color: 'bg-accent-rose text-white', icon: Crown, nextLevel: null, xpNeeded: null },
};

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [participations, setParticipations] = useState<(Participation & { challenge?: Challenge })[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [proposedChallenges, setProposedChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!userId) return;
      setIsLoading(true);

      const [userData, participationsData, allBadgesData, userBadgesData, leaderboardData, proposedChallengesData] = await Promise.all([
        getUserById(userId),
        getUserParticipations(userId),
        getAllBadges(),
        getUserBadges(userId),
        getLeaderboard(10),
        getUserChallenges(userId),
      ]);

      if (!userData) {
        router.push('/me');
        return;
      }

      setUser(userData);
      setParticipations(participationsData);
      setAllBadges(allBadgesData);
      setUserBadges(userBadgesData);
      setLeaderboard(leaderboardData);
      setProposedChallenges(proposedChallengesData);
      setIsLoading(false);
    }

    loadData();
  }, [router, userId]);

  const config = user ? (levelConfig[user.niveau_actuel] || levelConfig.Explorer) : levelConfig.Explorer;
  const LevelIcon = config.icon;
  const sanitizedName = user?.nom && user.nom !== 'Anonyme' ? user.nom : null;
  const displayName = sanitizedName || formatNameFromEmail(user?.email) || 'Anonyme';

  const inProgress = participations.filter(p => p.statut === 'En_cours');
  const completed = participations.filter(p => p.statut === 'Terminé');

  const levelThresholds: Record<'Explorer' | 'Crafter' | 'Architecte', number> = {
    Explorer: 2,
    Crafter: 5,
    Architecte: 2,
  };

  const completedByLevel = {
    Explorer: participations.filter(p => p.statut === 'Terminé' && p.challenge?.niveau_associe === 'Explorer').length,
    Crafter: participations.filter(p => p.statut === 'Terminé' && p.challenge?.niveau_associe === 'Crafter').length,
    Architecte: participations.filter(p => p.statut === 'Terminé' && p.challenge?.niveau_associe === 'Architecte').length,
  };

  const levelProgress = {
    Explorer: Math.min(100, Math.round((completedByLevel.Explorer / levelThresholds.Explorer) * 100)),
    Crafter: Math.min(100, Math.round((completedByLevel.Crafter / levelThresholds.Crafter) * 100)),
    Architecte: Math.min(100, Math.round((completedByLevel.Architecte / levelThresholds.Architecte) * 100)),
  };

  const badgesWithStatus = useMemo(() => {
    return allBadges.map((badge) => ({
      ...badge,
      obtained: userBadges.some((ub) => ub.id === badge.id),
    }));
  }, [allBadges, userBadges]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-exalt-blue" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/me"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à mon profil
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <div className="space-y-8">
              {/* Profile header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-exalt-blue text-white text-2xl">
                        {user.nom?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">{displayName}</h1>
                        <Badge className={config.color}>
                          <LevelIcon className="h-3 w-3 mr-1" />
                          {user.niveau_actuel}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{user.email}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-accent-jaune" />
                          <span className="font-semibold">{user.points_totaux} XP</span>
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

                  {/* Progression par niveau */}
                  <div className="mt-6 pt-6 border-t border-border space-y-4">
                    {(Object.keys(levelThresholds) as Array<keyof typeof levelThresholds>).map((level) => (
                      <div key={level} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{level}</span>
                          <span className="font-medium">
                            {completedByLevel[level]} / {levelThresholds[level]} challenges
                          </span>
                        </div>
                        <Progress value={levelProgress[level]} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Challenges tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="en-cours">
                    <TabsList className="mb-4">
                      <TabsTrigger value="en-cours" className="gap-2">
                        <Clock className="h-4 w-4" />
                        En cours ({inProgress.length})
                      </TabsTrigger>
                      <TabsTrigger value="termines" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Terminés ({completed.length})
                      </TabsTrigger>
                      <TabsTrigger value="proposes" className="gap-2">
                        <Medal className="h-4 w-4" />
                        Challenges proposés ({proposedChallenges.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="en-cours" className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                        </div>
                      ) : inProgress.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            Aucun challenge en cours.
                          </p>
                        </div>
                      ) : (
                        inProgress.map(({ challenge, ...participation }) => (
                          <Link
                            key={participation.challenge_id}
                            href={`/challenges/${participation.challenge_id}`}
                            className="block"
                          >
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent-cyan transition-colors">
                              <div>
                                <p className="font-medium">
                                  {challenge?.titre || 'Challenge'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {challenge?.niveau_associe}
                                </p>
                              </div>
                              <Button size="sm" variant="outline">Voir</Button>
                            </div>
                          </Link>
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="termines" className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                        </div>
                      ) : completed.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            Aucun challenge terminé.
                          </p>
                        </div>
                      ) : (
                        completed.map(({ challenge, ...participation }) => (
                          <Link
                            key={participation.challenge_id}
                            href={`/challenges/${participation.challenge_id}`}
                            className="block"
                          >
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent-cyan transition-colors">
                              <div>
                                <p className="font-medium">
                                  {challenge?.titre || 'Challenge'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {challenge?.niveau_associe}
                                </p>
                              </div>
                              <Button size="sm" variant="outline">Voir</Button>
                            </div>
                          </Link>
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="proposes" className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                        </div>
                      ) : proposedChallenges.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            Aucun challenge proposé.
                          </p>
                        </div>
                      ) : (
                        proposedChallenges.map((challenge) => (
                          <Link
                            key={challenge.id}
                            href={`/challenges/${challenge.id}`}
                            className="block"
                          >
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent-cyan transition-colors">
                              <div>
                                <p className="font-medium">
                                  {challenge.titre}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {challenge.niveau_associe} · {challenge.statut}
                                </p>
                              </div>
                              <Button size="sm" variant="outline">Voir</Button>
                            </div>
                          </Link>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Badges */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent-jaune" />
                    Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {badgesWithStatus.map((badge) => (
                        <div
                          key={badge.id}
                          className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                            badge.obtained
                              ? 'border-accent-jaune/50 bg-accent-jaune/10'
                              : 'border-border opacity-40'
                          }`}
                          title={badge.description || badge.nom}
                        >
                          <span className="text-2xl mb-1">{badge.emoji}</span>
                          <span className="text-xs text-center text-muted-foreground">
                            {badge.nom}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent-jaune" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Top 10 global</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Pas encore de classement
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.map((entry, index) => {
                        const isCurrentProfile = entry.user_id === user.id;
                        const href = isCurrentProfile ? `/users/${entry.user_id}` : `/users/${entry.user_id}`;
                        return (
                          <Link
                            key={entry.user_id}
                            href={href}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:border hover:border-accent-cyan ${
                              isCurrentProfile ? 'bg-exalt-blue/20 border border-exalt-blue/50' : ''
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
                                {isCurrentProfile && (
                                  <span className="text-exalt-blue ml-1">(profil)</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{entry.marque || '-'}</p>
                            </div>
                            <span className="text-sm font-semibold text-accent-jaune">
                              {entry.points_totaux}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
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
