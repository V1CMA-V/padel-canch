import { SignInGoogleButton } from "@/components/auth/sign-in-google-button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { SignInGoogleButtonClub } from "../auth/sign-in-google-button-club"

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-medium">
          Padel Canch
        </Link>

        {session?.user ? (
          <span className="text-sm text-muted-foreground">
            {session.user.name || session.user.email}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <SignInGoogleButton />
            <SignInGoogleButtonClub />
          </div>
        )}
      </div>
    </header>
  )
}
