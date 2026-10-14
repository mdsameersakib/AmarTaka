"use client";

import { Eye, EyeOff, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";

export function MoneyHeader() {
  const pathname = usePathname();
  const { balanceHidden, toggleBalanceHidden, isDarkMode, toggleThemeMode } =
    useMoney();
  const isSettings =
    pathname === "/settings" || pathname?.startsWith("/settings/");

  return (
    <header className="sticky top-0 z-40 rounded-b-[28px] sm:rounded-b-[32px] border-b-4 border-[#0f172a] bg-[var(--accent-header)] backdrop-blur-md shadow-neo transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2.5 px-3 pb-3 pt-3.5 sm:gap-4 sm:px-8 sm:pb-5 sm:pt-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl xs:text-2xl sm:text-3xl font-black text-[#0f172a] hover:opacity-90 transition-opacity truncate"
          >
            Amar Taka
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Theme toggle icon button */}
            <button
              type="button"
              onClick={toggleThemeMode}
              className="btn-neo flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-[#0f172a] bg-white text-[#0f172a] shadow-neo-sm hover:bg-[var(--accent-soft)] active:scale-95 transition"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
              aria-label={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f172a]" />
              )}
            </button>

            {/* Privacy toggle icon button */}
            <button
              type="button"
              onClick={toggleBalanceHidden}
              className="btn-neo flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-[#0f172a] bg-white text-[#0f172a] shadow-neo-sm hover:bg-[var(--accent-soft)] active:scale-95 transition"
              title={
                balanceHidden
                  ? "Show all balances"
                  : "Hide all balances (Privacy Mode)"
              }
              aria-label={
                balanceHidden ? "Show all balances" : "Hide all balances"
              }
            >
              {balanceHidden ? (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            {/* Settings icon button */}
            <Link
              href="/settings"
              className={cn(
                "btn-neo flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-[#0f172a] shadow-neo-sm active:scale-95 transition",
                isSettings
                  ? "bg-[var(--accent-tab)] text-[var(--accent-tab-contrast)]"
                  : "bg-white text-[#0f172a] hover:bg-[var(--accent-soft)]",
              )}
              title="Settings & Data"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>

        {/* 2-tab navigation: Dashboard & Transactions */}
        <nav className="grid grid-cols-2 gap-1 rounded-2xl border-3 border-[#0f172a] bg-white p-1 sm:p-1.5 shadow-neo-sm">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 text-[11px] xs:text-xs sm:text-sm font-black uppercase tracking-tight sm:tracking-wide transition-all min-w-0 select-none whitespace-nowrap",
                  isActive
                    ? "border-2 border-[#0f172a] bg-[var(--accent-tab)] text-[var(--accent-tab-contrast)]"
                    : "border-2 border-transparent text-[#0f172a]/70 hover:text-[#0f172a] hover:bg-black/[0.04]",
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
