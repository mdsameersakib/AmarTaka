import { AppSidebar } from "@/components/layout/app-sidebar";
import { Card } from "@/components/ui/card";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-[1800px] gap-6">
        {/* Sidebar Card */}
        <Card className="w-72 flex-shrink-0 overflow-hidden rounded-3xl border border-border/30 shadow-xl">
          <AppSidebar />
        </Card>

        {/* Main Content Card */}
        <Card className="flex-1 overflow-hidden rounded-3xl border border-border/30 shadow-xl">
          <div className="h-full overflow-y-auto">{children}</div>
        </Card>
      </div>
    </div>
  );
}
