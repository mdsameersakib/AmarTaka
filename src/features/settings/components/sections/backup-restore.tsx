"use client";

import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMoney } from "@/providers/money-provider";

export function BackupRestore() {
  const { exportBackup, importBackup, state } = useMoney();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "ok" | "error">(
    "idle",
  );

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const ok = importBackup(json);
      setImportStatus(ok ? "ok" : "error");
      setTimeout(() => setImportStatus("idle"), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <section className="rounded-[32px] border-4 border-[var(--border)] bg-white p-6 shadow-neo">
      <h2 className="text-xl font-black text-[var(--foreground)]">Backup & Restore</h2>
      <p className="mt-1 text-xs text-[var(--foreground)]">
        Export your data to a JSON file or restore from a previous backup.
        Currently tracking <strong>{state.transactions.length}</strong>{" "}
        transactions across <strong>{state.wallets.length}</strong> wallets.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          onClick={exportBackup}
          className="btn-neo flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] py-3 text-sm font-black uppercase text-[var(--foreground)] shadow-neo-sm"
        >
          <Download className="h-4 w-4" /> Export Backup
        </Button>

        <Button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn-neo flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-white py-3 text-sm font-black uppercase text-[var(--foreground)] shadow-neo-sm"
        >
          <Upload className="h-4 w-4" /> Import Backup
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      {importStatus === "ok" && (
        <p className="mt-3 text-xs font-bold text-green-700">
          ✓ Backup restored successfully.
        </p>
      )}
      {importStatus === "error" && (
        <p className="mt-3 text-xs font-bold text-red-600">
          ✗ Failed to restore. Make sure it\'s a valid Amar Taka backup file.
        </p>
      )}
    </section>
  );
}
