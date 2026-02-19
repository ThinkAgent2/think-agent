'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Zap, CheckCircle } from 'lucide-react';
import type { Challenge, Participation, Solution } from '@/types/database';

interface ChallengeCardProps {
  challenge: Challenge;
  participation?: Participation;
  solution?: Solution;
}

const levelConfig = {
  Explorer: { color: 'bg-accent-vert text-black', glow: 'hover:glow-vert' },
  Crafter: { color: 'bg-exalt-blue text-white', glow: 'hover:glow-blue' },
  Architecte: { color: 'bg-accent-rose text-white', glow: 'hover:glow-rose' },
};

export function ChallengeCard({ challenge, participation, solution }: ChallengeCardProps) {
  const config = levelConfig[challenge.niveau_associe];
  const isCompleted = participation?.statut === 'Terminé';
  const isInProgress = participation?.statut === 'En_cours';
  const isPending = solution?.statut === 'Soumise';
  const isEvaluated = solution?.statut === 'Évaluée';
  const isValidated = isEvaluated && (solution?.note ?? 0) >= 3;
  const isFailed = isEvaluated && (solution?.note ?? 0) < 3;
  const t = useTranslations('challenges.card');
  const tCommon = useTranslations('common');

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 bg-card border-border ${config.glow} transition-glow`}>
      {/* Status indicator */}
      {isPending && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-jaune/20 text-accent-jaune border border-accent-jaune px-2 py-1 text-[10px] font-semibold">
            <CheckCircle className="h-3 w-3" />
            {t('status.pending')}
          </span>
        </div>
      )}
      {isValidated && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-vert/20 text-accent-vert border border-accent-vert px-2 py-1 text-[10px] font-semibold">
            <CheckCircle className="h-3 w-3" />
            {t('status.completed')}
          </span>
        </div>
      )}
      {isFailed && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/20 text-destructive border border-destructive px-2 py-1 text-[10px] font-semibold">
            <CheckCircle className="h-3 w-3" />
            {t('status.failed')}
          </span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={config.color}>{challenge.niveau_associe}</Badge>
          <div className="flex flex-wrap gap-1">
            {challenge.marques && challenge.marques.length > 0 ? (
              challenge.marques.map((marque) => (
                <Badge key={marque} variant="outline" className="text-xs">
                  {marque}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {tCommon('allBrands')}
              </Badge>
            )}
          </div>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-tight line-clamp-2">
          {challenge.titre}
        </h3>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {challenge.description.slice(0, 120)}...
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Difficulté */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < challenge.difficulte ? 'fill-accent-jaune text-accent-jaune' : 'text-muted'}`}
              />
            ))}
          </div>

          {/* Participants */}
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {challenge.participants}
          </div>

          {/* XP */}
          <div className="flex items-center gap-1 text-accent-jaune font-medium">
            <Zap className="h-3 w-3" />
            {challenge.xp} {tCommon('xp')}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/challenges/${challenge.id}`} className="w-full">
          <Button
            className={`w-full ${isInProgress ? 'bg-accent-cyan hover:bg-accent-cyan/80' : 'bg-accent-jaune hover:bg-accent-jaune/80'} text-black font-semibold`}
          >
            {isCompleted ? t('review') : isInProgress ? t('continue') : t('seeDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
