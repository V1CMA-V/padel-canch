import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

const formatDate = (value: Date | null) => {
  if (!value) return "Sin registrar"
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value)
}

const formatLocation = (
  city: string | null,
  state: string | null,
  country: string | null
) => {
  const parts = [city, state, country].filter(Boolean)
  return parts.length > 0 ? parts.join(", ") : "Sin registrar"
}

export default async function PlayerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const player = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      playerProfile: {
        select: {
          level: true,
          dominantHand: true,
          birthDate: true,
          city: true,
          state: true,
          country: true,
        },
      },
    },
  })

  if (!player) {
    redirect("/sign-in")
  }

  const profile = player.playerProfile

  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-xl border bg-muted/30 p-4">
        <h2 className="text-xl font-semibold text-foreground">Mi perfil</h2>
        <p className="text-sm text-muted-foreground">
          Esta es tu informacion basica como jugador.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase">Nombre</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {player.name}
          </p>
        </article>

        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase">Email</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {player.email}
          </p>
        </article>

        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase">Nivel</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {profile?.level ?? "Sin registrar"}
          </p>
        </article>

        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase">
            Mano dominante
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {profile?.dominantHand ?? "Sin registrar"}
          </p>
        </article>

        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase">
            Fecha de nacimiento
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDate(profile?.birthDate ?? null)}
          </p>
        </article>

        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase">Ubicacion</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatLocation(
              profile?.city ?? null,
              profile?.state ?? null,
              profile?.country ?? null
            )}
          </p>
        </article>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/player/settings"
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Editar perfil
        </Link>
        <Link
          href="/player/matches"
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Ver partidos
        </Link>
      </div>
    </div>
  )
}
