import type { Transaction } from "@/types/money";
import { EmptyState } from "./empty-state";
import { TransactionItem } from "./transaction-item";

type TransactionListProps = {
  groupedByDate: { date: string; items: Transaction[] }[];
  isEmpty: boolean;
};

export function TransactionList({
  groupedByDate,
  isEmpty,
}: TransactionListProps) {
  if (isEmpty) {
    return (
      <div className="space-y-3">
        <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
      <div className="space-y-3">
        {groupedByDate.map((group) =>
          group.items.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          )),
        )}
      </div>
    </section>
  );
}
