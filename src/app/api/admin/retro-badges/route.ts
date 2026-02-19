import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { checkAndUpdateLevelAndBadges } from '@/lib/supabase/queries';

export async function POST() {
  try {
    const supabaseAdmin = createAdminClient();
    const supabaseAuth = await createClient();

    const { data: authData, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !user || user.role !== 'Administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id');

    if (error || !users) {
      return NextResponse.json({ error: 'Erreur récupération users' }, { status: 500 });
    }

    let processed = 0;
    for (const u of users) {
      await checkAndUpdateLevelAndBadges(u.id);
      processed++;
    }

    return NextResponse.json({ ok: true, processed });
  } catch (error) {
    console.error('retro-badges error', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
