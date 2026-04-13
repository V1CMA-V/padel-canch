import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconChevronRight,
  IconCircleCheck,
  IconClipboardList,
  IconClock,
  IconPlayerPlay,
  IconPlus,
  IconTournament,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react"
import Link from "next/link"

const kpis = [
  {
    label: "Torneos activos",
    value: "3",
    change: "+1 este mes",
    icon: IconTournament,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    label: "Partidos esta semana",
    value: "12",
    change: "4 hoy",
    icon: IconCalendarEvent,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    label: "Inscripciones pendientes",
    value: "8",
    change: "3 nuevas",
    icon: IconClipboardList,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    label: "Jugadores registrados",
    value: "156",
    change: "+12 este mes",
    icon: IconUsers,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
]

const pendingActions = [
  {
    label: "8 inscripciones por revisar",
    href: "/clubs/registrations",
    icon: IconClipboardList,
    priority: "high" as const,
  },
  {
    label: "3 partidos sin resultado cargado",
    href: "/clubs/matches",
    icon: IconCalendarEvent,
    priority: "medium" as const,
  },
  {
    label: "Definir llaves del Torneo Primavera",
    href: "/clubs/tournaments",
    icon: IconTournament,
    priority: "medium" as const,
  },
]

const activeTournaments = [
  {
    name: "Copa Primavera 2026",
    status: "En curso",
    teams: 16,
    category: "A",
    progress: 65,
  },
  {
    name: "Liga Nocturna Abril",
    status: "Inscripciones",
    teams: 10,
    category: "B",
    progress: 30,
  },
  {
    name: "Torneo Relámpago",
    status: "En curso",
    teams: 8,
    category: "C",
    progress: 80,
  },
]

const upcomingMatches = [
  {
    teamA: "Martínez / López",
    teamB: "García / Ruiz",
    tournament: "Copa Primavera",
    time: "Hoy, 18:00",
    court: "Cancha 1",
  },
  {
    teamA: "Pérez / Sánchez",
    teamB: "Torres / Díaz",
    tournament: "Copa Primavera",
    time: "Hoy, 19:30",
    court: "Cancha 2",
  },
  {
    teamA: "Romero / Castro",
    teamB: "Flores / Morales",
    tournament: "Liga Nocturna",
    time: "Mañana, 20:00",
    court: "Cancha 1",
  },
  {
    teamA: "Herrera / Medina",
    teamB: "Vargas / Ríos",
    tournament: "Liga Nocturna",
    time: "Mañana, 21:30",
    court: "Cancha 3",
  },
]

const recentActivity = [
  {
    text: "Martínez / López ganaron 6-3 6-4 vs García / Ruiz",
    time: "Hace 2 horas",
    icon: IconTrophy,
  },
  {
    text: "Nueva inscripción: equipo Pérez / Sánchez en Copa Primavera",
    time: "Hace 4 horas",
    icon: IconUsersGroup,
  },
  {
    text: "Torneo Relámpago avanzó a semifinales",
    time: "Hace 6 horas",
    icon: IconPlayerPlay,
  },
  {
    text: "Se programaron 4 partidos para mañana",
    time: "Hace 8 horas",
    icon: IconCalendarEvent,
  },
  {
    text: "Liga Nocturna Abril abierta para inscripciones",
    time: "Hace 1 día",
    icon: IconTournament,
  },
]

const priorityStyles = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-chart-3/10 text-chart-3",
} as const

export default function ClubsPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Resumen de la actividad de tu club
          </p>
        </div>
        <Button asChild>
          <Link href="/clubs/tournaments/new">
            <IconPlus data-icon="inline-start" className="size-4" />
            Crear torneo
          </Link>
        </Button>
      </div>

      {/* ── KPIs ── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${kpi.bg}`}>
                <kpi.icon className={`size-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="text-2xl leading-tight font-semibold text-foreground">
                  {kpi.value}
                </p>
                <p className="truncate text-[11px] text-muted-foreground/70">
                  {kpi.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Acciones pendientes ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <IconAlertTriangle className="size-4 text-chart-3" />
            Acciones pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {pendingActions.map((action) => (
              <li key={action.label} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={action.href}
                  className="group/action flex items-center gap-3 transition-colors"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${priorityStyles[action.priority]}`}
                  >
                    <action.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground group-hover/action:text-primary">
                    {action.label}
                  </span>
                  <IconChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover/action:translate-x-0.5 group-hover/action:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ── Torneos activos + Próximos partidos ── */}
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Torneos activos */}
        <Card size="sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <IconTournament className="size-4 text-chart-1" />
              Torneos activos
            </CardTitle>
            <CardAction>
              <Button variant="ghost" size="xs" asChild>
                <Link href="/clubs/tournaments">Ver todos</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {activeTournaments.map((t) => (
                <li key={t.name} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {t.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Cat. {t.category} &middot; {t.teams} equipos
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        t.status === "En curso"
                          ? "bg-chart-1/10 text-chart-1"
                          : "bg-chart-2/10 text-chart-2"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  {/* progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Próximos partidos */}
        <Card size="sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <IconCalendarEvent className="size-4 text-chart-2" />
              Próximos partidos
            </CardTitle>
            <CardAction>
              <Button variant="ghost" size="xs" asChild>
                <Link href="/clubs/matches">Ver todos</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {upcomingMatches.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-[10px] leading-tight font-medium text-muted-foreground">
                    <IconClock className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {m.teamA}{" "}
                      <span className="text-muted-foreground">vs</span>{" "}
                      {m.teamB}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {m.tournament} &middot; {m.court}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {m.time}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ── Actividad reciente ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <IconCircleCheck className="size-4 text-primary" />
            Actividad reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {recentActivity.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <a.icon className="size-3.5 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
