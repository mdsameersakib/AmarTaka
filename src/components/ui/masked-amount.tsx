"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";

interface MaskedAmountProps {
  amount: number;
  showCents?: boolean;
  currencySymbol?: string;
  className?: string;
  prefix?: string;
  as?: "span" | "p" | "div";
}

export function MaskedAmount({
  amount,
  showCents: propShowCents,
  currencySymbol: propCurrencySymbol,
  className,
  prefix = "",
  as: Component = "span",
}: MaskedAmountProps) {
  const {
    showCents: ctxShowCents,
    currencySymbol: ctxCurrencySymbol,
    balanceHidden,
  } = useMoney();

  const showCents = propShowCents ?? ctxShowCents;
  const currencySymbol = propCurrencySymbol ?? ctxCurrencySymbol;

  const [isPeeking, setIsPeeking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!balanceHidden) {
      setIsPeeking(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [balanceHidden]);

  const handleClick = (e: React.MouseEvent) => {
    if (!balanceHidden) return;
    e.stopPropagation();

    if (isPeeking) {
      setIsPeeking(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      setIsPeeking(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsPeeking(false);
      }, 3000);
    }
  };

  const isHidden = balanceHidden && !isPeeking;
  const formatted = formatCurrency(amount, showCents, currencySymbol);
  const displayText = isHidden
    ? `${currencySymbol}••••••`
    : `${prefix}${formatted}`;

  return (
    <Component
      onClick={handleClick}
      title={
        balanceHidden
          ? isPeeking
            ? "Click to hide"
            : "Click to peek for 3 seconds"
          : undefined
      }
      className={cn(
        className,
        balanceHidden &&
          "cursor-pointer select-none transition-all duration-150 active:scale-95",
        isHidden && "tracking-wider opacity-85",
        isPeeking &&
          "underline decoration-dashed decoration-2 underline-offset-4",
      )}
    >
      {displayText}
    </Component>
  );
}
