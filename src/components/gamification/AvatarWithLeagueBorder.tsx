'use client';

import { cn } from '@/lib/utils';

const leagueStyles: Record<string, string> = {
  Bronze: 'border-[#CD7F32]',
  Argent: 'border-[#C0C0C0]',
  Or: 'border-[#FFD700]',
  Platine: 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]',
  Diamant: 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
  Master: 'border-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 p-[2px] animate-pulse',
};

interface AvatarWithLeagueBorderProps {
  src?: string | null;
  alt?: string;
  size?: number;
  league?: string | null;
  streakDays?: number | null;
  className?: string;
}

export function AvatarWithLeagueBorder({ src, alt, size = 44, league, streakDays, className }: AvatarWithLeagueBorderProps) {
  const wrapperClass = league ? leagueStyles[league] || 'border-border' : 'border-border';

  return (
    <div
      className={cn('rounded-full border-2 bg-background relative', wrapperClass, className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src || '/avatar-placeholder.png'}
        alt={alt || 'Avatar'}
        className="h-full w-full rounded-full object-cover"
      />
      {typeof streakDays === 'number' && streakDays >= 5 && (
        <span className="absolute -top-2 right-0 text-sm" title={`Streak ${streakDays} jours`}>🔥</span>
      )}
    </div>
  );
}
