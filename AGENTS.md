# Repository Guidelines

• - Routes / shell layout: App Router groups (app) and (auth) with the main shell
in src/app/(app)/layout.tsx:1 (renders MoneyHeader) and providers in src/app/
layout.tsx:1 (RoleProvider + MoneyProvider).
- Navigation: Header tabs are driven by src/config/navigation.ts:1 and rendered
in src/components/layout/money-header.tsx:1 (/dashboard, /transactions, /
settings).
- Dashboard (/dashboard): Route shell src/app/(app)/dashboard/page.tsx:1 mounts
src/features/dashboard/pages/dashboard-page.tsx:1, which composes totals (3
SummaryCards), wallets (long-press to delete), recent transactions, spending
insights (W/M/Y), monthly trend, recurring list + reset, plus FAB → type
picker → bottom sheet transaction form (AddTransactionSheet).
- Transactions (/transactions): src/features/transactions/pages/transactions-
page.tsx:1 pulls allTransactions from useMoney(), applies filters (date/note/
type/wallet/category), and paginates with an infinite-scroll trigger.
- Settings (/settings): src/features/settings/pages/settings-page.tsx:1 toggles
showCents, manages categories + wallets, shows recurring, and exposes “reset
demo data”.
- State/data model: All money data is offline-first in src/providers/money-
provider.tsx:1 (localStorage key amarTakaData_v3), with derived totals/trend/
category spend computed via src/services/analytics-service.ts:1 and mutations
via src/services/transaction-service.ts:1.


## Collaboration Rules for This Repo
- The assistant must **only perform actions explicitly requested by the user**. No proactive refactors, design changes, or “improvements” unless the user directly asks for them.
- If a task would require an assumption (about behavior, UX, data, naming, etc.), the assistant must **stop and ask clarifying questions or offer concrete options for the user to choose from** before making changes.
- The assistant must **avoid changing existing visual design** (spacing, colors, layout, animations) except where the user has requested a specific change and agreed to the concrete implementation approach.
- When there are multiple reasonable implementation options, the assistant should **present the options briefly and wait for the user’s explicit choice** before editing code.
- All behavior changes should be **as small and targeted as possible**, touching only the files and logic directly related to the user’s request.
