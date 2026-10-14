"use client";

import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/currency";
import { formatLocalYMD } from "@/lib/date";
import { useMoney } from "@/providers/money-provider";
import {
  calculateMonthlyEmi,
  computeNextLoanDueDate,
} from "@/services/loan-service";
import type { Loan } from "@/types/money";

const PRESET_MONTHS = [3, 6, 12, 24, 36];

export function LoansSection() {
  const {
    loans,
    showCents,
    currencySymbol,
    addLoan,
    deleteLoan,
    payLoan,
    state,
  } = useMoney();
  const [collapsed, setCollapsed] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [paySheet, setPaySheet] = useState<{
    loan: Loan;
    amount: string;
  } | null>(null);

  const today = formatLocalYMD();

  // Add loan form state
  const [lenderName, setLenderName] = useState("");
  const [direction, setDirection] = useState<"borrowed" | "lent">("borrowed");
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("0");
  const [durationMonths, setDurationMonths] = useState("12");
  const [startDate, setStartDate] = useState(today);
  const [customEmi, setCustomEmi] = useState("");
  const [walletName, setWalletName] = useState(state.wallets[0] ?? "");
  const [note, setNote] = useState("");

  const parsedPrincipal = Number.parseFloat(principal) || 0;
  const parsedInterest = Number.parseFloat(interestRate) || 0;
  const parsedMonths = Math.max(1, Number.parseInt(durationMonths, 10) || 12);

  const autoEmi = useMemo(
    () => calculateMonthlyEmi(parsedPrincipal, parsedInterest, parsedMonths),
    [parsedPrincipal, parsedInterest, parsedMonths],
  );

  const previewDueDate = useMemo(
    () => computeNextLoanDueDate(startDate || today, parsedMonths),
    [startDate, today, parsedMonths],
  );

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number.parseFloat(principal);
    if (!lenderName.trim() || Number.isNaN(p) || p <= 0) return;

    const months = Math.max(1, Number.parseInt(durationMonths, 10) || 12);
    const start = startDate || today;
    const finalEmi = customEmi.trim()
      ? Number.parseFloat(customEmi) || autoEmi
      : autoEmi;
    const computedDue = computeNextLoanDueDate(start, months);

    addLoan({
      lenderName: lenderName.trim(),
      direction,
      principal: p,
      remaining: p,
      interestRate: Number.parseFloat(interestRate) || 0,
      durationMonths: months,
      startDate: start,
      emiAmount: finalEmi,
      dueDate: computedDue,
      walletName,
      note,
    });

    setAddOpen(false);
    setLenderName("");
    setPrincipal("");
    setInterestRate("0");
    setDurationMonths("12");
    setStartDate(today);
    setCustomEmi("");
    setNote("");
  };

  const handlePay = () => {
    if (!paySheet) return;
    const amt = Number.parseFloat(paySheet.amount);
    if (Number.isNaN(amt) || amt <= 0) return;
    payLoan(paySheet.loan.id, amt);
    setPaySheet(null);
  };

  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#0f172a]">
            Loans & EMIs
          </h2>
          {loans.length > 0 && (
            <span className="rounded-full border-2 border-[#0f172a] bg-[var(--accent-pill-bg)] px-2 py-0.5 text-xs font-black text-[var(--accent-text-dark)]">
              {loans.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="btn-neo flex items-center gap-1 rounded-2xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-3 py-1.5 text-xs font-black uppercase shadow-neo-sm hover:opacity-90 active:scale-95 transition"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full border-2 border-[#0f172a] p-1.5 text-[#0f172a] shadow-neo-sm hover:bg-[var(--accent-soft)]"
            aria-label={collapsed ? "Expand loans" : "Collapse loans"}
          >
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {loans.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[var(--accent-subtle)] px-4 py-8 text-center text-xs font-semibold uppercase text-[#0f172a]/50">
              No loans tracked. Add one above.
            </p>
          ) : (
            loans.map((loan) => {
              const pct = Math.round(
                ((loan.principal - loan.remaining) / loan.principal) * 100,
              );
              const isOverdue = loan.dueDate < today;
              const isBorrowed = loan.direction === "borrowed";
              const months = loan.durationMonths || 12;
              const start = loan.startDate || loan.dueDate;

              return (
                <div
                  key={loan.id}
                  className="rounded-2xl border-2 border-[#0f172a] bg-[var(--accent-subtle)] p-4 shadow-neo-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black uppercase text-[#0f172a]">
                          {loan.lenderName}
                        </p>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-2 ${
                            isBorrowed
                              ? "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300"
                              : "border-green-200 bg-green-50 text-green-700 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                          }`}
                        >
                          {isBorrowed ? "I owe" : "Owed to me"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#0f172a]/70">
                        <span className="font-bold">{months} mos tenure</span> ·
                        Started {start}
                        {loan.interestRate > 0
                          ? ` · ${loan.interestRate}% interest`
                          : " · 0% interest"}
                        {loan.note ? ` · ${loan.note}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteLoan(loan.id)}
                      className="rounded-full border-2 border-transparent p-1 text-red-400 hover:border-red-200"
                      aria-label="Delete loan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase text-[#0f172a]/60">
                      <span>Remaining</span>
                      <span className={isOverdue ? "text-red-600" : ""}>
                        {isOverdue && (
                          <AlertTriangle className="inline h-3 w-3 mr-1" />
                        )}
                        Next Due: {loan.dueDate}
                        {loan.emiAmount > 0 && (
                          <span className="ml-1 text-[var(--accent-text-dark)] font-black">
                            (
                            {formatCurrency(
                              loan.emiAmount,
                              showCents,
                              currencySymbol,
                            )}
                            /mo)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-2xl font-black text-[#0f172a]">
                        <MaskedAmount amount={loan.remaining} />
                      </p>
                      <span className="text-xs text-[#0f172a]/50">
                        / <MaskedAmount amount={loan.principal} />
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-[#0f172a] bg-[var(--accent-soft)] shadow-neo-sm">
                      <div
                        className="h-full rounded-full bg-[var(--accent-primary)] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] font-bold text-[#0f172a]/60">
                      <span>Wallet: {loan.walletName}</span>
                      <span>{pct}% completed</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPaySheet({
                        loan,
                        amount:
                          loan.emiAmount > 0 && loan.remaining >= loan.emiAmount
                            ? String(loan.emiAmount)
                            : String(loan.remaining),
                      })
                    }
                    className="btn-neo mt-3 w-full rounded-2xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-2 text-sm font-black uppercase shadow-neo-sm hover:opacity-90 active:scale-95 transition"
                  >
                    {isBorrowed ? "Make Payment" : "Record Repayment"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Loan Sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] rounded-t-[48px] border-4 border-[#0f172a] bg-[var(--accent-subtle)] shadow-neo-lg flex flex-col overflow-y-auto"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-3xl font-black text-[#0f172a]">
              Add Loan / EMI
            </SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleAddLoan}
            className="mt-5 flex flex-col gap-4 pb-6"
          >
            {/* Lender Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="loan-lender"
                className="text-xs font-bold uppercase text-[#0f172a]/70"
              >
                Lender / Borrower name
              </label>
              <Input
                id="loan-lender"
                value={lenderName}
                onChange={(e) => setLenderName(e.target.value)}
                required
                placeholder="e.g. Abba, City Bank, Friend"
                className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
              />
            </div>

            {/* Direction & Wallet */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="loan-direction"
                  className="text-xs font-bold uppercase text-[#0f172a]/70"
                >
                  Direction
                </label>
                <Select
                  id="loan-direction"
                  value={direction}
                  onChange={(e) =>
                    setDirection(e.target.value as "borrowed" | "lent")
                  }
                  className="h-12"
                >
                  <option value="borrowed">I borrowed (Debt)</option>
                  <option value="lent">I lent (Receivable)</option>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="loan-wallet"
                  className="text-xs font-bold uppercase text-[#0f172a]/70"
                >
                  Wallet
                </label>
                <Select
                  id="loan-wallet"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="h-12"
                >
                  {state.wallets.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Principal & Interest */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="loan-principal"
                  className="text-xs font-bold uppercase text-[#0f172a]/70"
                >
                  Principal Amount
                </label>
                <Input
                  id="loan-principal"
                  type="text"
                  inputMode="decimal"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  required
                  placeholder="0.00"
                  className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="loan-interest"
                  className="text-xs font-bold uppercase text-[#0f172a]/70"
                >
                  Interest % / yr
                </label>
                <Input
                  id="loan-interest"
                  type="text"
                  inputMode="decimal"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="0"
                  className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
                />
              </div>
            </div>

            {/* Starting Date & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="loan-startdate"
                  className="text-xs font-bold uppercase text-[#0f172a]/70 flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" /> Starting Date
                </label>
                <Input
                  id="loan-startdate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="loan-duration"
                  className="text-xs font-bold uppercase text-[#0f172a]/70 flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" /> Duration (Months)
                </label>
                <Input
                  id="loan-duration"
                  type="number"
                  min="1"
                  max="360"
                  required
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  placeholder="12"
                  className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
                />
              </div>
            </div>

            {/* Preset month chips */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-[#0f172a]/60">
                Quick term:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_MONTHS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMonths(String(m))}
                    className={`rounded-xl border-2 border-[#0f172a] px-2.5 py-1 text-xs font-black transition ${
                      durationMonths === String(m)
                        ? "bg-[var(--accent-tab)] text-[#0f172a] shadow-neo-sm"
                        : "bg-white text-[#0f172a] hover:bg-[var(--accent-soft)]"
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly EMI calculation */}
            <div className="rounded-2xl border-2 border-[#0f172a] bg-[var(--accent-soft)] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-[var(--accent-text-dark)]">
                    Calculated Monthly EMI
                  </p>
                  <p className="text-xs text-[#0f172a]/60">
                    Next due: {previewDueDate}
                  </p>
                </div>
                <p className="text-xl font-black text-[#0f172a]">
                  {formatCurrency(autoEmi, showCents, currencySymbol)}
                  <span className="text-xs font-bold text-[#0f172a]/60">
                    /mo
                  </span>
                </p>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <label
                  htmlFor="loan-custom-emi"
                  className="text-[11px] font-bold uppercase text-[#0f172a]/70 whitespace-nowrap"
                >
                  Custom EMI (opt):
                </label>
                <Input
                  id="loan-custom-emi"
                  type="text"
                  inputMode="decimal"
                  value={customEmi}
                  onChange={(e) => setCustomEmi(e.target.value)}
                  placeholder={String(autoEmi)}
                  className="h-8 rounded-xl border border-[#0f172a] bg-white px-2 py-1 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="loan-note"
                className="text-xs font-bold uppercase text-[#0f172a]/70"
              >
                Note (optional)
              </label>
              <Input
                id="loan-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Car purchase, home renovation"
                className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
              />
            </div>

            <Button
              type="submit"
              className="btn-neo rounded-3xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-6 text-lg font-black uppercase tracking-wide shadow-neo-lg"
            >
              Save Loan
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Pay / Repay Sheet */}
      <Sheet open={!!paySheet} onOpenChange={(o) => !o && setPaySheet(null)}>
        <SheetContent
          side="bottom"
          className="rounded-t-[48px] border-4 border-[#0f172a] bg-[var(--accent-subtle)] shadow-neo-lg flex flex-col"
        >
          <SheetTitle className="text-2xl font-black text-[#0f172a] mt-2">
            {paySheet?.loan.direction === "borrowed"
              ? "Make Payment"
              : "Record Repayment"}
          </SheetTitle>
          {paySheet && (
            <>
              <p className="text-sm text-[#0f172a]/60 mt-1">
                {paySheet.loan.direction === "borrowed"
                  ? `Paying ${paySheet.loan.lenderName} from ${paySheet.loan.walletName}`
                  : `Receiving from ${paySheet.loan.lenderName} into ${paySheet.loan.walletName}`}
              </p>
              <div className="mt-5 flex flex-col gap-4 pb-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="loan-pay-amount"
                    className="text-xs font-bold uppercase text-[#0f172a]/70"
                  >
                    Payment Amount
                  </label>
                  <Input
                    id="loan-pay-amount"
                    type="text"
                    inputMode="decimal"
                    value={paySheet.amount}
                    onChange={(e) =>
                      setPaySheet({ ...paySheet, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="rounded-3xl border-2 border-[#0f172a] bg-white px-4 py-6 text-3xl font-black shadow-neo-sm"
                  />
                  <div className="flex justify-between text-xs text-[#0f172a]/60">
                    <span>
                      Remaining:{" "}
                      <MaskedAmount
                        amount={paySheet.loan.remaining}
                        showCents={showCents}
                        currencySymbol={currencySymbol}
                      />
                    </span>
                    {paySheet.loan.emiAmount > 0 && (
                      <span>
                        Monthly EMI:{" "}
                        {formatCurrency(
                          paySheet.loan.emiAmount,
                          showCents,
                          currencySymbol,
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handlePay}
                  className="btn-neo rounded-3xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-6 text-lg font-black uppercase shadow-neo-lg"
                >
                  {paySheet.loan.direction === "borrowed"
                    ? "Confirm Payment"
                    : "Confirm Received"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
