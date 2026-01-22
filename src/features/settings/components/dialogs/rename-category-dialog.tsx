import { Edit2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMoney } from "@/providers/money-provider";

type RenameCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldName: string;
};

export function RenameCategoryDialog({
  open,
  onOpenChange,
  oldName,
}: RenameCategoryDialogProps) {
  const { renameCategory } = useMoney();
  const [newName, setNewName] = useState(oldName);

  const handleConfirm = () => {
    if (!newName.trim() || newName === oldName) return;
    renameCategory(oldName, newName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-[#0f172a] dark:text-white">
            <Edit2 className="h-6 w-6" />
            Rename Category
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
            Renaming{" "}
            <span className="font-bold text-[#0f172a] dark:text-white">
              "{oldName}"
            </span>{" "}
            will update all past transactions to use the new name.
          </p>

          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border-2 border-[#0f172a] bg-[#f0fdf4] font-semibold dark:border-[#4ade80] dark:bg-[#052e16]"
            placeholder="Enter new name"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-transparent bg-transparent text-[#0f172a] hover:bg-black/5 dark:text-[#bbf7d0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!newName.trim() || newName === oldName}
              className="btn-neo border-2 border-[#0f172a] bg-[#22c55e] text-[#0f172a] dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
