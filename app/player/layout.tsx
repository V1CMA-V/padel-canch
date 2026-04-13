import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

type PlayerLayoutProps = {
  children: ReactNode
}

const playerNavigation = [
  {
    href: "/player",
    label: "Perfil",
    description: "Resumen de tu cuenta y actividad.",
  },
  {
    href: "/player/tournaments",
    label: "Torneos",
    description: "Revisa tus torneos inscritos.",
  },
  {
    href: "/player/matches",
    label: "Partidos",
    description: "Consulta tus partidos jugados.",
  },
  {
    href: "/player/notifications",
    label: "Notificaciones",
    description: "Mantente al día con notificaciones importantes.",
  },
  {
    href: "/player/settings",
    label: "Configuración",
    description: "Personaliza tus datos y preferencias.",
  },
]

export default async function PlayerLayout({ children }: PlayerLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "PLAYER") {
    redirect("/")
  }

  return (
    <section className="container mx-auto min-h-svh px-4 py-6 md:py-8">
      <div className="mb-6 rounded-2xl border bg-linear-to-r from-muted/70 to-muted/20 p-6">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Zona de jugador
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
          Hola, {session.user.name?.split(" ")[0] ?? "jugador"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Gestiona tu perfil, reservas, partidos y ajustes desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border bg-card p-3 shadow-sm lg:sticky lg:top-6">
          <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {playerNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-transparent bg-muted/40 p-3 transition-colors hover:border-primary/20 hover:bg-primary/5"
              >
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="rounded-2xl border bg-card p-4 shadow-sm md:p-6">
          {children}
        </div>
      </div>
    </section>
  )
}
