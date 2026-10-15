"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ManageDialogProps = {
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  items: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (value: string) => void;
};

export function ManageDialog({
  title,
  open,
  onOpenChange,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onDelete,
}: ManageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[32px] border-4 border-[var(--border)] bg-white shadow-neo">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-[var(--foreground)] ">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={`New ${title.slice(0, -1)}`}
              className="rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-3 font-semibold shadow-neo-sm  "
            />
            <Button
              type="button"
              onClick={onAdd}
              className="btn-neo rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-4 py-3 text-sm font-black uppercase shadow-neo-sm"
            >
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm"
              >
                <span className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-full border-2 border-transparent p-2 text-[var(--foreground)] transition hover:border-[var(--border)] hover:text-[var(--foreground)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
