export default function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-card">
      <div className="w-full max-w-xl flex flex-col items-center gap-6 p-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <span className="text-2xl font-bold text-primary">S</span>
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">Settings</h2>
        </div>
        <p className="text-muted-foreground text-center">
          This is a settings page template. Add your settings UI and logic here.<br />
          <span className="text-xs text-muted-foreground">Edit <code>src/features/settings/pages/settings-page.tsx</code> to get started.</span>
        </p>
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-left">
            <h3 className="mb-1 font-medium">Section Example</h3>
            <p className="text-sm text-muted-foreground">
              Add forms, toggles, or any settings UI here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
