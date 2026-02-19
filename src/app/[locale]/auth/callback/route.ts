import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { routing } from '@/i18n/routing';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/';

  if (!next.startsWith('/')) {
    next = '/';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const base = isLocalEnv
        ? origin
        : forwardedHost
          ? `https://${forwardedHost}`
          : origin;

      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const admin = createAdminClient();
        const { data: existingUser } = await admin
          .from('users')
          .select('id, auth_id')
          .eq('auth_id', authData.user.id)
          .maybeSingle();

        if (!existingUser) {
          const { data: userByEmail } = await admin
            .from('users')
            .select('id, auth_id')
            .eq('email', authData.user.email)
            .maybeSingle();

          if (userByEmail) {
            await admin
              .from('users')
              .update({ auth_id: authData.user.id })
              .eq('id', userByEmail.id);
          } else {
            await admin
              .from('users')
              .insert({
                auth_id: authData.user.id,
                email: authData.user.email,
                nom: authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || null,
                niveau_actuel: 'Explorer',
                role: 'Utilisateur',
                points_totaux: 0,
              });
          }
        }
      }

      const defaultLocale = routing.defaultLocale || 'fr';
      return NextResponse.redirect(`${base}/${defaultLocale}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
