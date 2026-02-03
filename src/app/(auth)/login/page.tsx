'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/challenges');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);

    try {
      const loggedInUser = await login(trimmedEmail);
      
      if (loggedInUser) {
        router.push('/challenges');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
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
        Retour
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
            Entre ton email eXalt pour continuer
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="prenom.nom@exalt.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-accent-cyan"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-jaune hover:bg-accent-jaune/80 text-black font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Continuer'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Pas besoin de mot de passe.<br />
            Si c&apos;est ta première fois, ton compte sera créé automatiquement.
          </p>
        </CardContent>
      </Card>

      {/* Tagline */}
      <p className="relative mt-8 text-sm text-muted-foreground">
        DON&apos;T JUST DO IT! TEACH IT!
      </p>
    </div>
  );
}
