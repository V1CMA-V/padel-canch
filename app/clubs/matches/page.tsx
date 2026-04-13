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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  IconChevronRight,
  IconCircleCheck,
  IconClock,
  IconEdit,
  IconEye,
  IconFilter,
  IconFlag,
  IconPlayerPlay,
  IconScoreboard,
  IconSearch,
  IconTournament,
  IconTrophy,
} from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

// ─── Types ───

type MatchStatus =
  | "scheduled"
  | "in_progress"
  | "finished"
  | "pending"
  | "walkover"

type Match = {
  id: string
  teamA: string
  teamB: string
  tournament: string
  tournamentId: string
  category: string
  phase: string
  date: string | null
  time: string | null
  court: string | null
  status: MatchStatus
  scoreA: string | null
  scoreB: string | null
  isToday: boolean
}

// ─── Mock data ───

const matches: Match[] = [
  {
    id: "m1",
    teamA: "Martínez / López",
    teamB: "García / Ruiz",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    phase: "Cuartos",
    date: "13 Abr 2026",
    time: "18:00",
    court: "Cancha 1",
    status: "scheduled",
    scoreA: null,
    scoreB: null,
    isToday: true,
  },
  {
    id: "m2",
    teamA: "Pérez / Sánchez",
    teamB: "Torres / Díaz",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    phase: "Cuartos",
    date: "13 Abr 2026",
    time: "19:30",
    court: "Cancha 2",
    status: "in_progress",
    scoreA: "6-4",
    scoreB: "3-6",
    isToday: true,
  },
  {
    id: "m3",
    teamA: "Romero / Castro",
    teamB: "Flores / Morales",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    phase: "Grupo A",
    date: "14 Abr 2026",
    time: "20:00",
    court: "Cancha 1",
    status: "scheduled",
    scoreA: null,
    scoreB: null,
    isToday: false,
  },
  {
    id: "m4",
    teamA: "Herrera / Medina",
    teamB: "Vargas / Ríos",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    phase: "Grupo A",
    date: "14 Abr 2026",
    time: "21:30",
    court: "Cancha 3",
    status: "scheduled",
    scoreA: null,
    scoreB: null,
    isToday: false,
  },
  {
    id: "m5",
    teamA: "Guzmán / Paredes",
    teamB: "Ortiz / Navarro",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "B",
    phase: "Cuartos",
    date: null,
    time: null,
    court: null,
    status: "pending",
    scoreA: null,
    scoreB: null,
    isToday: false,
  },
  {
    id: "m6",
    teamA: "Silva / Ramos",
    teamB: "Delgado / Vega",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    phase: "Semifinal",
    date: null,
    time: null,
    court: null,
    status: "pending",
    scoreA: null,
    scoreB: null,
    isToday: false,
  },
  {
    id: "m7",
    teamA: "Morales / Ortiz",
    teamB: "Castro / Flores",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    phase: "Final",
    date: "12 Abr 2026",
    time: "17:00",
    court: "Cancha 1",
    status: "finished",
    scoreA: "6-3 6-4",
    scoreB: "3-6 4-6",
    isToday: false,
  },
  {
    id: "m8",
    teamA: "Reyes / Luna",
    teamB: "Jiménez / Peña",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    phase: "Semifinal",
    date: "11 Abr 2026",
    time: "16:00",
    court: "Cancha 2",
    status: "finished",
    scoreA: "6-2 6-1",
    scoreB: "2-6 1-6",
    isToday: false,
  },
  {
    id: "m9",
    teamA: "Méndez / Cordero",
    teamB: "Aguirre / Espinoza",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    phase: "Semifinal",
    date: "11 Abr 2026",
    time: "18:00",
    court: "Cancha 1",
    status: "walkover",
    scoreA: "W.O.",
    scoreB: "—",
    isToday: false,
  },
  {
    id: "m10",
    teamA: "Salazar / Rojas",
    teamB: "Campos / Bravo",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "B",
    phase: "Octavos",
    date: "12 Abr 2026",
    time: "19:00",
    court: "Cancha 3",
    status: "finished",
    scoreA: null,
    scoreB: null,
    isToday: false,
  },
  {
    id: "m11",
    teamA: "Ibarra / Ponce",
    teamB: "Contreras / Mora",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "C",
    phase: "Grupo B",
    date: null,
    time: null,
    court: null,
    status: "pending",
    scoreA: null,
    scoreB: null,
    isToday: false,
  },
  {
    id: "m12",
    teamA: "Mejía / Serrano",
    teamB: "Duarte / Figueroa",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    phase: "Cuartos",
    date: "13 Abr 2026",
    time: "21:00",
    court: "Cancha 1",
    status: "scheduled",
    scoreA: null,
    scoreB: null,
    isToday: true,
  },
]

// ─── Config maps ───

const statusConfig: Record<
  MatchStatus,
  {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
    icon: typeof IconClock
  }
> = {
  pending: { label: "Pendiente", variant: "outline", icon: IconClock },
  scheduled: {
    label: "Programado",
    variant: "secondary",
    icon: IconCalendarEvent,
  },
  in_progress: { label: "En juego", variant: "default", icon: IconPlayerPlay },
  finished: { label: "Finalizado", variant: "outline", icon: IconCircleCheck },
  walkover: { label: "Walkover", variant: "destructive", icon: IconFlag },
}

const tournamentOptions = [
  ...new Map(matches.map((m) => [m.tournamentId, m.tournament])),
]
const categoryOptions = [...new Set(matches.map((m) => m.category))].sort()
const courtOptions = [
  ...new Set(matches.filter((m) => m.court).map((m) => m.court!)),
].sort()

// ─── Derived counts ───

const todayCount = matches.filter((m) => m.isToday).length
const pendingCount = matches.filter((m) => m.status === "pending").length
const scheduledCount = matches.filter((m) => m.status === "scheduled").length
const finishedCount = matches.filter(
  (m) => m.status === "finished" || m.status === "walkover"
).length
const noResultCount = matches.filter(
  (m) => m.status === "finished" && m.scoreA === null
).length
const noScheduleCount = matches.filter((m) => m.date === null).length
const walkoverPending = matches.filter((m) => m.status === "walkover").length

// ─── Attention items ───

const attentionItems = [
  noScheduleCount > 0 && {
    label: `${noScheduleCount} ${noScheduleCount === 1 ? "partido" : "partidos"} sin horario asignado`,
    href: "#",
    icon: IconClock,
    color: "bg-chart-3/10 text-chart-3",
  },
  noResultCount > 0 && {
    label: `${noResultCount} ${noResultCount === 1 ? "partido finalizado" : "partidos finalizados"} sin resultado cargado`,
    href: "#",
    icon: IconScoreboard,
    color: "bg-chart-2/10 text-chart-2",
  },
  walkoverPending > 0 && {
    label: `${walkoverPending} ${walkoverPending === 1 ? "walkover" : "walkovers"} registrado`,
    href: "#",
    icon: IconFlag,
    color: "bg-destructive/10 text-destructive",
  },
].filter(Boolean) as {
  label: string
  href: string
  icon: typeof IconClock
  color: string
}[]

// ─── Component ───

export default function MatchesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tournamentFilter, setTournamentFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [courtFilter, setCourtFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filtered = matches.filter((m) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !m.teamA.toLowerCase().includes(q) &&
        !m.teamB.toLowerCase().includes(q)
      )
        return false
    }
    if (statusFilter !== "all" && m.status !== statusFilter) return false
    if (tournamentFilter !== "all" && m.tournamentId !== tournamentFilter)
      return false
    if (categoryFilter !== "all" && m.category !== categoryFilter) return false
    if (courtFilter !== "all" && m.court !== courtFilter) return false
    if (dateFilter === "today" && !m.isToday) return false
    if (dateFilter === "no_date" && m.date !== null) return false
    return true
  })

  const kpis = [
    {
      label: "Hoy",
      value: todayCount,
      icon: IconCalendarEvent,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pendientes",
      value: pendingCount,
      icon: IconClock,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      label: "Programados",
      value: scheduledCount,
      icon: IconCalendarPlus,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Finalizados",
      value: finishedCount,
      icon: IconTrophy,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
    {
      label: "Sin resultado",
      value: noResultCount,
      icon: IconScoreboard,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Partidos</h2>
          <p className="text-sm text-muted-foreground">
            Programa, gestiona y carga resultados de los partidos
          </p>
        </div>
        <Button asChild>
          <Link href="/clubs/matches/new">
            <IconCalendarPlus data-icon="inline-start" className="size-4" />
            Programar partido
          </Link>
        </Button>
      </div>

      {/* ── KPIs ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${kpi.bg}`}>
                <kpi.icon className={`size-4 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="text-xl leading-tight font-semibold text-foreground">
                  {kpi.value}
                </p>
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
                    className="group/action flex items-center gap-3 py-3 transition-colors first:pt-0 last:pb-0"
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

      {/* ── Filters ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-sm">
            <IconFilter className="size-4 text-muted-foreground" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar equipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier día</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="no_date">Sin fecha</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={tournamentFilter}
                onValueChange={setTournamentFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Torneo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los torneos</SelectItem>
                  {tournamentOptions.map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      Cat. {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                  <SelectItem value="in_progress">En juego</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                  <SelectItem value="walkover">Walkover</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courtFilter} onValueChange={setCourtFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Cancha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {courtOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle>
            {filtered.length} {filtered.length === 1 ? "partido" : "partidos"}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="font-normal">
              <IconTournament className="size-3" />
              {tournamentOptions.length} torneos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead className="hidden sm:table-cell">Torneo</TableHead>
                <TableHead>Cat.</TableHead>
                <TableHead className="hidden md:table-cell">Fase</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Fecha / Hora
                </TableHead>
                <TableHead className="hidden xl:table-cell">Cancha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Resultado
                </TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No se encontraron partidos
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => {
                  const status = statusConfig[m.status]
                  const needsResult =
                    m.status === "finished" && m.scoreA === null
                  const needsSchedule = m.date === null

                  return (
                    <TableRow
                      key={m.id}
                      className={m.isToday ? "bg-primary/3" : undefined}
                    >
                      {/* Match */}
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
                          {m.isToday && (
                            <span className="mt-0.5 inline-block text-[10px] font-semibold tracking-wide text-primary uppercase">
                              Hoy
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Tournament */}
                      <TableCell className="hidden sm:table-cell">
                        <span className="truncate text-xs text-muted-foreground">
                          {m.tournament}
                        </span>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                          {m.category}
                        </span>
                      </TableCell>

                      {/* Phase */}
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {m.phase}
                        </span>
                      </TableCell>

                      {/* Date/Time */}
                      <TableCell className="hidden lg:table-cell">
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

                      {/* Court */}
                      <TableCell className="hidden xl:table-cell">
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

                      {/* Status */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          {needsResult && (
                            <span className="text-[10px] font-medium text-chart-2">
                              Sin resultado
                            </span>
                          )}
                          {needsSchedule && m.status === "pending" && (
                            <span className="text-[10px] font-medium text-chart-3">
                              Sin horario
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Score */}
                      <TableCell className="hidden sm:table-cell">
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

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <IconEye className="size-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <IconEye className="size-4" />
                              Ver detalle
                            </DropdownMenuItem>
                            {(m.status === "pending" ||
                              m.status === "scheduled") && (
                              <DropdownMenuItem>
                                <IconCalendarPlus className="size-4" />
                                {m.date ? "Reprogramar" : "Programar"}
                              </DropdownMenuItem>
                            )}
                            {(m.status === "finished" ||
                              m.status === "in_progress") && (
                              <DropdownMenuItem>
                                <IconScoreboard className="size-4" />
                                {m.scoreA
                                  ? "Editar resultado"
                                  : "Cargar resultado"}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <IconEdit className="size-4" />
                              Editar partido
                            </DropdownMenuItem>
                            {m.status !== "walkover" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                  <IconFlag className="size-4" />
                                  Marcar walkover
                                </DropdownMenuItem>
                              </>
                            )}
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
    </div>
  )
}
