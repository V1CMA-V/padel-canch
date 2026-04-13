import { ClubForm } from "@/components/forms/clubInfo"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export default async function ClubSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const clubProfile = await prisma.club.findUnique({
    where: { ownerUserId: session?.user?.id as string },
  })

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-1 rounded-xl border bg-muted/30 p-4">
        <h2 className="text-xl font-semibold text-foreground">Configuracion</h2>
        <p className="text-sm text-muted-foreground">
          Actualiza la informacion de tu club.
        </p>
      </header>

      {/* Formulario para actualizar los datos del club */}
      {clubProfile && <ClubForm clubProfile={clubProfile} />}
      {!clubProfile && (
        <p className="text-sm text-muted-foreground">
          No encontramos tu club todavia.
        </p>
      )}
    </div>
  )
}
