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
      <DialogContent className="rounded-[32px] border-4 border-[#0f172a] bg-white shadow-neo dark:border-[#4ade80] dark:bg-[#020617]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-[#0f172a] dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={`New ${title.slice(0, -1)}`}
              className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
            />
            <Button
              type="button"
              onClick={onAdd}
              className="btn-neo rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-4 py-3 text-sm font-black uppercase text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
            >
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
              >
                <span className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-full border-2 border-transparent p-2 text-[#0f172a]/50 transition hover:border-[#0f172a] hover:text-[#0f172a] dark:text-[#bbf7d0]/70"
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
