'use client';

import { AvatarWithLeagueBorder } from '@/components/gamification/AvatarWithLeagueBorder';
import type { LeaderboardEntry } from '@/types/database';

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
            <AvatarWithLeagueBorder league={(entry as { league?: string }).league} size={36} />
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
