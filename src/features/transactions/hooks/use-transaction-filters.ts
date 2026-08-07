import { useState } from "react";
import type { TransactionType } from "@/types/money";

export type DateMode = "all" | "single" | "range";
export type FilterType = "all" | TransactionType;
export type QuickPreset = "all" | "today" | "week" | "month" | "custom";

const formatYMD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function useTransactionFilters() {
  const [showFilters, setShowFilters] = useState(false);
  const [quickPreset, setQuickPreset] = useState<QuickPreset>("all");
  const [dateMode, setDateMode] = useState<DateMode>("all");
  const [singleDate, setSingleDate] = useState<string>(formatYMD(new Date()));
  const [rangeFrom, setRangeFrom] = useState<string>("");
  const [rangeTo, setRangeTo] = useState<string>("");

  const [searchNote, setSearchNote] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [walletFilter, setWalletFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const setQuickRange = (preset: QuickPreset) => {
    setQuickPreset(preset);
    const now = new Date();

    if (preset === "all") {
      setDateMode("all");
      setSingleDate(formatYMD(now));
      setRangeFrom("");
      setRangeTo("");
    } else if (preset === "today") {
      setDateMode("single");
      setSingleDate(formatYMD(now));
    } else if (preset === "week") {
      const dayOfWeek = now.getDay();
      const diffToMonday = (dayOfWeek + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);

      setDateMode("range");
      setRangeFrom(formatYMD(monday));
      setRangeTo(formatYMD(now));
    } else if (preset === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setDateMode("range");
      setRangeFrom(formatYMD(firstDay));
      setRangeTo(formatYMD(now));
    }
  };

  const handleSetDateMode = (mode: DateMode) => {
    setQuickPreset("custom");
    setDateMode(mode);
  };

  const handleSetSingleDate = (date: string) => {
    setQuickPreset("custom");
    setSingleDate(date);
  };

  const handleSetRangeFrom = (date: string) => {
    setQuickPreset("custom");
    setRangeFrom(date);
  };

  const handleSetRangeTo = (date: string) => {
    setQuickPreset("custom");
    setRangeTo(date);
  };

  return {
    showFilters,
    setShowFilters,
    quickPreset,
    setQuickRange,
    dateMode,
    setDateMode: handleSetDateMode,
    singleDate,
    setSingleDate: handleSetSingleDate,
    rangeFrom,
    setRangeFrom: handleSetRangeFrom,
    rangeTo,
    setRangeTo: handleSetRangeTo,
    searchNote,
    setSearchNote,
    typeFilter,
    setTypeFilter,
    walletFilter,
    setWalletFilter,
    categoryFilter,
    setCategoryFilter,
  };
}
