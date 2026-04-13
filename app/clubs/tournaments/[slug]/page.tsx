"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCategory,
  IconChevronRight,
  IconCircleCheck,
  IconClock,
  IconCopy,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconFlag,
  IconLock,
  IconPlayerPlay,
  IconPlus,
  IconScoreboard,
  IconSettings,
  IconTournament,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react"
import Link from "next/link"

// ─── Types ───

type TournamentStatus =
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED"

type MatchStatus =
  | "scheduled"
  | "in_progress"
  | "finished"
  | "pending"
  | "walkover"

type CategoryGender = "MALE" | "FEMALE" | "MIXED" | "OPEN"

type Category = {
  id: string
  name: string
  gender: CategoryGender
  level: string | null
  maxTeams: number
  enrolledTeams: number
  matchesPlayed: number
  matchesTotal: number
  status: "active" | "finished" | "pending"
}

type TournamentMatch = {
  id: string
  teamA: string
  teamB: string
  category: string
  phase: string
  date: string | null
  time: string | null
  court: string | null
  status: MatchStatus
  scoreA: string | null
  scoreB: string | null
}

type TournamentData = {
  id: string
  name: string
  slug: string
  description: string | null
  venueName: string
  venueAddress: string
  startDate: string
  endDate: string
  registrationOpenAt: string | null
  registrationCloseAt: string | null
  status: TournamentStatus
  visibility: "PUBLIC" | "PRIVATE"
  categories: Category[]
  totalTeams: number
  maxTeams: number
  totalMatches: number
  matchesPlayed: number
}

// ─── Mock data ───

const tournament: TournamentData = {
  id: "t1",
  name: "Copa Primavera 2026",
  slug: "copa-primavera-2026-20260401",
  description:
    "Torneo abierto de padel para todas las categorías. Formato eliminación directa con fase de grupos.",
  venueName: "Club Padel Central",
  venueAddress: "Av. Libertador 1234, Buenos Aires",
  startDate: "15 Abr 2026",
  endDate: "30 Abr 2026",
  registrationOpenAt: "01 Abr 2026",
  registrationCloseAt: "13 Abr 2026",
  status: "IN_PROGRESS",
  visibility: "PUBLIC",
  categories: [
    {
      id: "c1",
      name: "Categoría A",
      gender: "OPEN",
      level: "Avanzado",
      maxTeams: 8,
      enrolledTeams: 8,
      matchesPlayed: 5,
      matchesTotal: 7,
      status: "active",
    },
    {
      id: "c2",
      name: "Categoría B",
      gender: "OPEN",
      level: "Intermedio",
      maxTeams: 8,
      enrolledTeams: 8,
      matchesPlayed: 4,
      matchesTotal: 7,
      status: "active",
    },
    {
      id: "c3",
      name: "Femenino",
      gender: "FEMALE",
      level: null,
      maxTeams: 8,
      enrolledTeams: 4,
      matchesPlayed: 1,
      matchesTotal: 3,
      status: "active",
    },
  ],
  totalTeams: 20,
  maxTeams: 24,
  totalMatches: 17,
  matchesPlayed: 10,
}

const upcomingMatches: TournamentMatch[] = [
  {
    id: "m1",
    teamA: "Martínez / López",
    teamB: "García / Ruiz",
    category: "A",
    phase: "Cuartos",
    date: "13 Abr 2026",
    time: "18:00",
    court: "Cancha 1",
    status: "scheduled",
    scoreA: null,
    scoreB: null,
  },
  {
    id: "m2",
    teamA: "Pérez / Sánchez",
    teamB: "Torres / Díaz",
    category: "A",
    phase: "Cuartos",
    date: "13 Abr 2026",
    time: "19:30",
    court: "Cancha 2",
    status: "in_progress",
    scoreA: "6-4",
    scoreB: "3-6",
  },
  {
    id: "m3",
    teamA: "Mejía / Serrano",
    teamB: "Duarte / Figueroa",
    category: "A",
    phase: "Cuartos",
    date: "13 Abr 2026",
    time: "21:00",
    court: "Cancha 1",
    status: "scheduled",
    scoreA: null,
    scoreB: null,
  },
  {
    id: "m4",
    teamA: "Guzmán / Paredes",
    teamB: "Ortiz / Navarro",
    category: "B",
    phase: "Cuartos",
    date: null,
    time: null,
    court: null,
    status: "pending",
    scoreA: null,
    scoreB: null,
  },
]

const recentResults: TournamentMatch[] = [
  {
    id: "r1",
    teamA: "Salazar / Rojas",
    teamB: "Campos / Bravo",
    category: "B",
    phase: "Octavos",
    date: "12 Abr 2026",
    time: "19:00",
    court: "Cancha 3",
    status: "finished",
    scoreA: "6-3 7-5",
    scoreB: "3-6 5-7",
  },
  {
    id: "r2",
    teamA: "Reyes / Luna",
    teamB: "Jiménez / Peña",
    category: "A",
    phase: "Octavos",
    date: "12 Abr 2026",
    time: "17:00",
    court: "Cancha 1",
    status: "finished",
    scoreA: "6-2 6-1",
    scoreB: "2-6 1-6",
  },
  {
    id: "r3",
    teamA: "Méndez / Cordero",
    teamB: "Aguirre / Espinoza",
    category: "Fem",
    phase: "Semifinal",
    date: "11 Abr 2026",
    time: "18:00",
    court: "Cancha 1",
    status: "walkover",
    scoreA: "W.O.",
    scoreB: "—",
  },
]

// ─── Config ───

const statusConfig: Record<
  TournamentStatus,
  {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
  }
> = {
  DRAFT: { label: "Borrador", variant: "outline" },
  REGISTRATION_OPEN: { label: "Inscripción abierta", variant: "secondary" },
  REGISTRATION_CLOSED: { label: "Inscripción cerrada", variant: "outline" },
  IN_PROGRESS: { label: "En curso", variant: "default" },
  FINISHED: { label: "Finalizado", variant: "outline" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
}

const matchStatusConfig: Record<
  MatchStatus,
  {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
  }
> = {
  pending: { label: "Pendiente", variant: "outline" },
  scheduled: { label: "Programado", variant: "secondary" },
  in_progress: { label: "En juego", variant: "default" },
  finished: { label: "Finalizado", variant: "outline" },
  walkover: { label: "Walkover", variant: "destructive" },
}

const genderLabels: Record<CategoryGender, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  MIXED: "Mixto",
  OPEN: "Abierto",
}

const categoryStatusConfig: Record<
  Category["status"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Activa", variant: "default" },
  finished: { label: "Finalizada", variant: "outline" },
  pending: { label: "Pendiente", variant: "secondary" },
}

// ─── Derived ───

const noScheduleCount = upcomingMatches.filter((m) => m.date === null).length
const noResultCount = recentResults.filter(
  (m) => m.status === "finished" && m.scoreA === null
).length
const walkoverCount = recentResults.filter(
  (m) => m.status === "walkover"
).length
const lowEnrollment = tournament.categories.filter(
  (c) => c.enrolledTeams < c.maxTeams / 2
)

const attentionItems = [
  noScheduleCount > 0 && {
    label: `${noScheduleCount} ${noScheduleCount === 1 ? "partido" : "partidos"} sin horario asignado`,
    href: "#",
    icon: IconClock,
    color: "bg-chart-3/10 text-chart-3",
  },
  noResultCount > 0 && {
    label: `${noResultCount} ${noResultCount === 1 ? "partido finalizado" : "partidos finalizados"} sin resultado`,
    href: "#",
    icon: IconScoreboard,
    color: "bg-chart-2/10 text-chart-2",
  },
  walkoverCount > 0 && {
    label: `${walkoverCount} walkover${walkoverCount > 1 ? "s" : ""} registrado${walkoverCount > 1 ? "s" : ""}`,
    href: "#",
    icon: IconFlag,
    color: "bg-destructive/10 text-destructive",
  },
  lowEnrollment.length > 0 && {
    label: `${lowEnrollment.length} ${lowEnrollment.length === 1 ? "categoría" : "categorías"} con baja inscripción`,
    href: "#",
    icon: IconUsersGroup,
    color: "bg-chart-3/10 text-chart-3",
  },
].filter(Boolean) as {
  label: string
  href: string
  icon: typeof IconClock
  color: string
}[]

const enrollmentPercent =
  tournament.maxTeams > 0
    ? Math.round((tournament.totalTeams / tournament.maxTeams) * 100)
    : 0

const matchProgress =
  tournament.totalMatches > 0
    ? Math.round((tournament.matchesPlayed / tournament.totalMatches) * 100)
    : 0

// ─── Quick actions ───

const quickActions = [
  {
    label: "Agregar categoría",
    href: "#",
    icon: IconCategory,
    description: "Crea una nueva categoría",
  },
  {
    label: "Programar partido",
    href: "/clubs/matches/new",
    icon: IconCalendarPlus,
    description: "Asigna fecha y cancha",
  },
  {
    label: "Cargar resultado",
    href: "#",
    icon: IconScoreboard,
    description: "Registra el marcador",
  },
  {
    label: "Ver página pública",
    href: `/c/club-padel-central/${tournament.slug}`,
    icon: IconExternalLink,
    description: "Como la ven los jugadores",
  },
  {
    label: "Editar torneo",
    href: "#",
    icon: IconEdit,
    description: "Nombre, fechas, reglas",
  },
  {
    label: "Configuración",
    href: "#",
    icon: IconSettings,
    description: "Opciones avanzadas",
  },
]

// ─── Component ───

export default function TournamentAdminPage() {
  const status = statusConfig[tournament.status]

  const kpis = [
    {
      label: "Equipos",
      value: `${tournament.totalTeams}/${tournament.maxTeams}`,
      sub: `${enrollmentPercent}% inscripción`,
      icon: IconUsersGroup,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
      progress: enrollmentPercent,
    },
    {
      label: "Categorías",
      value: tournament.categories.length,
      sub: `${tournament.categories.filter((c) => c.status === "active").length} activas`,
      icon: IconCategory,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      label: "Partidos",
      value: `${tournament.matchesPlayed}/${tournament.totalMatches}`,
      sub: `${matchProgress}% completados`,
      icon: IconTournament,
      color: "text-primary",
      bg: "bg-primary/10",
      progress: matchProgress,
    },
    {
      label: "Resultados",
      value: tournament.matchesPlayed,
      sub: "cargados",
      icon: IconTrophy,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              {tournament.name}
            </h2>
            <Badge variant={status.variant}>{status.label}</Badge>
            {tournament.visibility === "PUBLIC" ? (
              <Badge variant="outline" className="gap-1 font-normal">
                <IconWorld className="size-3" />
                Público
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 font-normal">
                <IconLock className="size-3" />
                Privado
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconCalendarEvent className="size-3.5" />
              {tournament.startDate} — {tournament.endDate}
            </span>
            {tournament.venueName && (
              <span className="truncate">{tournament.venueName}</span>
            )}
          </div>

          {tournament.description && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {tournament.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/c/club/${tournament.slug}`}>
              <IconEye className="size-4" />
              <span className="hidden sm:inline">Ver pública</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <IconEdit className="size-4" />
                Editar torneo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCopy className="size-4" />
                Copiar link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSettings className="size-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconFlag className="size-4" />
                Cancelar torneo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── KPIs ── */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${kpi.bg}`}>
                <kpi.icon className={`size-4 ${kpi.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="text-xl leading-tight font-semibold text-foreground">
                  {kpi.value}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {kpi.sub}
                </p>
                {kpi.progress !== undefined && (
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Attention block ── */}
      {attentionItems.length > 0 && (
        <Card size="sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <IconAlertTriangle className="size-4 text-chart-3" />
              Requiere atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {attentionItems.map((item) => (
                <li key={item.label} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={item.href}
                    className="group/action flex items-center gap-3 transition-colors"
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                    >
                      <item.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground group-hover/action:text-primary">
                      {item.label}
                    </span>
                    <IconChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover/action:translate-x-0.5 group-hover/action:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ── Categories ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle>Categorías</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <IconPlus className="size-4" />
              Agregar
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Género</TableHead>
                <TableHead className="hidden sm:table-cell">Nivel</TableHead>
                <TableHead>Equipos</TableHead>
                <TableHead className="hidden md:table-cell">Partidos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournament.categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay categorías creadas
                  </TableCell>
                </TableRow>
              ) : (
                tournament.categories.map((cat) => {
                  const catStatus = categoryStatusConfig[cat.status]
                  const fill =
                    cat.maxTeams > 0
                      ? Math.round((cat.enrolledTeams / cat.maxTeams) * 100)
                      : 0

                  return (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">
                          {cat.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {genderLabels[cat.gender]}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {cat.level ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground">
                            {cat.enrolledTeams}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / {cat.maxTeams}
                          </span>
                        </div>
                        <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(fill, 100)}%` }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {cat.matchesTotal > 0 ? (
                          <span className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {cat.matchesPlayed}
                            </span>{" "}
                            / {cat.matchesTotal}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={catStatus.variant}>
                          {catStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <IconDots className="size-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <IconEye className="size-4" />
                              Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconEdit className="size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconUsers className="size-4" />
                              Equipos
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconTournament className="size-4" />
                              Cuadro
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Upcoming matches ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <IconPlayerPlay className="size-4 text-chart-1" />
            Próximos partidos
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" asChild>
              <Link href="/clubs/matches">Ver todos</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead>Cat.</TableHead>
                <TableHead className="hidden sm:table-cell">Fase</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha / Hora
                </TableHead>
                <TableHead className="hidden lg:table-cell">Cancha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMatches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay partidos próximos
                  </TableCell>
                </TableRow>
              ) : (
                upcomingMatches.map((m) => {
                  const mStatus = matchStatusConfig[m.status]
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {m.teamA}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            <span className="mr-1 text-xs text-muted-foreground/60">
                              vs
                            </span>
                            {m.teamB}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                          {m.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {m.phase}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {m.date ? (
                          <div className="text-xs text-muted-foreground">
                            <p>{m.date}</p>
                            <p className="font-medium text-foreground">
                              {m.time}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-chart-3">
                            Sin programar
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {m.court ? (
                          <span className="text-xs text-muted-foreground">
                            {m.court}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={mStatus.variant}>{mStatus.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Recent results ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <IconCircleCheck className="size-4 text-chart-4" />
            Últimos resultados
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" asChild>
              <Link href="/clubs/matches">Ver todos</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead>Cat.</TableHead>
                <TableHead className="hidden sm:table-cell">Fase</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay resultados aún
                  </TableCell>
                </TableRow>
              ) : (
                recentResults.map((m) => {
                  const mStatus = matchStatusConfig[m.status]
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {m.teamA}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            <span className="mr-1 text-xs text-muted-foreground/60">
                              vs
                            </span>
                            {m.teamB}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                          {m.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {m.phase}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {m.date ? (
                          <span className="text-xs text-muted-foreground">
                            {m.date}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {m.scoreA ? (
                          <div className="font-mono text-xs">
                            <p className="font-medium text-foreground">
                              {m.scoreA}
                            </p>
                            <p className="text-muted-foreground">{m.scoreB}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={mStatus.variant}>{mStatus.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Quick actions ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group/quick flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover/quick:bg-primary/10 group-hover/quick:text-primary">
                  <action.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover/quick:text-primary">
                    {action.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
