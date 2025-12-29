import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";

type WalletCardProps = {
  name: string;
  balance: number;
};

export function WalletCard({ name, balance }: WalletCardProps) {
  const { showCents } = useMoney();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const amountRef = useRef<HTMLParagraphElement | null>(null);
  const [needsFullRow, setNeedsFullRow] = useState(false);

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

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]",
        needsFullRow && "col-span-2 sm:col-span-1",
      )}
    >
      <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
        {name}
      </p>
      <p
        ref={amountRef}
        className="text-2xl font-black text-[#0f172a] dark:text-white"
      >
        {formatCurrency(balance, showCents)}
      </p>
    </div>
  );
}
