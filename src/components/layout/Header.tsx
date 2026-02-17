'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { LanguageSwitcher } from './LanguageSwitcher';

const levelColors: Record<string, string> = {
  Explorer: 'bg-accent-vert text-black',
  Crafter: 'bg-exalt-blue text-white',
  Architecte: 'bg-accent-rose text-white',
};

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const t = useTranslations('nav');

  const navItems = [
    { href: '/challenges', label: t('challenges'), icon: Zap },
    { href: '/ideas', label: t('ideas'), icon: Zap },
    { href: '/events', label: t('events'), icon: Calendar },
    { href: '/me', label: t('myPage'), icon: User },
  ];

  const adminItems = [
    { href: '/admin/validation', label: t('validation'), icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Language Switcher + Logo */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-exalt-blue">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">THINK AGENT</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-cyan ${
                  isActive ? 'text-accent-cyan' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {user?.role === 'Administrateur' &&
            adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-cyan ${
                    isActive ? 'text-accent-cyan' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* User section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <Badge className={levelColors[user.niveau_actuel] || levelColors.Explorer}>
                  {user.niveau_actuel}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {user.points_totaux} XP
                </span>
              </div>
              <Link href="/me">
                <Avatar className="h-8 w-8 cursor-pointer transition-glow hover:glow-cyan">
                  <AvatarFallback className="bg-exalt-blue text-white text-xs">
                    {user.nom?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-accent-rose"
                title={t('logout')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black">
                {t('login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
