'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import AdminChallengesPage from '@/app/[locale]/admin/challenges/page';
import AdminIdeasPage from '@/app/[locale]/admin/ideas/page';

export default function AdminValidationHubPage() {
  const { user } = useAuth();
  const t = useTranslations('admin.validationHub');
  const [view, setView] = useState<'challenges' | 'ideas'>('challenges');

  if (!user || user.role !== 'Administrateur') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('accessDenied')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={view === 'challenges' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('challenges')}
            >
              {t('challenges')}
            </Button>
            <Button
              variant={view === 'ideas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('ideas')}
            >
              {t('ideas')}
            </Button>
          </div>

          {view === 'challenges' ? <AdminChallengesPage /> : <AdminIdeasPage />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
