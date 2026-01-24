# Amar Taka - Project Vision & Architecture

## 1. Product Overview
**Amar Taka** (Bengali for "My Money") is a robust, offline-first personal finance tracker designed for the modern user who values speed, privacy, and simplicity. Built with a distinctive "Neobrutalist" aesthetic, it treats financial data as a first-class citizen—accessible instantly, anywhere, without requiring an internet connection.

## 2. Core Philosophy
*   **Offline First:** The app is a Progressive Web App (PWA) that installs on devices and works 100% offline. Data is persisted locally (LocalStorage), ensuring zero latency.
*   **Privacy Centric:** No data leaves the user's device. There is no cloud sync (yet), meaning complete data sovereignty.
*   **Data Integrity:** Relationships between Wallets, Categories, and Transactions are strictly enforced. Deleting a wallet or renaming a category intelligently updates the entire dataset.
*   **Modular Architecture:** The codebase is split into distinct layers (UI Components, Feature Logic, Data Services) to allow for seamless future migration to a cloud backend (e.g., Supabase) without rewriting the frontend.

## 3. Key Features

### 📊 Dashboard
The command center of the financial life.
*   **At-a-Glance Stats:** Total Balance, Income, and Expense cards.
*   **Wallet Overview:** Live balances of all accounts (Cash, Bank, Mobile Wallets like Bkash/Nagad).
*   **Quick Actions:** A Floating Action Button (FAB) for instant transaction entry.
*   **Analytics:** Spending by category (Week/Month/Year) and Monthly Trend charts.
*   **Recurring:** Tracking of subscriptions (Netflix, Rent) and bills.

### 📝 Transactions
The ledger of truth.
*   **Smart Filtering:** Filter by Date (Single/Range), Type (Income/Expense), Wallet, or Category.
*   **Infinite Scroll:** Efficiently browse thousands of records without performance hits.
*   **Search:** Instant text search across notes and metadata.

### ⚙️ Settings & Management
Control over the data model.
*   **Wallet Management:** Add custom wallets. **Smart Delete** functionality asks users to cascade delete or move transactions when removing a wallet.
*   **Category Management:** Add custom categories. **Smart Rename** ensures past transactions are updated when a category name changes.
*   **Data Safety:** "Danger Zone" to reset demo data for testing.
*   **PWA Install:** Fully installable as a standalone app on iOS and Android.

## 4. Technical Architecture

### Tech Stack
*   **Framework:** Next.js 16 (App Router)
*   **Styling:** Tailwind CSS v4 (Neobrutalist Design System)
*   **State Management:** React Context + Hooks
*   **PWA Engine:** `@serwist/next` (Service Workers, Manifest, Caching)

### Data Layer (Service Pattern)
Business logic is decoupled from UI via stateless services:
*   `TransactionService`: CRUD + Complex updates (e.g., `updateWalletName`).
*   `WalletService`: Wallet lifecycle management.
*   `CategoryService`: Category lifecycle management + Renaming logic.
*   `AnalyticsService`: Pure functions for calculating trends and totals.

### Directory Structure
```
src/
├── app/                 # Routes & PWA Manifest/SW
├── components/          # Shared UI (Neo-styled)
├── features/            # Feature Modules
│   ├── dashboard/       # Dashboard Logic & Dialogs
│   ├── transactions/    # Transaction List & Filters
│   ├── settings/        # Management Logic
│   └── auth/            # (Placeholder for future auth)
├── services/            # Business Logic (The "Brain")
├── providers/           # State Containers (The "Glue")
└── types/               # TypeScript Definitions
```

## 5. Future Roadmap
*   **Cloud Sync:** Connect the Service Layer to a Supabase backend.
*   **Auth:** Enable multi-device sync via user accounts.
*   **Export:** CSV/PDF export of transaction history.
