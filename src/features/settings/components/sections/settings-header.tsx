export function SettingsHeader() {
  return (
    <header className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f172a]/50 dark:text-[#86efac]/80">
        Control Center
      </p>
      <h1 className="text-3xl font-black text-[#0f172a] dark:text-white">
        Settings & Data
      </h1>
      <p className="mt-3 text-sm text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
        Tune the Amar Taka data model, add new wallets or categories, and reset
        demos once you are ready to sync with a backend later.
      </p>
    </header>
  );
}
