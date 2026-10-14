export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  wallet: string;
  category: string;
  date: string; // ISO date string
  note?: string;
  // transfer-specific
  toWallet?: string; // only when type === 'transfer'
  transferFee?: number; // optional fee
}

export type RecurringFrequency = "monthly" | "weekly" | "yearly";

export interface RecurringPayment {
  id: number;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  dueDay: number; // day of month (1-31) for monthly/yearly, day of week (0-6) for weekly
  walletName: string; // which wallet to deduct from
  category: string;
  type: TransactionType; // 'expense' for bills, 'income' for subscriptions received
  lastPaidDate: string | null; // ISO date
  nextDueDate: string; // computed ISO date
}

export interface Loan {
  id: number;
  lenderName: string; // who you borrowed from, or who owes you
  direction: "borrowed" | "lent"; // borrowed = you owe them; lent = they owe you
  principal: number;
  remaining: number;
  interestRate: number; // annual % (0 for interest-free)
  durationMonths: number; // loan tenure in months (e.g. 6, 12, 24)
  startDate: string; // ISO date when loan started (YYYY-MM-DD)
  emiAmount: number; // monthly installment amount
  dueDate: string; // ISO date for next payment
  walletName: string; // wallet to use for payments
  note?: string;
}

export interface BudgetGoal {
  category: string;
  monthlyLimit: number;
}

export interface MoneyState {
  wallets: string[];
  walletInitialBalances?: Record<string, number>;
  categories: string[];
  transactions: Transaction[];
  recurring: RecurringPayment[];
  loans: Loan[];
  budgetGoals: BudgetGoal[];
  showCents: boolean;
  currencySymbol: string;
  accentColor: string; // CSS color hex e.g. "#22c55e"
  balanceHidden: boolean;
  themeMode?: "light" | "dark" | "system";
}

export interface MoneyTotals {
  total: number;
  income: number;
  expense: number;
}

export interface WalletBalance {
  wallet: string;
  balance: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface TrendPoint {
  label: string;
  income: number;
  expense: number;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  wallet: string;
  category: string;
  date: string;
  note?: string;
  toWallet?: string;
  transferFee?: number;
}
