'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Locale, locales } from '@/i18n/config';

const FLAGS: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`p-1 text-lg transition-opacity hover:opacity-100 ${
            locale === l ? 'opacity-100' : 'opacity-50'
          }`}
          aria-label={l === 'fr' ? 'Français' : 'English'}
          title={l === 'fr' ? 'Français' : 'English'}
        >
          {FLAGS[l]}
        </button>
      ))}
    </div>
  );
}
