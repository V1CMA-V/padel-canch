import { notFound } from "next/navigation"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconCircleCheck,
  IconClock,
  IconMapPin,
  IconPhone,
  IconTournament,
  IconTrophy,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/db"

type Props = {
  params: Promise<{ slug: string }>
}

async function getClubBySlug(slug: string) {
  const club = await prisma.club.findUnique({
    where: { slug },
    include: {
      tournaments: {
        where: {
          visibility: "PUBLIC",
          status: { not: "DRAFT" },
        },
        orderBy: { startDate: "desc" },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              gender: true,
              level: true,
              maxTeams: true,
              registrationFee: true,
              status: true,
              _count: { select: { teams: true } },
            },
          },
        },
      },
    },
  })

  return club
}

const tournamentStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline"; className: string }
> = {
  REGISTRATION_OPEN: {
    label: "Inscripciones abiertas",
    variant: "secondary",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  REGISTRATION_CLOSED: {
    label: "Inscripciones cerradas",
    variant: "outline",
    className: "",
  },
  IN_PROGRESS: {
    label: "En curso",
    variant: "default",
    className: "",
  },
  FINISHED: {
    label: "Finalizado",
    variant: "outline",
    className: "text-muted-foreground",
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "outline",
    className: "text-muted-foreground line-through",
  },
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function formatDateRange(start: Date, end: Date) {
  const s = formatDate(start)
  const e = formatDate(end)
  return `${s} — ${e}`
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const club = await getClubBySlug(slug)
  if (!club) return { title: "Club no encontrado" }

  const location = [club.city, club.state, club.country]
    .filter(Boolean)
    .join(", ")

  return {
    title: `${club.name} | Padel Canch`,
    description:
      club.description ||
      `Perfil público de ${club.name}${location ? ` en ${location}` : ""}. Torneos, categorías y más.`,
  }
}

export default async function PublicClubPage({ params }: Props) {
  const { slug } = await params
  const club = await getClubBySlug(slug)

  if (!club) notFound()

  const location = [club.city, club.state, club.country]
    .filter(Boolean)
    .join(", ")

  const activeTournaments = club.tournaments.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "REGISTRATION_OPEN"
  )
  const pastTournaments = club.tournaments.filter(
    (t) => t.status === "FINISHED"
  )
  const otherTournaments = club.tournaments.filter(
    (t) =>
      t.status !== "IN_PROGRESS" &&
      t.status !== "REGISTRATION_OPEN" &&
      t.status !== "FINISHED"
  )

  const totalTeams = club.tournaments.reduce(
    (sum, t) =>
      sum +
      t.categories.reduce((catSum, c) => catSum + c._count.teams, 0),
    0
  )

  return (
    <div className="min-h-svh">
      {/* Hero */}
      <section className="border-b bg-linear-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-10 md:pb-14 md:pt-14">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {/* Logo */}
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border bg-card text-2xl font-bold text-primary shadow-sm md:size-24">
              {club.logoUrl ? (
                <img
                  src={club.logoUrl}
                  alt={club.name}
                  className="size-full rounded-2xl object-cover"
                />
              ) : (
                club.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                  {club.name}
                </h1>
                {club.isVerified && (
                  <IconCircleCheck className="size-5 shrink-0 text-primary" />
                )}
              </div>

              {club.description && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  {club.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {location && (
                  <span className="flex items-center gap-1.5">
                    <IconMapPin className="size-4 shrink-0" />
                    {location}
                  </span>
                )}
                {club.phone && (
                  <span className="flex items-center gap-1.5">
                    <IconPhone className="size-4 shrink-0" />
                    {club.phone}
                  </span>
                )}
                {club.website && (
                  <a
                    href={club.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-primary"
                  >
                    <IconWorld className="size-4 shrink-0" />
                    Sitio web
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-card px-4 py-3 text-center">
              <p className="text-xl font-semibold text-foreground md:text-2xl">
                {club.tournaments.length}
              </p>
              <p className="text-xs text-muted-foreground">Torneos</p>
            </div>
            <div className="rounded-xl border bg-card px-4 py-3 text-center">
              <p className="text-xl font-semibold text-foreground md:text-2xl">
                {activeTournaments.length}
              </p>
              <p className="text-xs text-muted-foreground">Activos</p>
            </div>
            <div className="rounded-xl border bg-card px-4 py-3 text-center">
              <p className="text-xl font-semibold text-foreground md:text-2xl">
                {totalTeams}
              </p>
              <p className="text-xs text-muted-foreground">Equipos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="space-y-10">
          {/* Active / Open tournaments */}
          {activeTournaments.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <IconTournament className="size-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Torneos activos
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeTournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </div>
          )}

          {/* Other tournaments (registration closed, etc.) */}
          {otherTournaments.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <IconClock className="size-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">
                  Próximos torneos
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {otherTournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </div>
          )}

          {/* Past tournaments */}
          {pastTournaments.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <IconTrophy className="size-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">
                  Torneos finalizados
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {pastTournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {club.tournaments.length === 0 && (
            <div className="py-16 text-center">
              <IconTournament className="mx-auto size-10 text-muted-foreground/40" />
              <p className="mt-4 text-sm text-muted-foreground">
                Este club aún no tiene torneos públicos.
              </p>
            </div>
          )}

          {/* Club info footer */}
          {(club.address || club.website) && (
            <>
              <Separator />
              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Información del club
                </h2>
                <Card size="sm">
                  <CardContent>
                    <dl className="grid gap-4 sm:grid-cols-2">
                      {club.address && (
                        <div>
                          <dt className="text-xs font-medium text-muted-foreground">
                            Dirección
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">
                            {club.address}
                          </dd>
                        </div>
                      )}
                      {location && (
                        <div>
                          <dt className="text-xs font-medium text-muted-foreground">
                            Ciudad
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">
                            {location}
                          </dd>
                        </div>
                      )}
                      {club.phone && (
                        <div>
                          <dt className="text-xs font-medium text-muted-foreground">
                            Teléfono
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">
                            {club.phone}
                          </dd>
                        </div>
                      )}
                      {club.website && (
                        <div>
                          <dt className="text-xs font-medium text-muted-foreground">
                            Sitio web
                          </dt>
                          <dd className="mt-1 text-sm">
                            <a
                              href={club.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {club.website.replace(/^https?:\/\//, "")}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

type TournamentWithCategories = Awaited<
  ReturnType<typeof getClubBySlug>
> extends { tournaments: infer T } | null
  ? T extends (infer U)[]
    ? U
    : never
  : never

function TournamentCard({
  tournament: t,
}: {
  tournament: TournamentWithCategories
}) {
  const statusCfg = tournamentStatusConfig[t.status] ?? {
    label: t.status,
    variant: "outline" as const,
    className: "",
  }

  const totalTeams = t.categories.reduce((s, c) => s + c._count.teams, 0)
  const totalSlots = t.categories.reduce(
    (s, c) => s + (c.maxTeams ?? 0),
    0
  )

  const genderLabels: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
    OPEN: "Abierto",
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="leading-snug">{t.name}</CardTitle>
          <Badge variant={statusCfg.variant} className={statusCfg.className}>
            {statusCfg.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Date & venue */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconCalendarEvent className="size-4 shrink-0" />
            <span>{formatDateRange(t.startDate, t.endDate)}</span>
          </div>
          {(t.venueName || t.venueAddress) && (
            <div className="flex items-center gap-2">
              <IconMapPin className="size-4 shrink-0" />
              <span>
                {[t.venueName, t.venueAddress].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}
          {totalSlots > 0 && (
            <div className="flex items-center gap-2">
              <IconUsers className="size-4 shrink-0" />
              <span>
                {totalTeams} / {totalSlots} equipos
              </span>
            </div>
          )}
        </div>

        {t.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {t.description}
          </p>
        )}

        {/* Categories */}
        {t.categories.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Categorías
            </p>
            <div className="flex flex-wrap gap-1.5">
              {t.categories.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {c.name}
                  {c.gender !== "OPEN" && (
                    <span className="text-[10px] opacity-60">
                      ({genderLabels[c.gender] ?? c.gender})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {t.status === "REGISTRATION_OPEN" && (
        <CardFooter>
          <Button size="sm" className="w-full" asChild>
            <Link href={`/c/${t.slug ?? t.id}`}>Ver torneo e inscribirse</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
