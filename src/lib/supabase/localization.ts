import type { Challenge, Badge as BadgeType, DojoEvent } from '@/types/database';

/**
 * Gets a localized field from an object.
 * For 'en' locale, tries to get the _en suffixed field, falls back to French.
 * For 'fr' locale (or default), returns the base field.
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: string
): string | null {
  if (locale === 'en') {
    const enField = `${field}_en` as keyof T;
    const enValue = obj[enField] as string | null;
    if (enValue) return enValue;
  }
  // Fall back to French (base field)
  return (obj[field as keyof T] as string | null) || null;
}

/**
 * Localizes a challenge object by replacing fields with their localized versions.
 */
export function localizeChallenge(challenge: Challenge, locale: string): Challenge {
  if (locale !== 'en') return challenge;
  
  return {
    ...challenge,
    titre: getLocalizedField(challenge as unknown as Record<string, unknown>, 'titre', locale) || challenge.titre,
    description: getLocalizedField(challenge as unknown as Record<string, unknown>, 'description', locale) || challenge.description,
    criteres_evaluation: getLocalizedField(challenge as unknown as Record<string, unknown>, 'criteres_evaluation', locale) || challenge.criteres_evaluation,
    vision_impact: getLocalizedField(challenge as unknown as Record<string, unknown>, 'vision_impact', locale) || challenge.vision_impact,
    le_saviez_vous: getLocalizedField(challenge as unknown as Record<string, unknown>, 'le_saviez_vous', locale) || challenge.le_saviez_vous,
  };
}

/**
 * Localizes a badge object.
 */
export function localizeBadge(badge: BadgeType, locale: string): BadgeType {
  if (locale !== 'en') return badge;
  
  return {
    ...badge,
    nom: getLocalizedField(badge as unknown as Record<string, unknown>, 'nom', locale) || badge.nom,
    description: getLocalizedField(badge as unknown as Record<string, unknown>, 'description', locale) || badge.description,
  };
}

/**
 * Localizes a dojo event object.
 */
export function localizeDojoEvent(event: DojoEvent, locale: string): DojoEvent {
  if (locale !== 'en') return event;
  
  return {
    ...event,
    titre: getLocalizedField(event as unknown as Record<string, unknown>, 'titre', locale) || event.titre,
    description: getLocalizedField(event as unknown as Record<string, unknown>, 'description', locale) || event.description,
  };
}
