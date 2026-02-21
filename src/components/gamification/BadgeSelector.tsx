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

  const handleSelect = async (badgeId: string, slot: 'primary' | 'secondary') => {
    setIsSaving(true);
    const updates = slot === 'primary'
      ? { selected_badge_primary: badgeId }
      : { selected_badge_secondary: badgeId };
    const updated = await updateUser(userId, updates);
    setIsSaving(false);
    if (updated) {
      onChange?.(
        slot === 'primary' ? badgeId : primaryId || null,
        slot === 'secondary' ? badgeId : secondaryId || null
      );
    }
  };

  const handleClear = async (slot: 'primary' | 'secondary') => {
    setIsSaving(true);
    const updates = slot === 'primary'
      ? { selected_badge_primary: null }
      : { selected_badge_secondary: null };
    const updated = await updateUser(userId, updates);
    setIsSaving(false);
    if (updated) {
      onChange?.(
        slot === 'primary' ? null : primaryId || null,
        slot === 'secondary' ? null : secondaryId || null
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">{t('badgePrimary')}</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Button
              key={badge.id}
              size="sm"
              variant={primaryId === badge.id ? 'default' : 'outline'}
              onClick={() => handleSelect(badge.id, 'primary')}
              disabled={isSaving}
            >
              {badge.icon || badge.emoji} {badge.nom}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => handleClear('primary')}>
            {t('clearBadge')}
          </Button>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">{t('badgeSecondary')}</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Button
              key={badge.id}
              size="sm"
              variant={secondaryId === badge.id ? 'default' : 'outline'}
              onClick={() => handleSelect(badge.id, 'secondary')}
              disabled={isSaving}
            >
              {badge.icon || badge.emoji} {badge.nom}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => handleClear('secondary')}>
            {t('clearBadge')}
          </Button>
        </div>
      </div>
    </div>
  );
}
