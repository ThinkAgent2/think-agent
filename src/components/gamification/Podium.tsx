'use client';

import { AvatarWithLeagueBorder } from '@/components/gamification/AvatarWithLeagueBorder';
import { LeagueBanner } from '@/components/gamification/LeagueBanner';
import type { LeaderboardEntry } from '@/types/database';

interface PodiumProps {
  entries: LeaderboardEntry[];
}

export function Podium({ entries }: PodiumProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {entries.map((entry, index) => (
        <div key={entry.user_id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <AvatarWithLeagueBorder league={(entry as { league?: string }).league} />
            <div>
              <div className="text-sm text-muted-foreground">#{index + 1}</div>
              <div className="text-lg font-semibold">{entry.nom}</div>
              <div className="text-sm text-muted-foreground">{entry.points_totaux} XP</div>
              <LeagueBanner league={(entry as { league?: string }).league} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
