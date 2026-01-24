"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MoneyHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-[#0f172a] bg-[#c7f9cc]/95 backdrop-blur-sm shadow-neo/90 rounded-b-[32px]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-5 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#0f172a] ">Amar Taka</h1>
        </div>

        <nav className="grid grid-cols-3 gap-2 rounded-3xl border-4 border-[#0f172a] bg-white p-1 shadow-neo-sm">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border-2 border-transparent px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                  isActive
                    ? "border-[#0f172a] bg-[#a3e635] text-[#0f172a]"
                    : "text-[#0f172a]/60 hover:bg-[#d7f7d0]/70",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
