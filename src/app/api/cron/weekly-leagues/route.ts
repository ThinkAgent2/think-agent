import { NextResponse } from 'next/server';
import { updateLeagueWeeklyAdmin } from '@/lib/supabase/progressionAdmin';

export async function GET() {
  await updateLeagueWeeklyAdmin();
  return NextResponse.json({ ok: true });
}
