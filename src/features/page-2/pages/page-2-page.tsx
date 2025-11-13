export default function Page2Feature() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-card">
      <div className="w-full max-w-xl flex flex-col items-center gap-6 p-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <span className="text-2xl font-bold text-primary">2</span>
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">Page 2</h2>
        </div>
        <p className="text-muted-foreground text-center">
          This is a beautiful starter page. Use this as a template for your own content and layouts.<br />
          <span className="text-xs text-muted-foreground">Edit <code>src/features/page-2/pages/page-2-page.tsx</code> to get started.</span>
        </p>
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-left">
            <h3 className="mb-1 font-medium">Section Example</h3>
            <p className="text-sm text-muted-foreground">
              You can add cards, forms, tables, or any UI here. This is a flexible layout for your next feature.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 text-left">
            <h3 className="mb-1 font-medium">Quick Tips</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Use Tailwind utility classes for rapid design.</li>
              <li>Organize your components in <code>src/components</code>.</li>
              <li>Update navigation in <code>src/config/navigation.ts</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
