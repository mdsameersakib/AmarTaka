import type { LucideIcon } from "lucide-react";

import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react";

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
    label: "Page 1",
    href: "/page-1",
    icon: LayoutDashboard,
    roles: ALL_ROLES,
  },
  {
    label: "Page 2",
    href: "/page-2",
    icon: BookOpen,
    roles: ALL_ROLES,
  },
  {
    label: "Page 3",
    href: "/page-3",
    icon: Users,
    roles: ALL_ROLES,
  },  // [GENERATOR-INSERTION-POINT]
];
