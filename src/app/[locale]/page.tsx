'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Brain, Rocket, Crown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-exalt-blue/20 via-background to-accent-rose/10" />
          
          <div className="container relative mx-auto px-4 text-center">
            <Badge className="mb-6 bg-accent-cyan/20 text-accent-cyan border-accent-cyan">
              {t('badge')}
            </Badge>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-black tracking-tight">
              <span className="text-exalt-blue">{t('title1')}</span>{' '}
              <span className="text-accent-rose">{t('title2')}</span>
            </h1>
            
            <p className="mb-4 text-2xl md:text-3xl font-bold text-accent-jaune">
              {t('tagline')}
            </p>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              {t('subtitle')}
              <br />
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/challenges">
                <Button size="lg" className="bg-accent-jaune hover:bg-accent-jaune/80 text-black font-bold text-lg px-8 py-6">
                  {t('discoverChallenges')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black font-bold text-lg px-8 py-6">
                  {useTranslations('nav')('login')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Niveaux Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl md:text-4xl font-bold">
              {t('levels.title')}
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Explorer */}
              <div className="group rounded-2xl border border-accent-vert/30 bg-card p-8 transition-all hover:border-accent-vert hover:glow-vert">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent-vert/20">
                  <Brain className="h-8 w-8 text-accent-vert" />
                </div>
                <Badge className="mb-4 bg-accent-vert text-black">{t('levels.explorer.name')}</Badge>
                <p className="mb-4 text-lg italic text-muted-foreground">
                  {t('levels.explorer.quote')}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(t.raw('levels.explorer.skills') as string[]).map((skill, i) => (
                    <li key={i}>• {skill}</li>
                  ))}
                </ul>
              </div>

              {/* Crafter */}
              <div className="group rounded-2xl border border-exalt-blue/30 bg-card p-8 transition-all hover:border-exalt-blue hover:glow-blue">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-exalt-blue/20">
                  <Rocket className="h-8 w-8 text-exalt-blue" />
                </div>
                <Badge className="mb-4 bg-exalt-blue text-white">{t('levels.crafter.name')}</Badge>
                <p className="mb-4 text-lg italic text-muted-foreground">
                  {t('levels.crafter.quote')}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(t.raw('levels.crafter.skills') as string[]).map((skill, i) => (
                    <li key={i}>• {skill}</li>
                  ))}
                </ul>
              </div>

              {/* Architecte */}
              <div className="group rounded-2xl border border-accent-rose/30 bg-card p-8 transition-all hover:border-accent-rose hover:glow-rose">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent-rose/20">
                  <Crown className="h-8 w-8 text-accent-rose" />
                </div>
                <Badge className="mb-4 bg-accent-rose text-white">{t('levels.architect.name')}</Badge>
                <p className="mb-4 text-lg italic text-muted-foreground">
                  {t('levels.architect.quote')}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(t.raw('levels.architect.skills') as string[]).map((skill, i) => (
                    <li key={i}>• {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-jaune/10 px-6 py-2 text-accent-jaune mb-8">
              <Zap className="h-5 w-5" />
              <span className="font-medium">{t('cta.badge')}</span>
            </div>
            
            <h2 className="mb-6 text-3xl md:text-4xl font-bold">
              {t('cta.title')} <span className="text-exalt-blue">{t('cta.highlight')}</span>.
            </h2>
            
            <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
              {t('cta.description')}
            </p>

            <Link href="/challenges">
              <Button size="lg" className="bg-exalt-blue hover:bg-exalt-blue/80 text-white font-bold text-lg px-10 py-6">
                {t('cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
