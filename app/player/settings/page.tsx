import { PlayerInfo } from "@/components/forms/playerInfo"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function PlayerSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const playerProfile = await prisma.playerProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-1 rounded-xl border bg-muted/30 p-4">
        <h2 className="text-xl font-semibold text-foreground">Configuracion</h2>
        <p className="text-sm text-muted-foreground">
          Actualiza la informacion de tu perfil de jugador.
        </p>
      </header>

      {/* Formulario para actualizar los datos del jugador */}
      {playerProfile && <PlayerInfo playerProfile={playerProfile} />}
      {!playerProfile && (
        <p className="text-sm text-muted-foreground">
          No encontramos tu perfil de jugador todavia.
        </p>
      )}
    </div>
  )
}
