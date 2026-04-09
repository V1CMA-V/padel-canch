"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type SignInGoogleButtonProps = {
  size?: "default" | "sm" | "lg" | "icon" | "xs" | "icon-xs" | "icon-sm" | "icon-lg";
};

export function SignInGoogleButton({ size = "sm" }: SignInGoogleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignInWithGoogle = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    });
  };

  return (
    <Button type="button" size={size} onClick={handleSignInWithGoogle} disabled={isPending}>
      {isPending ? "Abriendo Google..." : "Iniciar sesion"}
    </Button>
  );
}
