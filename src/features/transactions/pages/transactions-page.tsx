"use client";

import {
  FilterPill,
  FilterSummary,
  SearchFilter,
  SelectField,
} from "@/features/transactions/components/filters";
import { DateFilter } from "@/features/transactions/components/filters/date-filter";
import { FilterToggle } from "@/features/transactions/components/filters/filter-toggle";
import { TransactionList } from "@/features/transactions/components/list/transaction-list";
import { useFilteredTransactions } from "@/features/transactions/hooks/use-filtered-transactions";
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters";
import { useMoney } from "@/providers/money-provider";

export default function TransactionsPage() {
  const { allTransactions, state } = useMoney();
  const filters = useTransactionFilters();
  const { groupedByDate, filtered } = useFilteredTransactions(
    allTransactions,
    filters,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-4 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <FilterToggle
          isOpen={filters.showFilters}
          onToggle={() => filters.setShowFilters((prev) => !prev)}
        />

        {filters.showFilters && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DateFilter
              dateMode={filters.dateMode}
              setDateMode={filters.setDateMode}
              singleDate={filters.singleDate}
              setSingleDate={filters.setSingleDate}
              rangeFrom={filters.rangeFrom}
              setRangeFrom={filters.setRangeFrom}
              rangeTo={filters.rangeTo}
              setRangeTo={filters.setRangeTo}
            />

            <SearchFilter
              search={filters.searchNote}
              onSearchChange={filters.setSearchNote}
              resultsCount={filtered.length}
            />

            <FilterSummary>
              <FilterPill
                label="All"
                active={filters.typeFilter === "all"}
                onClick={() => filters.setTypeFilter("all")}
              />
              <FilterPill
                label="Income"
                active={filters.typeFilter === "income"}
                onClick={() => filters.setTypeFilter("income")}
              />
              <FilterPill
                label="Expense"
                active={filters.typeFilter === "expense"}
                onClick={() => filters.setTypeFilter("expense")}
              />
            </FilterSummary>

            <SelectField
              label="Wallet"
              value={filters.walletFilter}
              onChange={filters.setWalletFilter}
              options={["all", ...state.wallets]}
            />
            <SelectField
              label="Category"
              value={filters.categoryFilter}
              onChange={filters.setCategoryFilter}
              options={["all", ...state.categories]}
            />
          </div>
        )}
      </section>

      <TransactionList
        groupedByDate={groupedByDate}
        isEmpty={filtered.length === 0}
      />
    </div>
  );
}
