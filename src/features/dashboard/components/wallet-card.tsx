"use client";

import { useEffect, useRef, useState } from "react";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { cn } from "@/lib/utils";

type WalletCardProps = {
  name: string;
  balance: number;
  onLongPress?: () => void;
};

export function WalletCard({ name, balance, onLongPress }: WalletCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const amountRef = useRef<HTMLParagraphElement | null>(null);
  const [needsFullRow, setNeedsFullRow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startCoords = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const amountEl = amountRef.current;
      const containerEl = containerRef.current;

      if (!amountEl || !containerEl) return;

      const isOverflowing = amountEl.scrollWidth > containerEl.clientWidth;
      setNeedsFullRow(isOverflowing);
    };

    checkOverflow();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => checkOverflow());
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
        observer.disconnect();
      };
    }
  }, []);

  const clearLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startCoords.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    startCoords.current = { x: e.clientX, y: e.clientY };
    clearLongPress();
    timerRef.current = setTimeout(() => {
      if (onLongPress) onLongPress();
      clearLongPress();
    }, 500); // 500ms standard long-press
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startCoords.current) return;
    const dx = Math.abs(e.clientX - startCoords.current.x);
    const dy = Math.abs(e.clientY - startCoords.current.y);
    // If finger moves more than 10px, it's a scroll or gesture, cancel long press
    if (dx > 10 || dy > 10) {
      clearLongPress();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Long-press gesture container
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      onPointerCancel={clearLongPress}
      onContextMenu={(e) => {
        // Prevent default browser context menu when long-pressing
        e.preventDefault();
      }}
      className={cn(
        "rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2.5 sm:px-4 sm:py-3 shadow-neo-sm transition active:scale-95 cursor-pointer select-none text-left min-w-0",
        needsFullRow && "col-span-2 sm:col-span-1",
      )}
    >
      <p className="text-xs sm:text-sm font-bold uppercase text-[var(--accent-text-dark)] truncate">
        {name}
      </p>
      <p
        ref={amountRef}
        className="text-lg xs:text-xl sm:text-2xl font-black text-[var(--foreground)] truncate mt-0.5"
      >
        <MaskedAmount amount={balance} />
      </p>
    </div>
  );
}
