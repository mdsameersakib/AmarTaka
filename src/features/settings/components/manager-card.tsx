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
      <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0f172a] dark:text-white">
              {label}
            </h3>
            <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Input
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={`Add ${label.slice(0, -1)}`}
            className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
          />
          <Button
            type="button"
            onClick={onAdd}
            className="btn-neo rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-4 py-3 font-black uppercase text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
          >
            Add
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-3 py-1 text-sm font-semibold uppercase text-[#14532d] dark:border-[#4ade80] dark:bg-[#052e16] dark:text-[#bbf7d0]"
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
                className="rounded-full border-2 border-transparent p-1 text-xs text-[#14532d]/70 transition hover:border-[#0f172a] hover:text-[#0f172a] dark:text-[#bbf7d0]/80"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {!items.length && (
            <p className="text-xs font-semibold uppercase text-[#0f172a]/40 dark:text-[#bbf7d0]/40">
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
