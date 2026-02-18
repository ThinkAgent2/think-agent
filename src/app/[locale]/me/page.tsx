'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Trophy, Zap, Target, Clock, CheckCircle, 
  Medal, Crown, Rocket, Brain, Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getUserParticipations, getAllBadges, getUserBadges, getLeaderboard, searchUsers, getUserChallenges, getUserIdeas, deleteIdeaProposal, updateUser } from '@/lib/supabase/queries';
import { formatNameFromEmail } from '@/lib/userName';
import type { Badge as BadgeType, Challenge, Participation, LeaderboardEntry, IdeaProposal } from '@/types/database';
import { IdeaProposalForm } from '@/components/ideas/IdeaProposalForm';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { setStoredUser } from '@/lib/auth';

const levelConfig: Record<string, { color: string; icon: typeof Brain; nextLevel: string | null; xpNeeded: number | null }> = {
  Explorer: { color: 'bg-accent-vert text-black', icon: Brain, nextLevel: 'Crafter', xpNeeded: 150 },
  Crafter: { color: 'bg-exalt-blue text-white', icon: Rocket, nextLevel: 'Architecte', xpNeeded: 500 },
  Architecte: { color: 'bg-accent-rose text-white', icon: Crown, nextLevel: null, xpNeeded: null },
};

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('en-cours');
  const [participations, setParticipations] = useState<(Participation & { challenge?: Challenge })[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardScope, setLeaderboardScope] = useState<'global' | 'entite' | 'cercle'>('global');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<Array<{ id: string; nom: string; email: string }>>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [proposedChallenges, setProposedChallenges] = useState<Challenge[]>([]);
  const [myIdeas, setMyIdeas] = useState<IdeaProposal[]>([]);
  const [editingIdea, setEditingIdea] = useState<IdeaProposal | null>(null);
  const [featuredBadgeId, setFeaturedBadgeId] = useState<string | null>(null);
  const [isUpdatingBadge, setIsUpdatingBadge] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations('profile');
  const tBadges = useTranslations('badges');
  const tLeaderboard = useTranslations('leaderboard');
  const tCommon = useTranslations('common');
  const tChallenges = useTranslations('challenges.card');
  const tIdeas = useTranslations('ideas');

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale]);

  // Charger les données
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      setIsLoading(true);
      const [participationsData, allBadgesData, userBadgesData, leaderboardData, proposedChallengesData, myIdeasData] = await Promise.all([
        getUserParticipations(user.id),
        getAllBadges(locale),
        getUserBadges(user.id, locale),
        getLeaderboard(10),
        getUserChallenges(user.id),
        getUserIdeas(user.id),
      ]);

      setParticipations(participationsData);
      setAllBadges(allBadgesData);
      setUserBadges(userBadgesData);
      setLeaderboard(leaderboardData);
      setProposedChallenges(proposedChallengesData);
      setMyIdeas(myIdeasData);
      setFeaturedBadgeId(user.featured_badge_id || null);
      setIsLoading(false);
    }
    loadData();
  }, [user, locale]);

  useEffect(() => {
    let isCancelled = false;

    async function runSearch() {
      const trimmed = userSearchTerm.trim();
      if (!trimmed) {
        setUserSearchResults([]);
        return;
      }

      setIsSearchingUsers(true);
      const results = await searchUsers(trimmed, 5);
      if (!isCancelled) {
        setUserSearchResults(results);
        setIsSearchingUsers(false);
      }
    }

    const timer = setTimeout(runSearch, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [userSearchTerm]);

  if (authLoading || !user) {
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

  const config = levelConfig[user.niveau_actuel] || levelConfig.Explorer;
  const LevelIcon = config.icon;
  const sanitizedName = user.nom && user.nom !== 'Anonyme' ? user.nom : null;
  const displayName = sanitizedName || formatNameFromEmail(user.email) || 'Anonyme';
  
  const inProgress = participations.filter(p => p.statut === 'En_cours');
  const completed = participations.filter(p => p.statut === 'Terminé');

  // Progression par niveau (basée sur challenges terminés)
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

  // Badges avec statut obtained
  const badgesWithStatus = allBadges.map(badge => ({
    ...badge,
    obtained: userBadges.some(ub => ub.id === badge.id),
  }));

  const pendingIdeasCount = myIdeas.filter((idea) => idea.statut === 'Proposee').length;

  const handleDeleteIdea = async (idea: IdeaProposal) => {
    const confirmed = window.confirm(tIdeas('deleteConfirm'));
    if (!confirmed) return;

    const success = await deleteIdeaProposal(idea.id);
    if (success) {
      setMyIdeas((prev) => prev.filter((item) => item.id !== idea.id));
      if (editingIdea?.id === idea.id) {
        setEditingIdea(null);
      }
    }
  };

  const handleIdeaUpdated = (updated: IdeaProposal) => {
    setMyIdeas((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingIdea(null);
  };

  const handleBadgeSelect = async (badgeId: string | null) => {
    if (!user) return;
    setIsUpdatingBadge(true);
    const updated = await updateUser(user.id, { featured_badge_id: badgeId });
    if (updated) {
      setFeaturedBadgeId(badgeId);
      setStoredUser(updated);
      await refreshUser();
    }
    setIsUpdatingBadge(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <div className="space-y-8">
              {/* Profile header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex flex-col items-start gap-3">
                      <Avatar className="h-20 w-20">
                        {user.avatar_url && <AvatarImage src={user.avatar_url} alt={displayName} />}
                        <AvatarFallback className="bg-exalt-blue text-white text-2xl">
                          {user.nom?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                        </AvatarFallback>
                        {featuredBadgeId && (
                          <AvatarBadge className="text-2xl size-10">
                            {badgesWithStatus.find((badge) => badge.id === featuredBadgeId)?.emoji || '🏅'}
                          </AvatarBadge>
                        )}
                      </Avatar>
                      <AvatarUpload
                        user={user}
                        onUpdated={(updated) => {
                          setStoredUser(updated);
                          setFeaturedBadgeId(updated.featured_badge_id || null);
                        }}
                      />
                    </div>

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
                          <span className="font-semibold">{user.points_totaux} {tCommon('xp')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          <span>{completed.length} {t('challengesCompleted')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>{inProgress.length} {t('inProgress')}</span>
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
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle>{t('myChallenges')}</CardTitle>
                    {editingIdea && (
                      <Button variant="outline" size="sm" onClick={() => setEditingIdea(null)}>
                        {tCommon('cancel')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingIdea ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{tIdeas('editHint')}</p>
                      <IdeaProposalForm
                        authorId={user.id}
                        existingIdea={editingIdea}
                        onSuccess={handleIdeaUpdated}
                      />
                    </div>
                  ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="en-cours" className="gap-2">
                          <Clock className="h-4 w-4" />
                          {t('tabs.inProgress')} ({inProgress.length})
                        </TabsTrigger>
                        <TabsTrigger value="termines" className="gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {t('tabs.completed')} ({completed.length})
                        </TabsTrigger>
                        <TabsTrigger value="proposes" className="gap-2">
                          <Medal className="h-4 w-4" />
                          {t('tabs.proposed')} ({proposedChallenges.length})
                        </TabsTrigger>
                        <TabsTrigger value="ideas" className="gap-2">
                          <Brain className="h-4 w-4" />
                          {t('tabs.ideas')} ({myIdeas.length})
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
                              {t('empty.inProgress')}
                            </p>
                            <Link href="/challenges">
                              <Button variant="outline">{t('empty.exploreChallenges')}</Button>
                            </Link>
                          </div>
                        ) : (
                          inProgress.map(({ challenge, ...participation }) => (
                            <Link
                              key={participation.challenge_id}
                              href={"/challenges/" + participation.challenge_id}
                              className="block"
                            >
                              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent-cyan transition-colors">
                                <div>
                                  <h4 className="font-medium">{challenge?.titre || 'Challenge'}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                      {challenge?.niveau_associe}
                                    </Badge>
                                    <span className="flex items-center gap-1 text-accent-jaune">
                                      <Zap className="h-3 w-3" />
                                      {challenge?.xp} {tCommon('xp')}
                                    </span>
                                  </div>
                                </div>
                                <Button size="sm" className="bg-accent-cyan hover:bg-accent-cyan/80 text-black">
                                  {tChallenges('continue')}
                                </Button>
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
                          <p className="text-muted-foreground text-center py-8">
                            {t('empty.completed')}
                          </p>
                        ) : (
                          completed.map(({ challenge, ...participation }) => (
                            <Link
                              key={participation.challenge_id}
                              href={"/challenges/" + participation.challenge_id}
                              className="block"
                            >
                              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:border-accent-vert transition-colors">
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="h-5 w-5 text-accent-vert" />
                                  <div>
                                    <h4 className="font-medium">{challenge?.titre || 'Challenge'}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                      <Badge variant="outline" className="text-xs">
                                        {challenge?.niveau_associe}
                                      </Badge>
                                      <span className="flex items-center gap-1 text-accent-vert">
                                        <Zap className="h-3 w-3" />
                                        +{challenge?.xp} {tCommon('xp')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  {tChallenges('review')}
                                </Button>
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
                          <p className="text-muted-foreground text-center py-8">
                            {t('empty.proposed')}
                          </p>
                        ) : (
                          proposedChallenges.map((challenge) => (
                            <Link
                              key={challenge.id}
                              href={"/challenges/" + challenge.id}
                              className="block"
                            >
                              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:border-accent-cyan transition-colors">
                                <div>
                                  <h4 className="font-medium">{challenge.titre}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                      {challenge.niveau_associe}
                                    </Badge>
                                    <span className="text-xs uppercase">{challenge.statut}</span>
                                  </div>
                                  {challenge.statut === 'Refuse' && challenge.validation_commentaire && (
                                    <p className="mt-2 text-xs text-destructive">
                                      {t('refused')}: {challenge.validation_commentaire}
                                    </p>
                                  )}
                                </div>
                                <Button variant="ghost" size="sm">
                                  {tCommon('view')}
                                </Button>
                              </div>
                            </Link>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="ideas" className="space-y-3">
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                          </div>
                        ) : myIdeas.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            {t('empty.ideas')}
                          </p>
                        ) : (
                          myIdeas.map((idea) => (
                            <div key={idea.id} className="rounded-lg border border-border bg-card/50 p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {idea.themes[0] ? tIdeas('ideaThemes.' + idea.themes[0]) : '-'}
                                </Badge>
                                <span className="text-xs uppercase text-muted-foreground">
                                  {tIdeas('ideaStatus.' + idea.statut)}
                                </span>
                              </div>
                              <h4 className="font-medium">{idea.titre}</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{idea.description}</p>
                              {idea.statut === 'Refusee' && idea.validation_commentaire && (
                                <p className="text-xs text-destructive">
                                  {t('refused')}: {idea.validation_commentaire}
                                </p>
                              )}
                              <div className="flex items-center gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingIdea(idea)}>
                                  {tIdeas('edit')}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteIdea(idea)}
                                >
                                  {tCommon('delete')}
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>

              {pendingIdeasCount >= 3 && (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  {tIdeas('limitReached')}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Badges */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Medal className="h-5 w-5 text-accent-jaune" />
                    {tBadges('title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">{t('featuredBadge')}</p>
                        <div className="grid grid-cols-3 gap-3">
                          {badgesWithStatus
                            .filter((badge) => badge.obtained)
                            .map((badge) => (
                              <button
                                key={badge.id}
                                onClick={() => handleBadgeSelect(badge.id)}
                                disabled={isUpdatingBadge}
                                className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                                  featuredBadgeId === badge.id
                                    ? 'border-accent-cyan bg-accent-cyan/10'
                                    : 'border-border'
                                }`}
                              >
                                <span className="text-2xl mb-1">{badge.emoji}</span>
                                <span className="text-xs text-center text-muted-foreground">
                                  {badge.nom}
                                </span>
                              </button>
                            ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleBadgeSelect(null)}
                          disabled={isUpdatingBadge}
                        >
                          {t('featuredBadgeClear')}
                        </Button>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">{t('allBadges')}</p>
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-accent-jaune" />
                        {tLeaderboard('title')}
                      </CardTitle>
                      <CardDescription>
                        {leaderboardScope === 'global'
                          ? tLeaderboard('global')
                          : leaderboardScope === 'entite'
                          ? tLeaderboard('entity')
                          : tLeaderboard('circle')}
                      </CardDescription>
                    </div>
                    <select
                      value={leaderboardScope}
                      onChange={(event) => setLeaderboardScope(event.target.value as 'global' | 'entite' | 'cercle')}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground focus:border-accent-cyan focus:outline-none"
                    >
                      <option value="global">{tLeaderboard('scope.global')}</option>
                      <option value="entite">{tLeaderboard('scope.entity')}</option>
                      <option value="cercle">{tLeaderboard('scope.circle')}</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      value={userSearchTerm}
                      onChange={(event) => setUserSearchTerm(event.target.value)}
                      placeholder={tLeaderboard('searchUser')}
                      className="bg-background border-border focus:border-accent-cyan"
                    />
                    {userSearchTerm.trim().length > 0 && (
                      <div className="mt-2 rounded-lg border border-border bg-card p-2 space-y-1">
                        {isSearchingUsers ? (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {tLeaderboard('searching')}
                          </div>
                        ) : userSearchResults.length === 0 ? (
                          <div className="text-xs text-muted-foreground px-2 py-1">
                            {tCommon('noResults')}
                          </div>
                        ) : (
                          userSearchResults.map((result) => (
                            <Link
                              key={result.id}
                              href={`/users/${result.id}`}
                              className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent-cyan/10"
                            >
                              <span className="font-medium truncate">{result.nom}</span>
                              <span className="text-xs text-muted-foreground truncate">{result.email}</span>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-exalt-blue" />
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {tLeaderboard('noRanking')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.map((entry, index) => {
                        const isCurrentUser = entry.user_id === user.id;
                        const href = isCurrentUser ? '/me' : `/users/${entry.user_id}`;
                        return (
                          <Link
                            key={entry.user_id}
                            href={href}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:border hover:border-accent-cyan ${
                              isCurrentUser ? 'bg-exalt-blue/20 border border-exalt-blue/50' : ''
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
                                {isCurrentUser && <span className="text-exalt-blue ml-1">{tLeaderboard('you')}</span>}
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
