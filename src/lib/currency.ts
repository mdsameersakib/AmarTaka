export const formatCurrency = (
  value: number,
  showCents = true,
  currencySymbol = "৳",
  hidden = false,
): string => {
  if (hidden) return `${currencySymbol}•••`;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  const sign = value < 0 ? "-" : "";
  const formatted = formatter.format(Math.abs(value));
  return `${sign}${currencySymbol}${formatted}`;
};
