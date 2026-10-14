"use client";

import { InfiniteScrollTrigger } from "@/components/ui/infinite-scroll-trigger";
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
import { usePaginatedTransactions } from "@/features/transactions/hooks/use-paginated-transactions";
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters";
import { useMoney } from "@/providers/money-provider";

export default function TransactionsPage() {
  const { allTransactions, state } = useMoney();
  const filters = useTransactionFilters();
  const { filtered } = useFilteredTransactions(allTransactions, filters);

  const { groupedByDate, hasMore, loadMore } = usePaginatedTransactions(
    filtered,
    10,
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 sm:pb-36">
      <section className="rounded-[28px] sm:rounded-[32px] border-3 sm:border-4 border-[#0f172a] bg-white p-3.5 sm:p-4 shadow-neo">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill
              label="All"
              active={filters.quickPreset === "all"}
              onClick={() => filters.setQuickRange("all")}
            />
            <FilterPill
              label="Today"
              active={filters.quickPreset === "today"}
              onClick={() => filters.setQuickRange("today")}
            />
            <FilterPill
              label="Week"
              active={filters.quickPreset === "week"}
              onClick={() => filters.setQuickRange("week")}
            />
            <FilterPill
              label="Month"
              active={filters.quickPreset === "month"}
              onClick={() => filters.setQuickRange("month")}
            />
          </div>

          <FilterToggle
            isOpen={filters.showFilters}
            onToggle={() => filters.setShowFilters((prev) => !prev)}
          />
        </div>

        {filters.showFilters && (
          <div
            id="transaction-filters"
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
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
              <FilterPill
                label="Transfer"
                active={filters.typeFilter === "transfer"}
                onClick={() => filters.setTypeFilter("transfer")}
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

      <div className="flex flex-col gap-4">
        <TransactionList
          groupedByDate={groupedByDate}
          isEmpty={filtered.length === 0}
        />

        {hasMore && <InfiniteScrollTrigger onIntersect={loadMore} />}
      </div>
    </div>
  );
}
