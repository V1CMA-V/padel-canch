"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"

type SignInGoogleButtonClubProps = {
  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "xs"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
}

export function SignInGoogleButtonClub({
  size = "sm",
}: SignInGoogleButtonClubProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignInWithGoogleClub = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/club-callback",
      })
    })
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={handleSignInWithGoogleClub}
      disabled={isPending}
    >
      {isPending ? "Abriendo Google..." : "Registrar club con Google"}
    </Button>
  )
}
