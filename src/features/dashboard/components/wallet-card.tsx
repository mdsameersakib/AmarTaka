import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";

type WalletCardProps = {
  name: string;
  balance: number;
  onLongPress?: () => void;
};

export function WalletCard({ name, balance, onLongPress }: WalletCardProps) {
  const { showCents } = useMoney();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const amountRef = useRef<HTMLParagraphElement | null>(null);
  const [needsFullRow, setNeedsFullRow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

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

    return;
  }, []);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      if (onLongPress) onLongPress();
    }, 800);
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={cn(
        "rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm transition active:scale-95 cursor-pointer select-none",
        needsFullRow && "col-span-2 sm:col-span-1",
      )}
    >
      <p className="text-sm font-semibold uppercase text-[#14532d]">{name}</p>
      <p ref={amountRef} className="text-2xl font-black text-[#0f172a] ">
        {formatCurrency(balance, showCents)}
      </p>
    </div>
  );
}
