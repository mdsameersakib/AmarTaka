export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  wallet: string;
  category: string;
  date: string; // ISO date string
  note?: string;
}

export interface RecurringPayment {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: TransactionType;
}

export interface MoneyState {
  wallets: string[];
  walletInitialBalances?: Record<string, number>;
  categories: string[];
  transactions: Transaction[];
  recurring: RecurringPayment[];
  showCents: boolean;
  currencySymbol: string;
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
}
