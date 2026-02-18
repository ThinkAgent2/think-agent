'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const { user, login, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('login');
  const tCommon = useTranslations('common');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user && !authLoading) {
      router.push(`/${locale}/challenges`);
    }
  }, [user, authLoading, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login();
    } catch {
      setError(t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un loader pendant la vérification auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-exalt-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-exalt-blue/10 via-background to-accent-rose/5" />
      
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {tCommon('back')}
      </Link>

      {/* Card */}
      <Card className="relative w-full max-w-md border-border bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-exalt-blue">
            <Zap className="h-9 w-9 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold">
            <span className="text-exalt-blue">THINK</span>{' '}
            <span className="text-accent-rose">AGENT</span>
          </CardTitle>
          
          <CardDescription className="text-muted-foreground">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-accent-jaune hover:bg-accent-jaune/80 text-black font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('connecting')}
                </>
              ) : (
                t('continue')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tagline */}
      <p className="relative mt-8 text-sm text-muted-foreground">
        {useTranslations('home')('tagline')}
      </p>
    </div>
  );
}
