const formatDateWithYear = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

export const formatDateTimeDemo = (value: string) => {
  const base = formatDateWithYear(value).replace(/ /g, "-");
  return `${base} 3:23PM`;
};
