const EXALT_EMAIL_DOMAIN = 'exalt-company.com';

export function formatNameFromEmail(email?: string | null): string | null {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase();
  const [localPart, domain] = normalizedEmail.split('@');
  if (!localPart || domain !== EXALT_EMAIL_DOMAIN) return null;

  const parts = localPart.split('.').filter(Boolean);
  if (parts.length === 0) return null;

  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
