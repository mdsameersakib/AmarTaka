"use client";

import { Tag, Wallet } from "lucide-react";
import { useState } from "react";
import { DeleteWalletDialog } from "@/features/dashboard/components/dialogs/delete-wallet-dialog";
import { ManagerCard } from "@/features/settings/components/manager-card";
import { DangerZone } from "@/features/settings/components/sections/danger-zone";
import { DeveloperCredits } from "@/features/settings/components/sections/developer-credits";
import { DisplaySettings } from "@/features/settings/components/sections/display-settings";
import { RecurringPayments } from "@/features/settings/components/sections/recurring-payments";
import { SettingsHeader } from "@/features/settings/components/sections/settings-header";
import { useMoney } from "@/providers/money-provider";

export default function SettingsPage() {
  const {
    state,
    recurring,
    addCategory,
    deleteCategory,
    addWallet,
    resetDemoData,
    showCents,
    toggleShowCents,
    currencySymbol,
    setCurrencySymbol,
  } = useMoney();

  const [categoryInput, setCategoryInput] = useState("");
  const [walletInput, setWalletInput] = useState("");
  const [walletToDelete, setWalletToDelete] = useState("");

  return (
    <div className="space-y-8">
      <SettingsHeader />

      <section className="grid gap-6 lg:grid-cols-2">
        <DisplaySettings
          showCents={showCents}
          onToggleCents={toggleShowCents}
          currencySymbol={currencySymbol}
          onSetCurrencySymbol={setCurrencySymbol}
        />

        <ManagerCard
          label="Categories"
          description="Organize recurring expense tags to keep your analytics sharp. Click to rename."
          icon={<Tag className="h-5 w-5" />}
          items={state.categories}
          value={categoryInput}
          onValueChange={setCategoryInput}
          onAdd={() => {
            if (!categoryInput.trim()) return;
            addCategory(categoryInput);
            setCategoryInput("");
          }}
          onDelete={deleteCategory}
          allowRename={true}
        />
        <ManagerCard
          label="Wallets"
          description="Cash, cards, and fintech rails that feed your spending."
          icon={<Wallet className="h-5 w-5" />}
          items={state.wallets}
          value={walletInput}
          onValueChange={setWalletInput}
          onAdd={() => {
            if (!walletInput.trim()) return;
            addWallet(walletInput);
            setWalletInput("");
          }}
          onDelete={setWalletToDelete}
        />
      </section>

      <RecurringPayments
        recurring={recurring}
        showCents={showCents}
        currencySymbol={currencySymbol}
      />

      <DeleteWalletDialog
        open={Boolean(walletToDelete)}
        onOpenChange={(open) => {
          if (!open) setWalletToDelete("");
        }}
        walletName={walletToDelete}
      />

      <DangerZone onReset={resetDemoData} />

      <DeveloperCredits />
    </div>
  );
}
