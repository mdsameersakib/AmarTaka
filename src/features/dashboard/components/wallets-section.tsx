import { useState } from "react";
import { DeleteWalletDialog } from "@/features/dashboard/components/dialogs/delete-wallet-dialog";
import { WalletCard } from "@/features/dashboard/components/wallet-card";
import type { WalletBalance } from "@/types/money";

type WalletsSectionProps = {
  walletBalances: WalletBalance[];
};

export function WalletsSection({ walletBalances }: WalletsSectionProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  return (
    <>
      <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#0f172a] ">
            Wallets
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {walletBalances.map((wallet) => (
            <WalletCard
              key={wallet.wallet}
              name={wallet.wallet}
              balance={wallet.balance}
              onLongPress={() => {
                setSelectedWallet(wallet.wallet);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-[#0f172a]/40/40">
          Long press a wallet to manage or delete it.
        </p>
      </div>

      <DeleteWalletDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        walletName={selectedWallet}
      />
    </>
  );
}
