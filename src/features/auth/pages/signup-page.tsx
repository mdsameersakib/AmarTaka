"use client";

import { useRouter } from "next/navigation";

export function SignupPage() {
  const router = useRouter();

  if (typeof window !== "undefined") {
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-card p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join Poralikha today
          </p>
        </div>
        <div className="text-center text-muted-foreground">
          Signup form coming soon...
        </div>
      </div>
    </div>
  );
}
