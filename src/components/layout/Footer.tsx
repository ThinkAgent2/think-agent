export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">THINK AGENT</span>
            <span className="text-muted-foreground text-sm">by eXalt</span>
          </div>
          <p className="text-sm text-muted-foreground">
            DON&apos;T JUST DO IT! TEACH IT!
          </p>
        </div>
      </div>
    </footer>
  );
}
