import type { NavGroup } from "@/components/layout/club-sidebar"
import { ClubSidebar } from "@/components/layout/club-sidebar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

type ClubLayoutProps = {
  children: ReactNode
}

const clubNavGroups: NavGroup[] = [
  {
    label: "General",
    items: [
      {
        href: "/clubs",
        label: "Dashboard",
        iconKey: "dashboard",
        description: "Vista general de tu club.",
      },
    ],
  },
  {
    label: "Gestión deportiva",
    items: [
      {
        href: "/clubs/tournaments",
        label: "Torneos",
        iconKey: "tournaments",
        description: "Crea y administra torneos.",
      },
      // {
      //   href: "/clubs/categories",
      //   label: "Categorías",
      //   iconKey: "categories",
      //   description: "Define categorías para tus torneos.",
      // },
      {
        href: "/clubs/registrations",
        label: "Inscripciones",
        iconKey: "registrations",
        description: "Revisa y aprueba inscripciones.",
      },
      {
        href: "/clubs/matches",
        label: "Partidos",
        iconKey: "matches",
        description: "Programa y gestiona partidos.",
      },
      {
        href: "/clubs/teams",
        label: "Equipos",
        iconKey: "teams",
        description: "Consulta los equipos inscritos.",
      },
    ],
  },
  {
    label: "Comunidad",
    items: [
      {
        href: "/clubs/players",
        label: "Jugadores",
        iconKey: "players",
        description: "Jugadores registrados en tus torneos.",
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      {
        href: "/clubs/settings",
        label: "Mi club",
        iconKey: "club",
        description: "Datos y perfil del club.",
      },
      {
        href: "/clubs/settings/preferences",
        label: "Preferencias",
        iconKey: "settings",
        description: "Ajustes generales de la cuenta.",
      },
    ],
  },
]

export default async function ClubLayout({ children }: ClubLayoutProps) {
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

  if (user?.role !== "CLUB") {
    redirect("/")
  }

  return (
    <section className="container mx-auto min-h-svh px-4 py-6 md:py-8">
      <div className="mb-6 rounded-2xl border bg-linear-to-r from-primary/10 via-muted/50 to-muted/20 p-6">
        <p className="text-xs font-semibold tracking-wide text-primary/80 uppercase">
          Panel de club
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
          Hola, {session.user.name?.split(" ")[0] ?? "club"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Gestiona torneos, categorías, inscripciones y toda la actividad de tu
          club desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ClubSidebar groups={clubNavGroups} />

        <div className="rounded-2xl border bg-card p-4 shadow-sm md:p-6">
          {children}
        </div>
      </div>
    </section>
  )
}
