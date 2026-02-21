'use client';

const leagueColors: Record<string, string> = {
  Bronze: 'bg-[#CD7F32]/20 text-[#CD7F32] border-[#CD7F32]/50',
  Argent: 'bg-[#C0C0C0]/20 text-[#C0C0C0] border-[#C0C0C0]/50',
  Or: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50',
  Platine: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  Diamant: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  Master: 'bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-500/20 text-yellow-200 border-yellow-300/40',
};

export function LeagueBanner({ league }: { league?: string | null }) {
  const label = league || 'Bronze';
  const styles = leagueColors[label] || leagueColors.Bronze;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}
