'use client';

import type { LeaderboardEntry } from '@/types/database';

interface PodiumProps {
  entries: LeaderboardEntry[];
}

const podiumHeights = [
  'md:mt-6',
  'md:mt-0',
  'md:mt-10',
];

const podiumColors = [
  'bg-[#C0C0C0]/20 border-[#C0C0C0]/50',
  'bg-[#FFD700]/20 border-[#FFD700]/50',
  'bg-[#CD7F32]/20 border-[#CD7F32]/50',
];

export function Podium({ entries }: PodiumProps) {
  const ordered = [entries[1], entries[0], entries[2]].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      {ordered.map((entry, index) => (
        <div key={entry.user_id} className={`rounded-xl border p-4 ${podiumColors[index]} ${podiumHeights[index]}`}>
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
              #{index === 1 ? 1 : index === 0 ? 2 : 3}
            </div>
            <div className="mt-3 text-lg font-semibold">{entry.nom}</div>
            <div className="text-xs text-muted-foreground">{entry.niveau_actuel}</div>
            <div className="mt-2 text-sm font-semibold">{entry.points_totaux} XP</div>
            <div className="mt-2 text-xs text-muted-foreground">
              {(entry as { selected_title?: string }).selected_title || ''}
            </div>
            <div className="mt-2 flex items-center gap-1 text-lg">
              {(entry as { selected_badge_primary?: string | null }).selected_badge_primary ? '🏅' : ''}
              {(entry as { selected_badge_secondary?: string | null }).selected_badge_secondary ? '⭐' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
