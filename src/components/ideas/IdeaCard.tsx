'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IdeaWithVotes } from '@/types/database';

interface IdeaCardProps {
  idea: IdeaWithVotes;
  canVote: boolean;
  onVote: (idea: IdeaWithVotes) => void;
  disabled?: boolean;
}

export function IdeaCard({ idea, canVote, onVote, disabled }: IdeaCardProps) {
  const t = useTranslations('ideas');

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {idea.themes.map((theme) => (
              <Badge key={theme} variant="outline">
                {t(`themes.${theme}`)}
              </Badge>
            ))}
            <Badge className="bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40">
              {t(`status.${idea.statut}`)}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold">{idea.titre}</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{idea.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-muted-foreground">{t('votes', { count: idea.votes })}</div>
          <Button
            size="sm"
            onClick={() => onVote(idea)}
            disabled={!canVote || idea.hasVoted || disabled}
          >
            {idea.hasVoted ? t('voted') : t('vote')}
          </Button>
        </div>
      </div>

      {idea.screenshots && idea.screenshots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {idea.screenshots.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              <img
                src={url}
                alt={idea.titre}
                className="w-full h-24 object-cover rounded-md border border-border"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
