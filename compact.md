# Collaboration Flow & Rules (Compact)

This file summarizes how the assistant should work with the owner of this project. It is specific to this repo and complements `AGENTS.md`.

## Core Behavior

- Only perform actions that the user explicitly asks for.
- Do not proactively “improve”, refactor, or redesign anything unless the user clearly requests it.
- If something requires an assumption (behavior, UX, data, naming, layout, animations), stop and ask the user or offer clear options for them to choose from.
- Keep every change as small and targeted as possible to the specific request.

## Decision & UX Flow

- For any non-trivial UI or behavior change:
  - Describe 1–2 concrete options.
  - Wait for the user to pick one before editing code.
- When the user says “do what you think is better”, treat that as permission only within the scope just discussed (do not generalize it to other areas).
- Preserve existing visual style, layout, and tone of the app unless the user explicitly asks to change them.

## PWA & Animations (Current State)

- PWA:
  - Manifest is defined in `src/app/manifest.ts` (icons must exist in `public/`).
  - Service worker is registered only in production via `PwaRegister` (`src/app/pwa-register.tsx`).
- Bottom sheets (`SheetContent` with `side="bottom"`):
  - Use custom CSS in `globals.css` (`sheet-bottom`, `sheetSlideUp`, `sheetSlideDown`) for smooth slide animations.
  - Overlay uses blurred, lightly tinted background, with custom in/out blur animations.
- When adjusting animations:
  - Avoid extra snaps or jumps (watch for focus/scroll effects).
  - Prefer subtle, smooth transitions over complex new motion.

## Dashboard Behaviors (Key Points)

- Recent Transactions:
  - Shows last 10 transactions from `recentTransactions`.
  - Card has fixed height with internal vertical scroll, and right padding to avoid scrollbar overlapping content.
  - Each row shows `Category-Note`, amount (green for income, red for expense), date/time, and wallet name.
- Spending Insights:
  - W/M/Y buttons:
    - W = current calendar week (Sunday–Saturday).
    - M = current calendar month.
    - Y = current calendar year.
  - For each range, sum expenses per category and show as full-width bars with the total amount on the right.
  - If a range has no data, fall back to overall `spendingByCategory` so the card never looks empty in demo mode.

## Error Handling & Types

- Keep TypeScript strict:
  - Avoid implicit `any`; add minimal inline types where needed.
  - Ensure all new hooks have correct dependency arrays.
- If a change causes TypeScript/ESLint errors:
  - Fix them immediately and only in relation to the requested change.

## How to Use This

- When starting a new change in this repo, skim this file and `AGENTS.md`.
- Follow this collaboration pattern unless the user explicitly overrides it in the current conversation.

codex resume 019a98cb-37dd-75b0-841e-1cc42fc2c170