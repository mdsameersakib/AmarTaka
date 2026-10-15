"use client";

import { X } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RenameCategoryDialog } from "@/features/settings/components/dialogs/rename-category-dialog";

type ManagerCardProps = {
  label: string;
  description: string;
  icon: ReactNode;
  items: string[];
  value: string;
  onValueChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (value: string) => void;
  allowRename?: boolean;
};

export function ManagerCard({
  label,
  description,
  icon,
  items,
  value,
  onValueChange,
  onAdd,
  onDelete,
  allowRename = false,
}: ManagerCardProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  return (
    <>
      <div className="rounded-[32px] border-4 border-[var(--border)] bg-white p-6 shadow-neo">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] p-3 shadow-neo-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--foreground)] ">{label}</h3>
            <p className="text-xs text-[var(--foreground)]">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Input
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={`Add ${label.slice(0, -1)}`}
            className="rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-3 font-semibold shadow-neo-sm  "
          />
          <Button
            type="button"
            onClick={onAdd}
            className="btn-neo rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-4 py-3 font-black uppercase shadow-neo-sm"
          >
            Add
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold uppercase text-[var(--accent-text-dark)]"
            >
              <button
                type="button"
                className={allowRename ? "cursor-pointer hover:underline" : ""}
                disabled={!allowRename}
                onClick={() => {
                  if (allowRename) {
                    setSelectedItem(item);
                    setRenameDialogOpen(true);
                  }
                }}
              >
                {item}
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="rounded-full border-2 border-transparent p-1 text-xs text-[var(--accent-text-dark)]/70 transition hover:border-[var(--border)] hover:text-[var(--foreground)]"
                aria-label={`Delete ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {!items.length && (
            <p className="text-xs font-semibold uppercase text-[var(--foreground)]">
              No items yet.
            </p>
          )}
        </div>
      </div>

      <RenameCategoryDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        oldName={selectedItem}
      />
    </>
  );
}
