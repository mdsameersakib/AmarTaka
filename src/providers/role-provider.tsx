"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import type { AppRole } from "@/types/roles";
import { DEFAULT_APP_ROLE, APP_ROLES } from "@/types/roles";

export interface RoleContextValue {
  role: AppRole;
  setRole: (role: AppRole) => void;
  cycleRole: () => void;
}

export const RoleContext = createContext<RoleContextValue | undefined>(
  undefined,
);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>(DEFAULT_APP_ROLE);

  const cycleRole = useCallback(() => {
    setRole((current) => {
      const roles =
        typeof APP_ROLES !== "undefined" ? APP_ROLES : [DEFAULT_APP_ROLE];
      const idx = roles.indexOf(current);
      return roles[(idx + 1) % roles.length];
    });
  }, []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      cycleRole,
    }),
    [role, cycleRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
