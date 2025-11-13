
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Moon, RefreshCw, Settings, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/config/navigation";
import { useRole } from "@/hooks";
import { cn } from "@/lib/utils";

export function AppSidebar() {


  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { role, cycleRole } = useRole();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const roleNavigation = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="border-b border-border/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={cycleRole}
              className="group cursor-pointer rounded-xl bg-primary/20 p-2 transition-all duration-200 hover:bg-primary/30"
              title={`Switch to next role`}
            >
              <RefreshCw className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="flex flex-col">
              <span className="text-foreground">Project Template</span>
              <span className="text-xs text-muted-foreground">
                {role.replace(/^role/, 'Role-')} view
              </span>
            </div>
          </div>
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl bg-accent/50 p-2 transition-all duration-200 hover:bg-accent"
              title={
                theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {roleNavigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account Section */}
      <div className="border-t border-border/50 p-4">
        <p className="mb-2 px-4 text-sm text-muted-foreground">Account</p>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-2xl px-4 py-3 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          >
            <User className="h-5 w-5" />
            Profile
          </Button>
          <Link
            href="/settings"
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-2xl px-4 py-3 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
