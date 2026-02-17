'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IdeaProposalForm } from '@/components/ideas/IdeaProposalForm';
import { useAuth } from '@/lib/auth';

export default function ProposeIdeaPage() {
  const { user } = useAuth();
  const t = useTranslations('ideas.propose');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToIdeas')}
          </Link>

          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

          {user ? (
            <IdeaProposalForm authorId={user.id} />
          ) : (
            <p className="text-muted-foreground">{t('loginRequired')}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
