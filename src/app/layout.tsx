// This root layout exists only for static generation setup.
// All actual content is handled by src/app/[locale]/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
