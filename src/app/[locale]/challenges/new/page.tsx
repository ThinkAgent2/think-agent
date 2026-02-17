'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ChallengeCreateForm } from '@/components/challenges/ChallengeCreateForm';

export default function NewChallengePage() {
  const router = useRouter();
  const locale = useLocale();
  const { user } = useAuth();
  const t = useTranslations('challenges');
  const tNav = useTranslations('nav');

  const isAdmin = user?.role === 'Administrateur';

  // Rediriger si pas admin
  if (user && !isAdmin) {
    router.push(`/${locale}/challenges`);
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back link */}
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {useTranslations('challenges.detail')('backToCatalog')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">{t('newChallenge')}</h1>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{useTranslations('challenges.detail')('loginToParticipate')}</p>
              <Link href="/login">
                <Button className="mt-4">{tNav('login')}</Button>
              </Link>
            </div>
          ) : (
            <ChallengeCreateForm
              onSuccess={(challenge) => {
                router.push(`/${locale}/challenges/${challenge.id}`);
              }}
              onCancel={() => {
                router.push(`/${locale}/challenges`);
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
