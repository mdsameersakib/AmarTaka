"use client";

import { ArrowLeftRight, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/currency";
import { useMoney } from "@/providers/money-provider";

type WalletActionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletName: string;
  walletBalance: number;
  onDeleteRequest: () => void;
};

type SheetView = "menu" | "edit-balance" | "transfer";

export function WalletActionSheet({
  open,
  onOpenChange,
  walletName,
  walletBalance,
  onDeleteRequest,
}: WalletActionSheetProps) {
  const {
    state,
    showCents,
    currencySymbol,
    updateWalletInitialBalance,
    addTransfer,
  } = useMoney();
  const [view, setView] = useState<SheetView>("menu");

  // Edit balance state
  const [newBalance, setNewBalance] = useState("");

  // Transfer state
  const [toWallet, setToWallet] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [transferNote, setTransferNote] = useState("");

  const otherWallets = state.wallets.filter((w) => w !== walletName);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setView("menu");
      setNewBalance("");
      setToWallet("");
      setTransferAmount("");
      setTransferFee("");
      setTransferNote("");
    }, 300);
  };

  const handleEditBalance = () => {
    const val = Number.parseFloat(newBalance);
    if (Number.isNaN(val)) return;

    // Calculate sum of transactions that affected this wallet
    const netTransactions = state.transactions.reduce((sum, tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.wallet === walletName) {
        if (tx.type === "income") return sum + amt;
        if (tx.type === "expense") return sum - amt;
        if (tx.type === "transfer") {
          const fee = Number(tx.transferFee) || 0;
          return sum - amt - fee;
        }
      }
      if (tx.type === "transfer" && tx.toWallet === walletName) {
        return sum + amt;
      }
      return sum;
    }, 0);

    // Set initial balance so that initialBalance + netTransactions === val
    const targetInitialBalance = val - netTransactions;
    updateWalletInitialBalance(walletName, targetInitialBalance);
    handleClose();
  };

  const handleTransfer = () => {
    const amt = Number.parseFloat(transferAmount);
    if (!toWallet || Number.isNaN(amt) || amt <= 0) return;
    const fee = Number.parseFloat(transferFee) || 0;
    addTransfer(walletName, toWallet, amt, fee, transferNote);
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] rounded-t-[48px] border-4 border-[#0f172a] bg-[#fefce8] shadow-neo-lg flex flex-col overflow-y-auto"
      >
        {view === "menu" && (
          <>
            <SheetTitle className="text-2xl font-black text-[#0f172a] mt-2">
              {walletName}
            </SheetTitle>
            <p className="text-4xl font-black text-[#0f172a] mt-1">
              {formatCurrency(walletBalance, showCents, currencySymbol)}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setNewBalance(walletBalance.toString());
                  setView("edit-balance");
                }}
                className="btn-neo flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white p-5 shadow-neo-sm hover:bg-[var(--accent-soft)]"
              >
                <Pencil className="h-6 w-6 text-[#0f172a]" />
                <span className="text-sm font-black uppercase text-[#0f172a]">
                  Edit Balance
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setToWallet(otherWallets[0] ?? "");
                  setView("transfer");
                }}
                disabled={otherWallets.length === 0}
                className="btn-neo flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white p-5 shadow-neo-sm hover:bg-[var(--accent-soft)] disabled:opacity-40"
              >
                <ArrowLeftRight className="h-6 w-6 text-[#0f172a]" />
                <span className="text-sm font-black uppercase text-[#0f172a]">
                  Transfer
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(() => onDeleteRequest(), 350);
              }}
              className="mt-4 w-full rounded-2xl border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/60 py-3 text-sm font-black uppercase text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60"
            >
              Delete Wallet
            </button>
          </>
        )}

        {view === "edit-balance" && (
          <>
            <button
              type="button"
              onClick={() => setView("menu")}
              className="mb-2 self-start text-xs font-bold uppercase text-[#0f172a]/60 hover:text-[#0f172a]"
            >
              ← Back
            </button>
            <SheetTitle className="text-2xl font-black text-[#0f172a]">
              Edit Balance
            </SheetTitle>
            <p className="text-xs text-[#0f172a]/60 mb-4">
              Enter the actual current balance for <strong>{walletName}</strong>
              .
            </p>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit-balance-input"
                className="text-xs font-bold uppercase text-[#0f172a]/70"
              >
                Current Balance
              </label>
              <Input
                id="edit-balance-input"
                type="text"
                inputMode="decimal"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="0.00"
                className="rounded-3xl border-2 border-[#0f172a] bg-white px-4 py-6 text-3xl font-black shadow-neo-sm"
              />
            </div>
            <Button
              type="button"
              onClick={handleEditBalance}
              className="mt-5 btn-neo rounded-3xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-6 text-lg font-black uppercase tracking-wide shadow-neo-lg"
            >
              Save Balance
            </Button>
          </>
        )}

        {view === "transfer" && (
          <>
            <button
              type="button"
              onClick={() => setView("menu")}
              className="mb-2 self-start text-xs font-bold uppercase text-[#0f172a]/60 hover:text-[#0f172a]"
            >
              ← Back
            </button>
            <SheetTitle className="text-2xl font-black text-[#0f172a]">
              Transfer from {walletName}
            </SheetTitle>

            <div className="mt-4 flex flex-col gap-4 pb-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="transfer-to"
                  className="text-xs font-bold uppercase text-[#0f172a]/70"
                >
                  To Wallet
                </label>
                <Select
                  id="transfer-to"
                  value={toWallet}
                  onChange={(e) => setToWallet(e.target.value)}
                  className="h-12"
                >
                  {otherWallets.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="transfer-amount"
                    className="text-xs font-bold uppercase text-[#0f172a]/70"
                  >
                    Amount
                  </label>
                  <Input
                    id="transfer-amount"
                    type="text"
                    inputMode="decimal"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 text-xl font-black shadow-neo-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="transfer-fee"
                    className="text-xs font-bold uppercase text-[#0f172a]/70"
                  >
                    Fee (optional)
                  </label>
                  <Input
                    id="transfer-fee"
                    type="text"
                    inputMode="decimal"
                    value={transferFee}
                    onChange={(e) => setTransferFee(e.target.value)}
                    placeholder="0.00"
                    className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 text-xl font-black shadow-neo-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="transfer-note"
                  className="text-xs font-bold uppercase text-[#0f172a]/70"
                >
                  Note (optional)
                </label>
                <Input
                  id="transfer-note"
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="e.g. bKash cashout"
                  className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
                />
              </div>

              <Button
                type="button"
                onClick={handleTransfer}
                className="btn-neo rounded-3xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-6 text-lg font-black uppercase tracking-wide shadow-neo-lg"
              >
                Transfer Funds
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
