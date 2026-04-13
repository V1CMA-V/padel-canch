import { NewTournamentForm } from "@/components/forms/newTournament"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export default async function NewTournamentPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const clubProfile = await prisma.club.findUnique({
    where: { ownerUserId: session?.user?.id as string },
  })

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-1 rounded-xl border bg-muted/30 p-4">
        <h2 className="text-xl font-semibold text-foreground">Nuevo torneo</h2>
        <p className="text-sm text-muted-foreground">
          Crea un torneo con los datos requeridos por la base de datos.
        </p>
      </header>

      {clubProfile && <NewTournamentForm clubProfile={clubProfile} />}
      {!clubProfile && (
        <p className="text-sm text-muted-foreground">
          No encontramos tu club todavia.
        </p>
      )}
    </div>
  )
}
