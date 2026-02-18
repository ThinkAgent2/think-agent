import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const locale = url.pathname.split('/')[1];
  const hasCode = url.searchParams.has('code');

  if (hasCode && locale) {
    url.pathname = `/${locale}/auth/callback`;
    return Response.redirect(url);
  }

  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js static files
  // - Files with extensions
  matcher: ['/', '/(fr|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
