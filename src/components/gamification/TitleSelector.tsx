'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface TitleSelectorProps {
  titles: string[];
  selectedTitle: string | null;
  onChange: (title: string | null) => void;
  isSaving?: boolean;
}

export function TitleSelector({ titles, selectedTitle, onChange, isSaving = false }: TitleSelectorProps) {
  const t = useTranslations('profile');

  return (
    <div>
      <p className="text-sm font-medium">{t('selectTitle')}</p>
      <p className="text-xs text-muted-foreground mb-2">{t('selectTitleHint')}</p>
      <div className="flex flex-wrap gap-2">
        {titles.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          titles.map((title) => (
            <Button
              key={title}
              size="sm"
              variant={selectedTitle === title ? 'default' : 'outline'}
              onClick={() => onChange(title)}
              disabled={isSaving}
            >
              {title}
            </Button>
          ))
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onChange(null)}
          disabled={isSaving}
        >
          {t('clearTitle')}
        </Button>
      </div>
    </div>
  );
}
