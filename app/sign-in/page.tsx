"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();

  const handleSignInWithGoogle = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/role-callback",
      });
    });
  };

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="w-full max-w-md rounded-lg border bg-card p-6">
        <h1 className="text-xl font-semibold">Iniciar sesion</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accede a tu cuenta usando Google.
        </p>

        <Button
          type="button"
          className="mt-6 w-full"
          onClick={handleSignInWithGoogle}
          disabled={isPending}
        >
          {isPending ? "Redirigiendo..." : "Continuar con Google"}
        </Button>
      </section>
    </main>
  );
}
