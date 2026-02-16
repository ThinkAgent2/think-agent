'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProposeChallengeForm } from '@/components/challenges/ProposeChallengeForm';
import { useAuth } from '@/lib/auth';

export default function ProposeChallengePage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>

          <h1 className="text-3xl font-bold mb-2">Proposer un challenge</h1>
          <p className="text-muted-foreground mb-6">
            Décris ton challenge et propose ta solution. Un admin validera avant publication.
          </p>

          {user ? (
            <ProposeChallengeForm authorId={user.id} />
          ) : (
            <p className="text-muted-foreground">Connecte-toi pour proposer un challenge.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
