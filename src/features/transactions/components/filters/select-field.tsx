import { useId } from "react";
import { Select } from "@/components/ui/select";

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  const selectId = useId();

  return (
    <label
      htmlFor={selectId}
      className="flex flex-col gap-2 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60/60">
        {label}
      </span>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        id={selectId}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </Select>
    </label>
  );
}
