'use client';

import type { LeaderboardEntry } from '@/types/database';
import { AvatarWithLeagueBorder } from '@/components/gamification/AvatarWithLeagueBorder';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div key={entry.user_id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-6">{index + 4}</div>
            <AvatarWithLeagueBorder
              league={(entry as { league?: string }).league}
              size={36}
              src={(entry as { avatar_url?: string | null }).avatar_url || null}
              alt={entry.nom}
              streakDays={(entry as { current_streak?: number | null }).current_streak || null}
            />
            <div>
              <div className="font-medium">{entry.nom}</div>
              <div className="text-xs text-muted-foreground">{entry.niveau_actuel}</div>
            </div>
          </div>
          <div className="text-sm font-semibold">{entry.points_totaux} XP</div>
        </div>
      ))}
    </div>
  );
}
