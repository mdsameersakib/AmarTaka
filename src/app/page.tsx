
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <main className="container flex flex-col items-center gap-8 px-4 py-16 text-center">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary p-3">
            <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Starter Template
          </h1>
        </div>

        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          This is a minimal Next.js starter with a sidebar, role switcher, and three sample pages. Use it as a foundation for your next project.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/page-1">
              Go to Page 1
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 max-w-4xl">
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-2 font-semibold">Sidebar Navigation</h3>
            <p className="text-sm text-muted-foreground">
              Easily add or remove pages from the sidebar by editing <code>src/config/navigation.ts</code>.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-2 font-semibold">Role Switcher</h3>
            <p className="text-sm text-muted-foreground">
              Test different roles and views using the built-in role switcher. Configure roles in <code>src/types/roles.ts</code>.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-2 font-semibold">Ready to Extend</h3>
            <p className="text-sm text-muted-foreground">
              Start building your app by editing the sample pages in <code>src/app/(app)/page-1</code>, <code>page-2</code>, and <code>page-3</code>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
