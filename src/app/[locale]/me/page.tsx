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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '@/components/ui/avatar';
import { 
  Zap, Clock, CheckCircle, XCircle,
  Medal, Crown, Rocket, Brain, Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getUserParticipations, getAllBadges, getUserBadges, getUserChallenges, getUserIdeas, deleteIdeaProposal, updateUser, deleteChallenge, getUserSolutions } from '@/lib/supabase/queries';
import { formatNameFromEmail } from '@/lib/userName';
import { localizeChallenge } from '@/lib/supabase/localization';
import { getEarnedTitles, getThemeTitle } from '@/services/progressionService';
import type { Badge as BadgeType, Challenge, Participation, IdeaProposal, Solution } from '@/types/database';
import { IdeaProposalForm } from '@/components/ideas/IdeaProposalForm';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ThemeProgressCircles } from '@/components/gamification/ThemeProgressCircles';
import { TitleSelector } from '@/components/gamification/TitleSelector';
import { LeagueBanner } from '@/components/gamification/LeagueBanner';

const levelConfig: Record<string, { color: string; icon: typeof Brain; nextLevel: string | null; xpNeeded: number | null }> = {
  Explorer: { color: 'bg-accent-vert text-black', icon: Brain, nextLevel: 'Crafter', xpNeeded: 150 },
  Crafter: { color: 'bg-exalt-blue text-white', icon: Rocket, nextLevel: 'Architecte', xpNeeded: 500 },
  Architecte: { color: 'bg-accent-rose text-white', icon: Crown, nextLevel: null, xpNeeded: null },
};

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const { user, isLoading: authLoading, refreshUser } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = window.location.pathname + window.location.search;
      const stack = JSON.parse(sessionStorage.getItem('navStack') || '[]');
      if (stack[stack.length - 1] !== current) {
        stack.push(current);
        sessionStorage.setItem('navStack', JSON.stringify(stack));
      }
      sessionStorage.setItem('lastRoute', current);
    }
  }, []);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [participations, setParticipations] = useState<(Participation & { challenge?: Challenge })[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeType[]>([]);
  const [proposedChallenges, setProposedChallenges] = useState<Challenge[]>([]);
  const [myIdeas, setMyIdeas] = useState<IdeaProposal[]>([]);
  const [editingIdea, setEditingIdea] = useState<IdeaProposal | null>(null);
  const [featuredBadgeId, setFeaturedBadgeId] = useState<string | null>(null);
  const [selectedPrimaryBadge, setSelectedPrimaryBadge] = useState<string | null>(null);
  const [selectedSecondaryBadge, setSelectedSecondaryBadge] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [isUpdatingBadge, setIsUpdatingBadge] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations('profile');
  const tBadges = useTranslations('badges');
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
    let isCancelled = false;

    async function loadData() {
      if (!user) return;

      setIsLoading(true);
      try {
        const [participationsData, allBadgesData, userBadgesData, proposedChallengesData, myIdeasData, solutionsData] = await Promise.all([
          getUserParticipations(user.id),
          getAllBadges(locale),
          getUserBadges(user.id, locale),
          getUserChallenges(user.id),
          getUserIdeas(user.id),
          getUserSolutions(user.id),
        ]);

        const localizedParticipations = participationsData.map((participation) => ({
          ...participation,
          challenge: participation.challenge ? localizeChallenge(participation.challenge, locale) : participation.challenge,
        }));

        if (!isCancelled) {
          setParticipations(localizedParticipations);
          setAllBadges(allBadgesData);
          setUserBadges(userBadgesData);
          setProposedChallenges(proposedChallengesData);
          setMyIdeas(myIdeasData);
          setFeaturedBadgeId(user.featured_badge_id || null);
          setSelectedPrimaryBadge(user.selected_badge_primary || null);
          setSelectedSecondaryBadge(user.selected_badge_secondary || null);
          setSelectedTitle(user.selected_title || null);
          setSolutions(solutionsData);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [user, locale]);


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

  const solutionsByChallenge = new Map(solutions.map((solution) => [solution.challenge_id, solution]));
  const completed = participations.filter((p) => p.statut === 'Terminé');

  // Badges avec statut obtained
  const badgesWithStatus = allBadges.map(badge => ({
    ...badge,
    obtained: userBadges.some(ub => ub.id === badge.id),
  }));

  const pendingIdeasCount = myIdeas.filter((idea) => idea.statut === 'Proposee').length;

  const earnedTitles = [
    ...getEarnedTitles(user?.explorer_completed_count ?? 0, 'Explorer'),
    ...getEarnedTitles(user?.crafter_completed_count ?? 0, 'Crafter'),
    ...getEarnedTitles(user?.architect_completed_count ?? 0, 'Architecte'),
  ];

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

  const handleDeleteProposedChallenge = async (challenge: Challenge) => {
    if (!confirm(tCommon('confirmDelete'))) return;
    const result = await deleteChallenge(challenge.id);
    if (result.success) {
      setProposedChallenges((prev) => prev.filter((item) => item.id !== challenge.id));
    } else {
      alert(result.error || tCommon('genericError'));
    }
  };

  const handleBadgeSelect = async (badgeId: string | null) => {
    if (!user) return;
    setIsUpdatingBadge(true);
    const updated = await updateUser(user.id, { featured_badge_id: badgeId });
    if (updated) {
      setFeaturedBadgeId(badgeId);
      await refreshUser();
    }
    setIsUpdatingBadge(false);
  };

  const handleSelectedBadgeChange = async (primary: string | null, secondary: string | null) => {
    if (!user) return;
    setIsUpdatingBadge(true);
    const updated = await updateUser(user.id, { selected_badge_primary: primary, selected_badge_secondary: secondary });
    if (updated) {
      setSelectedPrimaryBadge(primary);
      setSelectedSecondaryBadge(secondary);
      await refreshUser();
    }
    setIsUpdatingBadge(false);
  };

  const handleTitleSelect = async (title: string | null) => {
    if (!user) return;
    setIsUpdatingBadge(true);
    const updated = await updateUser(user.id, { selected_title: title });
    if (updated) {
      setSelectedTitle(title);
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
                <AvatarBadge className="text-3xl size-12">
                  {badgesWithStatus.find((badge) => badge.id === featuredBadgeId)?.emoji || '🏅'}
                </AvatarBadge>
              )}
            </Avatar>
            <AvatarUpload
              user={user}
              onUpdated={(updated) => {
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
            </div>
                    </div>
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
                    <>
                      <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                <CardHeader>
                  <CardTitle>{t('globalXp')}</CardTitle>
                  <CardDescription>{t('levelGlobal')}: {user?.level_global ?? 1}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{user?.xp_global ?? 0} XP</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('weeklyXp')}</CardTitle>
                  <CardDescription>{t('league')}: {user?.league ?? 'Bronze'}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-2xl font-semibold">{user?.xp_weekly ?? 0} XP</p>
                  <LeagueBanner league={user?.league} />
                </CardContent>
              </Card>
            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                <CardHeader>
                  <CardTitle>{t('currentStreak')}</CardTitle>
                  <CardDescription>{t('maxStreak')}: {user?.max_streak ?? 0}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{user?.current_streak ?? 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('titles')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                            <div className="text-sm">Explorer: {getThemeTitle(user?.explorer_completed_count ?? 0)}</div>
                            <div className="text-sm">Crafter: {getThemeTitle(user?.crafter_completed_count ?? 0)}</div>
                            <div className="text-sm">Architecte: {getThemeTitle(user?.architect_completed_count ?? 0)}</div>
                </CardContent>
              </Card>
            </div>

            <ThemeProgressCircles
              explorerCount={user?.explorer_completed_count ?? 0}
              crafterCount={user?.crafter_completed_count ?? 0}
              architectCount={user?.architect_completed_count ?? 0}
            />

          </div>

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
                    {(() => {
                      const solution = solutionsByChallenge.get(participation.challenge_id);
                      const isPending = solution?.statut === 'Soumise';
                      const isFailed = solution?.statut === 'Évaluée' && (solution.note ?? 0) < 3;
                      const isValidated = solution?.statut === 'Évaluée' && (solution.note ?? 0) >= 3;
                      const borderClass = isFailed
                        ? 'border-destructive/60'
                        : isPending
                        ? 'border-accent-jaune/60'
                        : 'border-border';

                      const icon = isFailed ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : isPending ? (
                        <Clock className="h-5 w-5 text-accent-jaune" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-accent-vert" />
                      );

                      return (
                                  <div className={`flex items-center justify-between p-4 rounded-lg border ${borderClass} bg-card/50 hover:border-accent-vert transition-colors`}>
                                    <div className="flex items-center gap-3">
                            {icon}
                                      <div>
                              <h4 className="font-medium">{challenge?.titre || 'Challenge'}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                        {challenge?.niveau_associe}
                                </Badge>
                                {isFailed ? (
                        <span className="text-destructive text-xs">{t('challengeFailed')}</span>
                                ) : isValidated ? (
                        <span className="text-accent-vert text-xs">{t('challengeCompleted')}</span>
                                ) : isPending ? (
                        <span className="text-accent-jaune text-xs">{t('challengePending')}</span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {tChallenges('review')}
                          </Button>
                        </div>
                      );
                    })()}
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
                            <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:border-accent-cyan transition-colors"
                  >
                    <Link
                      href={"/challenges/" + challenge.id}
                      className="flex-1"
                    >
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
                    </Link>
                              <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={"/challenges/" + challenge.id}>
                          {tCommon('view')}
                        </Link>
                      </Button>
                      {challenge.statut === 'Propose' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProposedChallenge(challenge)}
                        >
                          {tCommon('delete')}
                        </Button>
                      )}
                    </div>
                  </div>
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
                    </>
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
                        <p className="text-sm font-medium mb-2">{t('badgeSelect')}</p>
                        <p className="text-xs text-muted-foreground mb-3">{t('badgeSelectHint')}</p>
                        <div className="grid grid-cols-3 gap-3">
                          {badgesWithStatus.map((badge) => {
                            const isPrimary = selectedPrimaryBadge === badge.id;
                            const isSecondary = selectedSecondaryBadge === badge.id;
                            const disabled = !badge.obtained;
                            return (
                              <button
                                key={badge.id}
                                onClick={() => {
                                  if (disabled) return;
                                  let nextPrimary = selectedPrimaryBadge;
                                  let nextSecondary = selectedSecondaryBadge;
                                  if (!isPrimary && !isSecondary) {
                                    if (!nextPrimary) {
                                      nextPrimary = badge.id;
                                    } else if (!nextSecondary) {
                                      nextSecondary = badge.id;
                                    } else {
                                      nextPrimary = badge.id;
                                      nextSecondary = null;
                                    }
                                  } else if (isPrimary) {
                                    nextPrimary = null;
                                  } else if (isSecondary) {
                                    nextSecondary = null;
                                  }
                                  handleSelectedBadgeChange(nextPrimary, nextSecondary);
                                }}
                                disabled={isUpdatingBadge}
                                title={badge.description || tBadges('howToEarnDefault')}
                                className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                                  disabled
                                    ? 'border-border opacity-40'
                                    : isPrimary || isSecondary
                                    ? 'border-accent-cyan bg-accent-cyan/10'
                                    : 'border-border'
                                }`}
                              >
                                <span className="text-2xl mb-1">{badge.icon || badge.emoji}</span>
                                <span className="text-xs text-center text-muted-foreground">
                                  {badge.nom}
                                </span>
                                {isPrimary && <span className="text-[10px] mt-1">(1)</span>}
                                {isSecondary && <span className="text-[10px] mt-1">(2)</span>}
                              </button>
                            );
                          })}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleSelectedBadgeChange(null, null)}
                          disabled={isUpdatingBadge}
                        >
                          {t('clearBadge')}
                        </Button>
                      </div>
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
