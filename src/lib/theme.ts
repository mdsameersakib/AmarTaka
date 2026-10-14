export type ThemeColorKey =
  | "green"
  | "blue"
  | "red"
  | "pink"
  | "brown"
  | "purple"
  | "orange"
  | "amber"
  | "teal";

export interface ColorTheme {
  key: ThemeColorKey;
  name: string;
  hex: string;
  // Light mode tokens
  primary: string;
  primaryContrast: string;
  soft: string;
  subtle: string;
  header: string;
  activeTab: string;
  textDark: string;
  pillBg: string;

  // Dark mode tokens (calibrated for high contrast & rich neobrutalism)
  darkBackground: string;
  darkCard: string;
  darkBorder: string;
  darkHeader: string;
  darkSoft: string;
  darkSubtle: string;
  darkSheet: string;
  darkTabContainer: string;
  darkTab: string;
  darkTabContrast: string;
  darkTextDark: string;
  darkPillBg: string;
  darkPrimary: string;
  darkPrimaryContrast: string;
}

export const THEME_PALETTES: Record<ThemeColorKey, ColorTheme> = {
  green: {
    key: "green",
    name: "Green",
    hex: "#22c55e",
    primary: "#22c55e",
    primaryContrast: "#052e16",
    soft: "#ecfccb",
    subtle: "#f0fdf4",
    header: "#c7f9cc",
    activeTab: "#a3e635",
    textDark: "#14532d",
    pillBg: "#d9f99d",

    darkBackground: "#07120a",
    darkCard: "#0d1e14",
    darkBorder: "#1f422b",
    darkHeader: "#0b2315",
    darkSoft: "#143321",
    darkSubtle: "#07120a",
    darkSheet: "#0c1b12",
    darkTabContainer: "#060f09",
    darkTab: "#22c55e",
    darkTabContrast: "#052e16",
    darkTextDark: "#86efac",
    darkPillBg: "#1b432c",
    darkPrimary: "#22c55e",
    darkPrimaryContrast: "#052e16",
  },
  blue: {
    key: "blue",
    name: "Blue",
    hex: "#3b82f6",
    primary: "#3b82f6",
    primaryContrast: "#ffffff",
    soft: "#dbeafe",
    subtle: "#eff6ff",
    header: "#bfdbfe",
    activeTab: "#60a5fa",
    textDark: "#1e3a8a",
    pillBg: "#bfdbfe",

    darkBackground: "#060e1d",
    darkCard: "#0d1a33",
    darkBorder: "#1e3a6e",
    darkHeader: "#0a1c3d",
    darkSoft: "#132952",
    darkSubtle: "#060e1d",
    darkSheet: "#0b172e",
    darkTabContainer: "#050c18",
    darkTab: "#3b82f6",
    darkTabContrast: "#ffffff",
    darkTextDark: "#93c5fd",
    darkPillBg: "#1a366b",
    darkPrimary: "#3b82f6",
    darkPrimaryContrast: "#ffffff",
  },
  red: {
    key: "red",
    name: "Red",
    hex: "#ef4444",
    primary: "#ef4444",
    primaryContrast: "#ffffff",
    soft: "#fee2e2",
    subtle: "#fef2f2",
    header: "#fecaca",
    activeTab: "#f87171",
    textDark: "#7f1d1d",
    pillBg: "#fecaca",

    darkBackground: "#130608",
    darkCard: "#220c10",
    darkBorder: "#4e1a22",
    darkHeader: "#2a0c12",
    darkSoft: "#3b141c",
    darkSubtle: "#130608",
    darkSheet: "#1f0b0f",
    darkTabContainer: "#0f0406",
    darkTab: "#ef4444",
    darkTabContrast: "#ffffff",
    darkTextDark: "#fca5a5",
    darkPillBg: "#4d1822",
    darkPrimary: "#ef4444",
    darkPrimaryContrast: "#ffffff",
  },
  pink: {
    key: "pink",
    name: "Pink",
    hex: "#ec4899",
    primary: "#ec4899",
    primaryContrast: "#ffffff",
    soft: "#fce7f3",
    subtle: "#fdf2f8",
    header: "#fbcfe8",
    activeTab: "#f472b6",
    textDark: "#831843",
    pillBg: "#fbcfe8",

    darkBackground: "#140610",
    darkCard: "#220c1c",
    darkBorder: "#4e183f",
    darkHeader: "#2b0b23",
    darkSoft: "#3c1233",
    darkSubtle: "#140610",
    darkSheet: "#1f0a19",
    darkTabContainer: "#10040d",
    darkTab: "#ec4899",
    darkTabContrast: "#ffffff",
    darkTextDark: "#f9a8d4",
    darkPillBg: "#4f1642",
    darkPrimary: "#ec4899",
    darkPrimaryContrast: "#ffffff",
  },
  brown: {
    key: "brown",
    name: "Brown",
    hex: "#854d0e",
    primary: "#854d0e",
    primaryContrast: "#ffffff",
    soft: "#fef3c7",
    subtle: "#fffbeb",
    header: "#fde68a",
    activeTab: "#d97706",
    textDark: "#451a03",
    pillBg: "#fde68a",

    darkBackground: "#110b05",
    darkCard: "#1f1409",
    darkBorder: "#452c15",
    darkHeader: "#271708",
    darkSoft: "#36210c",
    darkSubtle: "#110b05",
    darkSheet: "#1c1207",
    darkTabContainer: "#0d0803",
    darkTab: "#d97706",
    darkTabContrast: "#ffffff",
    darkTextDark: "#fde68a",
    darkPillBg: "#472b10",
    darkPrimary: "#d97706",
    darkPrimaryContrast: "#ffffff",
  },
  purple: {
    key: "purple",
    name: "Purple",
    hex: "#a855f7",
    primary: "#a855f7",
    primaryContrast: "#ffffff",
    soft: "#f3e8ff",
    subtle: "#faf5ff",
    header: "#e9d5ff",
    activeTab: "#c084fc",
    textDark: "#581c87",
    pillBg: "#e9d5ff",

    darkBackground: "#0d0618",
    darkCard: "#180c2c",
    darkBorder: "#3d1d6e",
    darkHeader: "#200c3b",
    darkSoft: "#2e1452",
    darkSubtle: "#0d0618",
    darkSheet: "#150a26",
    darkTabContainer: "#0a0413",
    darkTab: "#a855f7",
    darkTabContrast: "#ffffff",
    darkTextDark: "#d8b4fe",
    darkPillBg: "#3c196b",
    darkPrimary: "#a855f7",
    darkPrimaryContrast: "#ffffff",
  },
  orange: {
    key: "orange",
    name: "Orange",
    hex: "#f97316",
    primary: "#f97316",
    primaryContrast: "#ffffff",
    soft: "#ffedd5",
    subtle: "#fff7ed",
    header: "#fed7aa",
    activeTab: "#fb923c",
    textDark: "#7c2d12",
    pillBg: "#fed7aa",

    darkBackground: "#130804",
    darkCard: "#221006",
    darkBorder: "#4d240e",
    darkHeader: "#291206",
    darkSoft: "#3a1c09",
    darkSubtle: "#130804",
    darkSheet: "#1f0e05",
    darkTabContainer: "#0e0502",
    darkTab: "#f97316",
    darkTabContrast: "#ffffff",
    darkTextDark: "#fdba74",
    darkPillBg: "#4d230b",
    darkPrimary: "#f97316",
    darkPrimaryContrast: "#ffffff",
  },
  amber: {
    key: "amber",
    name: "Amber",
    hex: "#f59e0b",
    primary: "#f59e0b",
    primaryContrast: "#0f172a",
    soft: "#fef3c7",
    subtle: "#fffbeb",
    header: "#fde68a",
    activeTab: "#fbbf24",
    textDark: "#78350f",
    pillBg: "#fde68a",

    darkBackground: "#120a03",
    darkCard: "#211406",
    darkBorder: "#4c2f0f",
    darkHeader: "#281706",
    darkSoft: "#392309",
    darkSubtle: "#120a03",
    darkSheet: "#1e1205",
    darkTabContainer: "#0e0702",
    darkTab: "#f59e0b",
    darkTabContrast: "#0f172a",
    darkTextDark: "#fde047",
    darkPillBg: "#4c2e0b",
    darkPrimary: "#f59e0b",
    darkPrimaryContrast: "#0f172a",
  },
  teal: {
    key: "teal",
    name: "Teal",
    hex: "#14b8a6",
    primary: "#14b8a6",
    primaryContrast: "#042f2e",
    soft: "#ccfbf1",
    subtle: "#f0fdfa",
    header: "#99f6e4",
    activeTab: "#2dd4bf",
    textDark: "#134e4a",
    pillBg: "#99f6e4",

    darkBackground: "#041110",
    darkCard: "#081f1d",
    darkBorder: "#144440",
    darkHeader: "#072724",
    darkSoft: "#0d3632",
    darkSubtle: "#041110",
    darkSheet: "#071b19",
    darkTabContainer: "#030c0c",
    darkTab: "#14b8a6",
    darkTabContrast: "#042f2e",
    darkTextDark: "#5eead4",
    darkPillBg: "#124842",
    darkPrimary: "#14b8a6",
    darkPrimaryContrast: "#042f2e",
  },
};

export const findThemeByColor = (color: string): ColorTheme => {
  const match = Object.values(THEME_PALETTES).find(
    (t) => t.key === color || t.hex.toLowerCase() === color.toLowerCase(),
  );
  return match ?? THEME_PALETTES.green;
};

export const applyThemeToDocument = (theme: ColorTheme, isDark = false) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Toggle .dark class for CSS selectors
  root.classList.toggle("dark", isDark);

  if (isDark) {
    root.style.setProperty("--accent-primary", theme.darkPrimary);
    root.style.setProperty("--accent-contrast", theme.darkPrimaryContrast);
    root.style.setProperty("--accent-soft", theme.darkSoft);
    root.style.setProperty("--accent-subtle", theme.darkSubtle);
    root.style.setProperty("--accent-header", theme.darkHeader);
    root.style.setProperty("--accent-tab", theme.darkTab);
    root.style.setProperty("--accent-tab-contrast", theme.darkTabContrast);
    root.style.setProperty("--accent-text-dark", theme.darkTextDark);
    root.style.setProperty("--accent-pill-bg", theme.darkPillBg);
    root.style.setProperty("--accent-sheet", theme.darkSheet);
    root.style.setProperty("--accent-tab-container", theme.darkTabContainer);
    root.style.setProperty("--background", theme.darkBackground);
    root.style.setProperty("--card", theme.darkCard);
    root.style.setProperty("--card-foreground", "#f8fafc");
    root.style.setProperty("--foreground", "#f8fafc");
    root.style.setProperty("--border", theme.darkBorder);
    root.style.setProperty("--shadow-color", "#000000");
  } else {
    root.style.setProperty("--accent-primary", theme.primary);
    root.style.setProperty("--accent-contrast", theme.primaryContrast);
    root.style.setProperty("--accent-soft", theme.soft);
    root.style.setProperty("--accent-subtle", theme.subtle);
    root.style.setProperty("--accent-header", theme.header);
    root.style.setProperty("--accent-tab", theme.activeTab);
    root.style.setProperty("--accent-tab-contrast", theme.primaryContrast);
    root.style.setProperty("--accent-text-dark", theme.textDark);
    root.style.setProperty("--accent-pill-bg", theme.pillBg);
    root.style.setProperty("--accent-sheet", "#fefce8");
    root.style.setProperty("--accent-tab-container", "#ffffff");
    root.style.setProperty("--background", theme.subtle);
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--card-foreground", "#0f172a");
    root.style.setProperty("--foreground", "#0f172a");
    root.style.setProperty("--border", "#0f172a");
    root.style.setProperty("--shadow-color", "#0f172a");
  }
};
