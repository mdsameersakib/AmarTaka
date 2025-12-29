"use client";

import { Tag, Wallet } from "lucide-react";
import { useState } from "react";
import { ManagerCard } from "@/features/settings/components/manager-card";
import { DangerZone } from "@/features/settings/components/sections/danger-zone";
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
    deleteWallet,
    resetDemoData,
    showCents,
    toggleShowCents,
  } = useMoney();

  const [categoryInput, setCategoryInput] = useState("");
  const [walletInput, setWalletInput] = useState("");

  return (
    <div className="space-y-8">
      <SettingsHeader />

      <section className="grid gap-6 lg:grid-cols-2">
        <DisplaySettings
          showCents={showCents}
          onToggleCents={toggleShowCents}
        />

        <ManagerCard
          label="Categories"
          description="Organize recurring expense tags to keep your analytics sharp."
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
          onDelete={deleteWallet}
        />
      </section>

      <RecurringPayments recurring={recurring} />

      <DangerZone onReset={resetDemoData} />
    </div>
  );
}
