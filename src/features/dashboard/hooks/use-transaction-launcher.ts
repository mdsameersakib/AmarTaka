import { useState } from "react";
import { useMoney } from "@/providers/money-provider";
import type { TransactionInput, TransactionType } from "@/types/money";

export function useTransactionLauncher() {
  const { state, addTransaction } = useMoney();

  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [formData, setFormData] = useState<TransactionInput>({
    type: "expense",
    amount: 0,
    wallet: state.wallets[0] ?? "",
    category: state.categories[0] ?? "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const openForm = (type: TransactionType) => {
    setFormType(type);
    setFormData({
      type,
      amount: 0,
      wallet: state.wallets[0] ?? "",
      category: state.categories[0] ?? "",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.wallet || !formData.category || !formData.date) return;
    addTransaction({
      ...formData,
      type: formType,
      amount: Number(formData.amount),
    });
    setIsFormOpen(false);
  };

  return {
    isTypeSelectorOpen,
    setIsTypeSelectorOpen,
    isFormOpen,
    setIsFormOpen,
    formType,
    formData,
    setFormData,
    openForm,
    handleSubmit,
  };
}
