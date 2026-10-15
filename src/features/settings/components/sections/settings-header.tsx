export function SettingsHeader() {
  return (
    <header className="rounded-[32px] border-4 border-[var(--border)] bg-white p-6 shadow-neo">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--foreground)]">
        Control Center
      </p>
      <h1 className="text-3xl font-black text-[var(--foreground)] ">Settings & Data</h1>
      <p className="mt-3 text-sm text-[var(--foreground)]">
        Tune the Amar Taka data model, add new wallets or categories, and reset
        demos once you are ready to sync with a backend later.
      </p>
    </header>
  );
}
