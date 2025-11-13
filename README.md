
# Project Template
**Status**: 🟡 In Development

## Overview
This is a modern, feature-based Next.js starter template. It provides a scalable structure for building multi-role, multi-page web applications with clean separation of features and shared code.

## Folder Structure

```
src/
	app/
		(app)/
			page-1/page.tsx      # Thin wrapper, renders feature page
			page-2/page.tsx
			page-3/page.tsx
		(auth)/                # Auth routes
	components/              # Shared UI components
	config/                  # Navigation and config
	features/
		page-1/
			components/
			hooks/
			lib/
			pages/page-1-page.tsx
			constants.ts
			types.ts
			index.ts
			README.md
			__tests__/
		page-2/
		page-3/
		auth/
	hooks/                   # Shared hooks
	providers/               # Context providers
	types/                   # Shared types
```

## How to Add a New Page/Feature
1. Duplicate one of the `features/page-*` folders and rename it (e.g., `features/your-feature`).
2. Add your main page component in `features/your-feature/pages/your-feature-page.tsx`.
3. Create a route wrapper in `src/app/(app)/your-feature/page.tsx`:
	 ```tsx
	 import YourFeaturePage from "@/features/your-feature/pages/your-feature-page";
	 export default function YourFeatureRoute() {
		 return <YourFeaturePage />;
	 }
	 ```
4. Add a navigation entry in `src/config/navigation.ts`.

## How to Add a New Role
1. Edit `src/types/roles.ts` and add your new role to the `AppRole` union and `APP_ROLES` array.
2. The role switcher will automatically include your new role.
3. Use the `useRole()` hook in client components to access the current role.

## Development
- Run `pnpm dev` to start the local server.
- Run `pnpm lint` and `pnpm format` for code quality.
- Add tests in each feature’s `__tests__` folder.

## Contributing
- Keep all feature code self-contained in its own folder.
- Only use shared code from `src/components`, `src/hooks`, `src/lib`, `src/providers`, or `src/types`.
- Update documentation as you add new features or roles.

---
For more details, see the comments in each folder and the `FEATURE_ARCHITECTURE.md` file.
