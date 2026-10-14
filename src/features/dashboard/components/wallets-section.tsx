"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { DeleteWalletDialog } from "@/features/dashboard/components/dialogs/delete-wallet-dialog";
import { WalletActionSheet } from "@/features/dashboard/components/wallet-action-sheet";
import { WalletCard } from "@/features/dashboard/components/wallet-card";
import { useMoney } from "@/providers/money-provider";
import type { WalletBalance } from "@/types/money";

type WalletsSectionProps = {
  walletBalances: WalletBalance[];
};

export function WalletsSection({ walletBalances }: WalletsSectionProps) {
  const { addWallet } = useMoney();
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<{
    name: string;
    balance: number;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLongPress = (name: string, balance: number) => {
    setSelectedWallet({ name, balance });
    setActionSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-[28px] sm:rounded-[32px] border-3 sm:border-4 border-[#0f172a] bg-white p-4 sm:p-6 shadow-neo">
        <div className="mb-4 sm:mb-5 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#0f172a]">
            Wallets
          </h2>
          <button
            type="button"
            onClick={() => {
              const name = prompt("Wallet name?");
              if (name?.trim()) addWallet(name.trim());
            }}
            className="flex items-center gap-1 rounded-full border-2 border-[#0f172a] bg-[var(--accent-pill-bg)] px-3 py-1 text-xs font-black uppercase text-[var(--accent-text-dark)] shadow-neo-sm hover:opacity-90"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>

        {walletBalances.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[#fefce8] px-4 py-8 text-center text-xs font-semibold uppercase text-[#0f172a]/50">
            No wallets yet. Add one above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {walletBalances.map((wallet) => (
              <WalletCard
                key={wallet.wallet}
                name={wallet.wallet}
                balance={wallet.balance}
                onLongPress={() =>
                  handleLongPress(wallet.wallet, wallet.balance)
                }
              />
            ))}
          </div>
        )}
        <p className="mt-4 text-center text-xs text-[#0f172a]/40">
          Long press a wallet to edit balance, transfer, or delete.
        </p>
      </div>

      {selectedWallet && (
        <WalletActionSheet
          open={actionSheetOpen}
          onOpenChange={setActionSheetOpen}
          walletName={selectedWallet.name}
          walletBalance={selectedWallet.balance}
          onDeleteRequest={() => setDeleteDialogOpen(true)}
        />
      )}

      <DeleteWalletDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        walletName={selectedWallet?.name ?? ""}
      />
    </>
  );
}
