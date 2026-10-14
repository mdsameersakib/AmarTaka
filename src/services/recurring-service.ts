import { formatLocalYMD } from "@/lib/date";
import type {
  MoneyState,
  RecurringFrequency,
  RecurringPayment,
} from "@/types/money";

function computeNextDueDate(
  frequency: RecurringFrequency,
  dueDay: number,
  from: Date,
  isAdvance = false,
): string {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);

  if (frequency === "monthly") {
    const candidate = new Date(d.getFullYear(), d.getMonth(), dueDay);
    candidate.setHours(0, 0, 0, 0);
    if (isAdvance ? candidate <= d : candidate < d) {
      candidate.setMonth(candidate.getMonth() + 1);
    }
    return formatLocalYMD(candidate);
  }
  if (frequency === "yearly") {
    const candidate = new Date(d.getFullYear(), d.getMonth(), dueDay);
    candidate.setHours(0, 0, 0, 0);
    if (isAdvance ? candidate <= d : candidate < d) {
      candidate.setFullYear(candidate.getFullYear() + 1);
    }
    return formatLocalYMD(candidate);
  }
  // weekly: dueDay = 0 (Sun) ... 6 (Sat)
  let diff = (dueDay - d.getDay() + 7) % 7;
  if (isAdvance && diff === 0) diff = 7;
  const next = new Date(d);
  next.setDate(d.getDate() + diff);
  return formatLocalYMD(next);
}

export const RecurringService = {
  add: (
    state: MoneyState,
    input: Omit<RecurringPayment, "id" | "nextDueDate">,
  ): MoneyState => {
    const nextDueDate = computeNextDueDate(
      input.frequency,
      input.dueDay,
      input.lastPaidDate ? new Date(input.lastPaidDate) : new Date(),
      Boolean(input.lastPaidDate),
    );
    const item: RecurringPayment = {
      ...input,
      id: Date.now(),
      nextDueDate,
    };
    return { ...state, recurring: [item, ...state.recurring] };
  },

  delete: (state: MoneyState, id: number): MoneyState => ({
    ...state,
    recurring: state.recurring.filter((r) => r.id !== id),
  }),

  update: (
    state: MoneyState,
    id: number,
    patch: Partial<Omit<RecurringPayment, "id">>,
  ): MoneyState => ({
    ...state,
    recurring: state.recurring.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, ...patch };
      updated.nextDueDate = computeNextDueDate(
        updated.frequency,
        updated.dueDay,
        updated.lastPaidDate ? new Date(updated.lastPaidDate) : new Date(),
        Boolean(updated.lastPaidDate),
      );
      return updated;
    }),
  }),

  pay: (state: MoneyState, id: number): MoneyState => {
    const item = state.recurring.find((r) => r.id === id);
    if (!item) return state;

    const today = formatLocalYMD();

    // create a transaction
    const newTx = {
      id: Date.now(),
      type: item.type,
      amount: item.amount,
      wallet: item.walletName,
      category: item.category,
      date: today,
      note: `Recurring: ${item.name}`,
    };

    const nextDueDate = computeNextDueDate(
      item.frequency,
      item.dueDay,
      new Date(),
      true,
    );

    return {
      ...state,
      transactions: [newTx, ...state.transactions],
      recurring: state.recurring.map((r) =>
        r.id === id ? { ...r, lastPaidDate: today, nextDueDate } : r,
      ),
    };
  },

  getOverdue: (recurring: RecurringPayment[]): RecurringPayment[] => {
    const today = formatLocalYMD();
    return recurring.filter((r) => r.nextDueDate <= today);
  },

  getDueSoon: (recurring: RecurringPayment[], days = 5): RecurringPayment[] => {
    const today = new Date();
    const soon = new Date();
    soon.setDate(today.getDate() + days);
    const soonStr = formatLocalYMD(soon);
    const todayStr = formatLocalYMD(today);
    return recurring.filter(
      (r) => r.nextDueDate > todayStr && r.nextDueDate <= soonStr,
    );
  },
};
