import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { useMoney } from "@/providers/money-provider";

type DeleteWalletDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletName: string;
};

export function DeleteWalletDialog({
  open,
  onOpenChange,
  walletName,
}: DeleteWalletDialogProps) {
  const { state, deleteWalletWithStrategy } = useMoney();
  const [strategy, setStrategy] = useState<"cascade" | "move" | null>(null);
  const [targetWallet, setTargetWallet] = useState<string>("");

  const otherWallets = state.wallets.filter((w) => w !== walletName);
  const transactionCount = state.transactions.filter(
    (tx) => tx.wallet === walletName,
  ).length;

  const handleConfirm = () => {
    if (
      transactionCount > 0 &&
      (!strategy || (strategy === "move" && !targetWallet))
    ) {
      return;
    }
    const resolvedStrategy = strategy ?? "cascade";

    deleteWalletWithStrategy(
      walletName,
      transactionCount > 0 ? resolvedStrategy : "cascade",
      targetWallet,
    );
    onOpenChange(false);
    // Reset state
    setStrategy(null);
    setTargetWallet("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setStrategy(null);
          setTargetWallet("");
        }
      }}
    >
      <DialogContent className="max-w-md rounded-[32px] border-4 border-[#7f1d1d] bg-[#fee2e2] p-6 shadow-neo">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-[#7f1d1d]">
            <AlertTriangle className="h-6 w-6" />
            Delete Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <p className="text-sm font-semibold text-[#7f1d1d]">
            You are about to delete{" "}
            <span className="font-black">"{walletName}"</span>.
          </p>

          {transactionCount > 0 ? (
            <>
              <p className="text-sm text-[#7f1d1d]/80">
                This wallet has <strong>{transactionCount}</strong> associated
                transactions. What should happen to them?
              </p>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#7f1d1d]/20 bg-white/50 p-3">
                  <input
                    type="radio"
                    name="strategy"
                    className="mt-1"
                    checked={strategy === "cascade"}
                    onChange={() => setStrategy("cascade")}
                  />
                  <div>
                    <span className="block font-bold text-[#7f1d1d]">
                      Delete transactions
                    </span>
                    <span className="text-xs text-[#7f1d1d]/70">
                      Permanently remove them history.
                    </span>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#7f1d1d]/20 bg-white/50 p-3">
                  <input
                    type="radio"
                    name="strategy"
                    className="mt-1"
                    checked={strategy === "move"}
                    onChange={() => setStrategy("move")}
                  />
                  <div className="flex-1">
                    <span className="block font-bold text-[#7f1d1d]">
                      Move transactions
                    </span>
                    <span className="text-xs text-[#7f1d1d]/70">
                      Transfer them to another wallet.
                    </span>

                    {strategy === "move" && (
                      <Select
                        value={targetWallet}
                        onChange={(e) => setTargetWallet(e.target.value)}
                        containerClassName="mt-2"
                        className="border-[#7f1d1d] text-[#7f1d1d]"
                      >
                        <option value="" disabled>
                          Select a wallet
                        </option>
                        {otherWallets.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                </label>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#7f1d1d]/80">
              This wallet has no transactions. It is safe to delete.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-transparent bg-transparent text-[#7f1d1d] hover:bg-black/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                transactionCount > 0 &&
                (!strategy || (strategy === "move" && !targetWallet))
              }
              className="border-2 border-[#7f1d1d] bg-[#ef4444] text-[#f8fafc] hover:bg-[#dc2626]"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
