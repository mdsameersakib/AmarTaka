import { useState } from "react";
import type { TransactionType } from "@/types/money";

export type DateMode = "single" | "range";
export type FilterType = "all" | TransactionType;

export function useTransactionFilters() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("single");
  const [singleDate, setSingleDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [rangeFrom, setRangeFrom] = useState<string>("");
  const [rangeTo, setRangeTo] = useState<string>("");

  const [searchNote, setSearchNote] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [walletFilter, setWalletFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  return {
    showFilters,
    setShowFilters,
    dateMode,
    setDateMode,
    singleDate,
    setSingleDate,
    rangeFrom,
    setRangeFrom,
    rangeTo,
    setRangeTo,
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
