# Repository Guidelines

## MCP & Tooling Expectations
- Context7, Supabase, and Chrome DevTools MCP servers are preconfigured; assume they are reachable even when `list_mcp_resources` or `list_mcp_resource_templates` return empty lists.
- When you need framework/library docs, immediately call `resolve-library-id` followed by `get-library-docs` -- don't wait for the user to request it and don't treat empty resource lists as a failure.
- If you're unsure whether a tool is available, run `/mcp` (or list servers) rather than assuming it's offline; prioritize using these tools whenever you're blocked or need additional context.
- Document in your notes/plan when you pull Context7 docs so future debugging knows which references informed the work.

## Project Structure & Module Organization
The repo is a feature-first Next.js 16 template. Keep route shells in `src/app/(app)/<feature>/page.tsx` that import the main feature page from `src/features/<feature>/pages`. Every feature folder already contains `components`, `hooks`, `lib`, `pages`, and `__tests__`; avoid leaking feature-specific logic elsewhere. Shared UI and stateful helpers live in `src/components`, `src/hooks`, `src/providers`, and `src/types`, while configuration such as navigation and roles sits in `src/config`. Static assets go in `public`, and automation lives in `scripts/`.

## Build, Test, and Development Commands
- `pnpm dev` - run the Next dev server with fast refresh.
- `pnpm build` followed by `pnpm start` - produce and preview the optimized production build.
- `pnpm lint` / `pnpm format` - run Biome to enforce lint rules and apply formatting fixes.
- `pnpm generate:feature <name>` and `pnpm generate:role <name>` - scaffold or prune modules through the curated scripts; add `--delete` or `--dry-run` as needed.

## Coding Style & Naming Conventions
Author components in TypeScript/TSX with two-space indentation and single quotes inside JSX props when dynamic values are absent. Prefer functional, server-compatible components and lean route files. Name files and folders with kebab-case (`settings-panel.tsx`), export React components in PascalCase, and keep shared types in `src/types`. Run Biome locally before pushing; handwritten imports should stay path-alias friendly (`@/features/...`).

## Testing Guidelines
Each feature has a dedicated `__tests__` directory; mirror the component structure and suffix files with `.spec.tsx`. We standardize on Vitest + React Testing Library; install if missing and run via `pnpm vitest run`. Aim for coverage on UI logic, hooks, and generators, and document scenarios you intentionally skip. When feasible, collect coverage with `pnpm vitest run --coverage` and attach the summary to your PR.

## Commit & Pull Request Guidelines
Follow the existing history: short, imperative subjects such as "Enhance feature generation script" (<72 chars) with optional body paragraphs for context. Every PR should list the motivation, highlight feature/role changes, link related issues, paste `pnpm lint`/test output, and include screenshots or recordings when UI changes are visible features.

## Automation & Role Setup
Favor the provided generators over manual edits to keep navigation, routing, and union types synchronized. `pnpm generate:feature dashboard` scaffolds `src/features/dashboard` with `components`, `hooks`, `lib`, `pages`, and `__tests__`, drops `.gitkeep` files, adds boilerplate `constants.ts`, `types.ts`, `index.ts`, and a ready-to-style page at `pages/dashboard-page.tsx`, plus a matching route shell in `src/app/(app)/dashboard/page.tsx`. It also inserts a navigation item above the `// [GENERATOR-INSERTION-POINT]` marker so the sidebar stays accurate. `pnpm generate:feature dashboard --delete` tears down those artifacts symmetrically after confirmation. `pnpm generate:role analyst` updates `src/types/roles.ts` by extending the `AppRole` union and `APP_ROLES` array; you can pass `--delete` to remove obsolete roles. Avoid editing `src/config/navigation.ts` or `src/types/roles.ts` manually unless a script cannot model your change, keep `APP_ROLES` alphabetized, and never remove the generator marker so future scaffolding stays idempotent.
