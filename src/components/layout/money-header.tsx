"use client";

import { MoonStar, SunMedium } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MoneyHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-[#0f172a] bg-[#c7f9cc]/95 backdrop-blur-sm shadow-neo dark:border-[#4ade80] dark:bg-[#020617]/90 rounded-b-[32px]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-5 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#0f172a] dark:text-white">
            Amar Taka
          </h1>
          <ModeSwitch />
        </div>

        <nav className="grid grid-cols-3 gap-2 rounded-3xl border-4 border-[#0f172a] bg-white p-1 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#020617]">
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
                    ? "border-[#0f172a] bg-[#a3e635] text-[#0f172a] dark:border-[#4ade80]"
                    : "text-[#0f172a]/60 hover:bg-[#d7f7d0]/70 dark:text-[#86efac]/70",
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

function ModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-[#0f172a] bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#0f172a] shadow-neo-sm">
        Mode
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-[#0f172a] bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#0f172a] shadow-neo-sm transition hover:-translate-y-0.5 hover:bg-[#fefce8] dark:border-[#4ade80] dark:bg-[#020617] dark:text-[#4ade80]"
    >
      {theme === "dark" ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <MoonStar className="h-4 w-4" />
      )}
      Mode
    </button>
  );
}
