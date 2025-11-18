import { MoneyHeader } from "@/components/layout/money-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0fdf4] px-4 py-6 dark:bg-[#020617] md:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[40px] border-4 border-[#0f172a] bg-white shadow-neo-lg dark:border-[#4ade80] dark:bg-[#020617]">
        <MoneyHeader />
        <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
