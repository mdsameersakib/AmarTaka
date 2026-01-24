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
  return (
    <label className="flex flex-col gap-2 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 font-semibold shadow-neo-sm focus:outline-none  "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}
