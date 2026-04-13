"use client"

import { useState } from "react"
import {
  IconCircleCheck,
  IconCrown,
  IconDownload,
  IconFilter,
  IconSearch,
  IconTournament,
  IconTrophy,
  IconUser,
  IconUsers,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

// ─── Types ───

type TeamStatus = "active" | "eliminated" | "incomplete"

type MatchRecord = {
  opponent: string
  score: string
  result: "win" | "loss"
  date: string
}

type Team = {
  id: string
  name: string
  player1: string
  player2: string | null
  tournament: string
  tournamentId: string
  category: string
  status: TeamStatus
  wins: number
  losses: number
  matchesPlayed: number
  history: MatchRecord[]
}

// ─── Mock data ───

const teams: Team[] = [
  {
    id: "eq1",
    name: "Martínez / López",
    player1: "Carlos Martínez",
    player2: "Diego López",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    status: "active",
    wins: 3,
    losses: 0,
    matchesPlayed: 3,
    history: [
      { opponent: "García / Ruiz", score: "6-3 6-2", result: "win", date: "10 Abr" },
      { opponent: "Herrera / Medina", score: "6-4 7-5", result: "win", date: "08 Abr" },
      { opponent: "Silva / Ramos", score: "6-1 6-3", result: "win", date: "06 Abr" },
    ],
  },
  {
    id: "eq2",
    name: "García / Ruiz",
    player1: "Ana García",
    player2: "Laura Ruiz",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    status: "active",
    wins: 2,
    losses: 1,
    matchesPlayed: 3,
    history: [
      { opponent: "Martínez / López", score: "3-6 2-6", result: "loss", date: "10 Abr" },
      { opponent: "Delgado / Vega", score: "6-4 6-3", result: "win", date: "08 Abr" },
      { opponent: "Pérez / Sánchez", score: "7-5 6-4", result: "win", date: "06 Abr" },
    ],
  },
  {
    id: "eq3",
    name: "Pérez / Sánchez",
    player1: "Roberto Pérez",
    player2: "Manuel Sánchez",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "B",
    status: "active",
    wins: 2,
    losses: 1,
    matchesPlayed: 3,
    history: [
      { opponent: "Torres / Díaz", score: "6-2 6-4", result: "win", date: "10 Abr" },
      { opponent: "Vargas / Ríos", score: "6-3 6-1", result: "win", date: "08 Abr" },
      { opponent: "García / Ruiz", score: "5-7 4-6", result: "loss", date: "06 Abr" },
    ],
  },
  {
    id: "eq4",
    name: "Torres / Díaz",
    player1: "Sofía Torres",
    player2: "Valentina Díaz",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    status: "active",
    wins: 1,
    losses: 1,
    matchesPlayed: 2,
    history: [
      { opponent: "Pérez / Sánchez", score: "2-6 4-6", result: "loss", date: "10 Abr" },
      { opponent: "Ibarra / Ponce", score: "6-3 6-4", result: "win", date: "08 Abr" },
    ],
  },
  {
    id: "eq5",
    name: "Romero / —",
    player1: "Fernando Romero",
    player2: null,
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "C",
    status: "incomplete",
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    history: [],
  },
  {
    id: "eq6",
    name: "Castro / Flores",
    player1: "Alejandro Castro",
    player2: "Miguel Flores",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    status: "eliminated",
    wins: 1,
    losses: 1,
    matchesPlayed: 2,
    history: [
      { opponent: "Morales / Ortiz", score: "3-6 4-6", result: "loss", date: "12 Abr" },
      { opponent: "Reyes / Luna", score: "6-4 6-3", result: "win", date: "10 Abr" },
    ],
  },
  {
    id: "eq7",
    name: "Morales / Ortiz",
    player1: "Isabella Morales",
    player2: "Gabriela Ortiz",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    status: "active",
    wins: 2,
    losses: 0,
    matchesPlayed: 2,
    history: [
      { opponent: "Castro / Flores", score: "6-3 6-4", result: "win", date: "12 Abr" },
      { opponent: "Reyes / Luna", score: "6-2 6-1", result: "win", date: "10 Abr" },
    ],
  },
  {
    id: "eq8",
    name: "Herrera / Medina",
    player1: "Lucía Herrera",
    player2: "Camila Medina",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    status: "active",
    wins: 0,
    losses: 1,
    matchesPlayed: 1,
    history: [
      { opponent: "Martínez / López", score: "4-6 5-7", result: "loss", date: "08 Abr" },
    ],
  },
  {
    id: "eq9",
    name: "Vargas / Ríos",
    player1: "Mateo Vargas",
    player2: "Nicolás Ríos",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    status: "active",
    wins: 0,
    losses: 1,
    matchesPlayed: 1,
    history: [
      { opponent: "Pérez / Sánchez", score: "3-6 1-6", result: "loss", date: "08 Abr" },
    ],
  },
  {
    id: "eq10",
    name: "Salazar / Rojas",
    player1: "Diego Salazar",
    player2: "Pablo Rojas",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "B",
    status: "eliminated",
    wins: 0,
    losses: 1,
    matchesPlayed: 1,
    history: [
      { opponent: "Campos / Bravo", score: "3-6 2-6", result: "loss", date: "12 Abr" },
    ],
  },
]

// ─── Config ───

const statusConfig: Record<
  TeamStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active: { label: "Activo", variant: "default" },
  eliminated: { label: "Eliminado", variant: "outline" },
  incomplete: { label: "Incompleto", variant: "destructive" },
}

const tournamentOptions = [
  ...new Map(teams.map((t) => [t.tournamentId, t.tournament])),
]
const categoryOptions = [...new Set(teams.map((t) => t.category))].sort()

// ─── Derived counts ───

const totalTeams = teams.length
const activeCount = teams.filter((t) => t.status === "active").length
const incompleteCount = teams.filter((t) => t.status === "incomplete").length
const undefeatedCount = teams.filter(
  (t) => t.matchesPlayed > 0 && t.losses === 0
).length

// ─── Component ───

export default function TeamsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tournamentFilter, setTournamentFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selected, setSelected] = useState<Team | null>(null)

  const filtered = teams.filter((t) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !t.name.toLowerCase().includes(q) &&
        !t.player1.toLowerCase().includes(q) &&
        !(t.player2?.toLowerCase().includes(q) ?? false)
      )
        return false
    }
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (tournamentFilter !== "all" && t.tournamentId !== tournamentFilter) return false
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false
    return true
  })

  const kpis = [
    { label: "Total equipos", value: totalTeams, icon: IconUsersGroup, color: "text-foreground", bg: "bg-muted" },
    { label: "Activos", value: activeCount, icon: IconCircleCheck, color: "text-chart-1", bg: "bg-chart-1/10" },
    { label: "Invictos", value: undefeatedCount, icon: IconCrown, color: "text-chart-2", bg: "bg-chart-2/10" },
    { label: "Incompletos", value: incompleteCount, icon: IconUsers, color: "text-chart-3", bg: "bg-chart-3/10" },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Equipos</h2>
          <p className="text-sm text-muted-foreground">
            Consulta los equipos inscritos en tus torneos
          </p>
        </div>
        <Button variant="outline" size="sm">
          <IconDownload data-icon="inline-start" className="size-3.5" />
          Exportar
        </Button>
      </div>

      {/* ── KPIs ── */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${kpi.bg}`}>
                <kpi.icon className={`size-4 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-semibold leading-tight text-foreground">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Filters ── */}
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-sm">
            <IconFilter className="size-4 text-muted-foreground" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar equipo o jugador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="eliminated">Eliminado</SelectItem>
                  <SelectItem value="incomplete">Incompleto</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Torneo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los torneos</SelectItem>
                  {tournamentOptions.map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
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
                    <SelectItem key={cat} value={cat}>Cat. {cat}</SelectItem>
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
            {filtered.length} {filtered.length === 1 ? "equipo" : "equipos"}
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
                <TableHead>Equipo</TableHead>
                <TableHead className="hidden md:table-cell">Torneo</TableHead>
                <TableHead>Cat.</TableHead>
                <TableHead className="hidden sm:table-cell">Récord</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron equipos
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => {
                  const status = statusConfig[t.status]
                  const winRate =
                    t.matchesPlayed > 0
                      ? Math.round((t.wins / t.matchesPlayed) * 100)
                      : null

                  return (
                    <TableRow key={t.id}>
                      {/* Team + players */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <IconUsersGroup className="size-4 text-muted-foreground" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {t.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {t.player1}
                              {t.player2 ? ` · ${t.player2}` : ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Tournament */}
                      <TableCell className="hidden md:table-cell">
                        <span className="truncate text-xs text-muted-foreground">{t.tournament}</span>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                          {t.category}
                        </span>
                      </TableCell>

                      {/* Record */}
                      <TableCell className="hidden sm:table-cell">
                        {t.matchesPlayed > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              <span className="font-medium text-chart-1">{t.wins}</span>
                              <span className="text-muted-foreground"> - </span>
                              <span className="font-medium text-destructive">{t.losses}</span>
                            </span>
                            {winRate !== null && (
                              <div className="hidden items-center gap-1 lg:flex">
                                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full bg-chart-1 transition-all"
                                    style={{ width: `${winRate}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-muted-foreground">{winRate}%</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">Sin partidos</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>

                      {/* View */}
                      <TableCell>
                        <Button variant="ghost" size="xs" onClick={() => setSelected(t)}>
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Detail drawer ── */}
      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {selected && <TeamDetail team={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─── Detail drawer content ───

function TeamDetail({ team: t }: { team: Team }) {
  const status = statusConfig[t.status]
  const winRate =
    t.matchesPlayed > 0
      ? Math.round((t.wins / t.matchesPlayed) * 100)
      : null

  return (
    <>
      <SheetHeader>
        <SheetTitle>{t.name}</SheetTitle>
        <SheetDescription>
          {t.tournament} · Categoría {t.category}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 px-4">
        {/* Status + stats */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Badge variant={status.variant}>{status.label}</Badge>
          {t.matchesPlayed > 0 && (
            <span className="text-xs text-muted-foreground">
              {t.matchesPlayed} {t.matchesPlayed === 1 ? "partido" : "partidos"} jugados
            </span>
          )}
        </div>

        {/* Record bar */}
        {t.matchesPlayed > 0 && (
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Récord</span>
              <span className="font-mono text-sm">
                <span className="font-medium text-chart-1">{t.wins}G</span>
                <span className="text-muted-foreground"> - </span>
                <span className="font-medium text-destructive">{t.losses}P</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-destructive/20">
              <div
                className="h-full rounded-full bg-chart-1 transition-all"
                style={{ width: `${winRate}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {winRate}% efectividad
            </p>
          </div>
        )}

        <Separator />

        {/* Players */}
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Jugadores
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <IconUser className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{t.player1}</p>
                <p className="text-xs text-muted-foreground">Jugador 1</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <IconUser className="size-4 text-primary" />
              </span>
              <div>
                {t.player2 ? (
                  <>
                    <p className="text-sm font-medium text-foreground">{t.player2}</p>
                    <p className="text-xs text-muted-foreground">Jugador 2</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-chart-3">Sin pareja asignada</p>
                    <p className="text-xs text-muted-foreground">Equipo incompleto</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Match history */}
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Historial de partidos
          </p>
          {t.history.length === 0 ? (
            <p className="rounded-lg bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              Sin partidos jugados aún
            </p>
          ) : (
            <ul className="space-y-2">
              {t.history.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                      m.result === "win"
                        ? "bg-chart-1/10 text-chart-1"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {m.result === "win" ? (
                      <IconTrophy className="size-3.5" />
                    ) : (
                      <IconX className="size-3.5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        vs {m.opponent}
                      </p>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {m.score}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
