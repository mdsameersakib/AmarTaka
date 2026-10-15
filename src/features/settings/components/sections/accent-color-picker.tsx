"use client";

import { THEME_PALETTES } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";

export function AccentColorPicker() {
  const { accentColor, setAccentColor } = useMoney();

  const palettes = Object.values(THEME_PALETTES);
  const selectedTheme = palettes.find(
    (c) =>
      c.hex.toLowerCase() === accentColor.toLowerCase() ||
      c.key === accentColor.toLowerCase(),
  );

  return (
    <div className="rounded-[32px] border-4 border-[var(--border)] bg-white p-6 shadow-neo">
      <h2 className="text-xl font-black text-[var(--foreground)]">Accent Color</h2>
      <p className="mt-1 text-xs text-[var(--foreground)]">
        Choose your app&apos;s theme. All background shades, tabs, buttons, and
        cards adapt automatically.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {palettes.map((theme) => {
          const isSelected = selectedTheme?.key === theme.key;
          return (
            <button
              key={theme.key}
              type="button"
              title={theme.name}
              onClick={() => setAccentColor(theme.hex)}
              className={cn(
                "h-10 w-10 rounded-full border-4 transition-transform hover:scale-110",
                isSelected
                  ? "border-[var(--border)] dark:border-white scale-110 shadow-neo-sm"
                  : "border-transparent",
              )}
              style={{ backgroundColor: theme.primary }}
              aria-label={theme.name}
              aria-pressed={isSelected}
            />
          );
        })}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase text-[var(--foreground)]">
        Selected: {selectedTheme?.name ?? "Custom"}
      </p>
    </div>
  );
}
