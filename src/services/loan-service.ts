import { formatLocalYMD } from "@/lib/date";
import type { Loan, MoneyState } from "@/types/money";

export function calculateMonthlyEmi(
  principal: number,
  interestRate: number,
  durationMonths: number,
): number {
  if (!principal || durationMonths <= 0) return 0;
  if (interestRate > 0) {
    const total =
      principal * (1 + (interestRate / 100) * (durationMonths / 12));
    return Math.round(total / durationMonths);
  }
  return Math.round(principal / durationMonths);
}

export function computeNextLoanDueDate(
  startDate: string,
  durationMonths: number,
): string {
  if (!startDate) return formatLocalYMD();
  const parts = startDate.split("-").map(Number);
  const startY = parts[0] || new Date().getFullYear();
  const startM = parts[1] || 1;
  const startD = parts[2] || 1;

  const now = new Date();
  const currentY = now.getFullYear();
  const currentM = now.getMonth() + 1;
  const currentD = now.getDate();

  let targetY = currentY;
  let targetM = currentM;
  if (currentD > startD) {
    targetM += 1;
    if (targetM > 12) {
      targetM = 1;
      targetY += 1;
    }
  }

  const totalMonths = startM - 1 + durationMonths;
  const endY = startY + Math.floor(totalMonths / 12);
  const endM = (totalMonths % 12) + 1;

  const pad = (n: number) => String(n).padStart(2, "0");
  const targetStr = `${targetY}-${pad(targetM)}-${pad(startD)}`;
  const endStr = `${endY}-${pad(endM)}-${pad(startD)}`;

  return targetStr > endStr ? endStr : targetStr;
}

export const LoanService = {
  add: (state: MoneyState, input: Omit<Loan, "id">): MoneyState => {
    const durationMonths = input.durationMonths || 12;
    const startDate = input.startDate || formatLocalYMD();
    const dueDate =
      input.dueDate || computeNextLoanDueDate(startDate, durationMonths);
    const emiAmount =
      input.emiAmount ||
      calculateMonthlyEmi(input.principal, input.interestRate, durationMonths);
    const loan: Loan = {
      ...input,
      durationMonths,
      startDate,
      dueDate,
      emiAmount,
      id: Date.now(),
    };
    return { ...state, loans: [loan, ...state.loans] };
  },

  delete: (state: MoneyState, id: number): MoneyState => ({
    ...state,
    loans: state.loans.filter((l) => l.id !== id),
  }),

  pay: (state: MoneyState, loanId: number, payAmount: number): MoneyState => {
    const loan = state.loans.find((l) => l.id === loanId);
    if (!loan) return state;

    const today = formatLocalYMD();
    const actualPay = Math.min(payAmount, loan.remaining);

    // If you borrowed, repayment is an expense. If you lent, repayment is an income entering your wallet.
    const isBorrowed = loan.direction === "borrowed";
    const txType = isBorrowed ? ("expense" as const) : ("income" as const);
    const txNote = isBorrowed
      ? `Repayment to ${loan.lenderName}`
      : `Repayment received from ${loan.lenderName}`;

    const newTx = {
      id: Date.now(),
      type: txType,
      amount: actualPay,
      wallet: loan.walletName,
      category: isBorrowed ? "Loan Payment" : "Debt Recovery",
      date: today,
      note: txNote,
    };

    const newRemaining = Math.max(0, loan.remaining - actualPay);
    const nextDue = computeNextLoanDueDate(loan.startDate, loan.durationMonths);

    return {
      ...state,
      transactions: [newTx, ...state.transactions],
      loans: state.loans.map((l) =>
        l.id === loanId
          ? { ...l, remaining: newRemaining, dueDate: nextDue }
          : l,
      ),
    };
  },

  update: (
    state: MoneyState,
    id: number,
    patch: Partial<Omit<Loan, "id">>,
  ): MoneyState => ({
    ...state,
    loans: state.loans.map((l) => (l.id === id ? { ...l, ...patch } : l)),
  }),
};
