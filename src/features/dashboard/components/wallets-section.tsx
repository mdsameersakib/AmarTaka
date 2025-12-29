import { WalletCard } from "@/features/dashboard/components/wallet-card";
import type { WalletBalance } from "@/types/money";

type WalletsSectionProps = {
  walletBalances: WalletBalance[];
};

export function WalletsSection({ walletBalances }: WalletsSectionProps) {
  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
          Wallets
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {walletBalances.map((wallet) => (
          <WalletCard
            key={wallet.wallet}
            name={wallet.wallet}
            balance={wallet.balance}
          />
        ))}
      </div>
    </div>
  );
}
