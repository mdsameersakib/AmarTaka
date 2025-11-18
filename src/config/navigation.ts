import type { LucideIcon } from "lucide-react";

import { LayoutDashboard, ReceiptText, Settings } from "lucide-react";

import type { AppRole } from "@/types/roles";
import { APP_ROLES } from "@/types/roles";

const ALL_ROLES: AppRole[] = [...APP_ROLES];

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: AppRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ALL_ROLES,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ReceiptText,
    roles: ALL_ROLES,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ALL_ROLES,
  }, // [GENERATOR-INSERTION-POINT]
];
