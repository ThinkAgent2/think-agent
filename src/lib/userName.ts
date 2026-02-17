const EXALT_EMAIL_DOMAINS = new Set(['exalt-company.com', 'exalt.fr']);

const LOCAL_PART_SPLIT_REGEX = /[._-]+/g;
const LEADING_DIGITS_REGEX = /^\d+/;

export function formatNameFromEmail(email?: string | null): string | null {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase();
  const [localPart, domain] = normalizedEmail.split('@');
  if (!localPart || !domain) return null;

  if (EXALT_EMAIL_DOMAINS.has(domain)) {
    const parts = localPart.split('.').filter(Boolean);
    if (parts.length === 0) return null;

    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  const firstToken = localPart.split(LOCAL_PART_SPLIT_REGEX).find(Boolean);
  if (!firstToken) return null;

  const cleanedToken = firstToken.replace(LEADING_DIGITS_REGEX, '').trim();
  return cleanedToken || null;
}
