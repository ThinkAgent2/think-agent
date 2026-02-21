'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { Badge } from '@/types/database';
import { updateUser } from '@/lib/supabase/queries';

interface BadgeSelectorProps {
  userId: string;
  badges: Badge[];
  primaryId?: string | null;
  secondaryId?: string | null;
  onChange?: (primary: string | null, secondary: string | null) => void;
}

export function BadgeSelector({ userId, badges, primaryId, secondaryId, onChange }: BadgeSelectorProps) {
  const t = useTranslations('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (badgeId: string) => {
    if (isSaving) return;
    const isPrimary = primaryId === badgeId;
    const isSecondary = secondaryId === badgeId;

    let nextPrimary = primaryId || null;
    let nextSecondary = secondaryId || null;

    if (!isPrimary && !isSecondary) {
      if (!nextPrimary) {
        nextPrimary = badgeId;
      } else if (!nextSecondary) {
        nextSecondary = badgeId;
      } else {
        nextPrimary = badgeId;
        nextSecondary = null;
      }
    } else if (isPrimary) {
      nextPrimary = null;
    } else if (isSecondary) {
      nextSecondary = null;
    }

    setIsSaving(true);
    const updated = await updateUser(userId, {
      selected_badge_primary: nextPrimary,
      selected_badge_secondary: nextSecondary,
    });
    setIsSaving(false);

    if (updated) {
      onChange?.(nextPrimary, nextSecondary);
    }
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">{t('badgeSelect')}</p>
      <p className="text-xs text-muted-foreground mb-3">{t('badgeSelectHint')}</p>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => {
          const isPrimary = primaryId === badge.id;
          const isSecondary = secondaryId === badge.id;
          return (
            <Button
              key={badge.id}
              size="sm"
              variant={isPrimary || isSecondary ? 'default' : 'outline'}
              onClick={() => handleToggle(badge.id)}
              disabled={isSaving}
            >
              {badge.icon || badge.emoji} {badge.nom}
              {isPrimary && <span className="ml-1 text-[10px]">(1)</span>}
              {isSecondary && <span className="ml-1 text-[10px]">(2)</span>}
            </Button>
          );
        })}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="mt-2"
        onClick={async () => {
          if (isSaving) return;
          setIsSaving(true);
          const updated = await updateUser(userId, { selected_badge_primary: null, selected_badge_secondary: null });
          setIsSaving(false);
          if (updated) {
            onChange?.(null, null);
          }
        }}
        disabled={isSaving}
      >
        {t('clearBadge')}
      </Button>
    </div>
  );
}
