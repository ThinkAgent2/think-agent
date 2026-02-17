'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { DojoEventForm } from '@/components/events/DojoEventForm';

export default function NewEventPage() {
  const router = useRouter();
  const locale = useLocale();
  const { user } = useAuth();
  const t = useTranslations('events');
  const tNav = useTranslations('nav');

  const isAdmin = user?.role === 'Administrateur';

  // Rediriger si pas admin
  if (user && !isAdmin) {
    router.push(`/${locale}/events`);
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {useTranslations('common')('back')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">{t('newEvent')}</h1>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{useTranslations('challenges.detail')('loginToParticipate')}</p>
              <Link href="/login">
                <Button className="mt-4">{tNav('login')}</Button>
              </Link>
            </div>
          ) : (
            <DojoEventForm
              onSuccess={() => {
                router.push(`/${locale}/events`);
              }}
              onCancel={() => {
                router.push(`/${locale}/events`);
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
