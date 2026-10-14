import { MoneyHeader } from "@/components/layout/money-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--accent-subtle)] pb-16 transition-colors duration-300">
      <MoneyHeader />
      <main className="mx-auto w-full max-w-5xl px-3 sm:px-6 md:px-8 pb-10 pt-4 sm:pt-8">
        {children}
      </main>
    </div>
  );
}
