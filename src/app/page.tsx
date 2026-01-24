import { ArrowRight, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="container flex flex-col items-center gap-8 px-4 py-16 text-center">
        {/* Hero Badge */}
        <div className="rounded-full border-2 border-border bg-input-background p-4 shadow-neo-sm">
          <Wallet className="h-12 w-12 text-secondary-foreground" />
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl">
          Amar Taka
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl text-xl font-medium text-muted-foreground sm:text-2xl">
          Offline-first personal finance tracker. Track wallets, log expenses, and
          manage categories with a simple, neo-brutalist design.
        </p>

        {/* CTA Button */}
        <div className="mt-4">
          <Button
            asChild
            size="lg"
            className="gap-2 rounded-xl border-2 border-border bg-sidebar-primary px-8 py-6 text-lg font-bold text-sidebar-primary-foreground shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-primary"
          >
            <Link href="/dashboard">
              Open Dashboard
              <ArrowRight className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
