const LOCAL_PART_SPLIT_REGEX = /[._-]+/g;

export function formatNameFromEmail(email?: string | null): string | null {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase();
  const [localPart] = normalizedEmail.split('@');
  if (!localPart) return null;

  const parts = localPart.split(LOCAL_PART_SPLIT_REGEX).filter(Boolean);
  if (parts.length === 0) return null;

  if (parts.length === 1) {
    return parts[0];
  }

  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
