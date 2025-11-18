import { MoneyHeader } from "@/components/layout/money-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0fdf4] pb-16 dark:bg-[#020617]">
      <MoneyHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
