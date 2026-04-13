"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconCategory,
  IconDots,
  IconEdit,
  IconEye,
  IconFileDescription,
  IconLock,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconTournament,
  IconTrash,
  IconTrophy,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TournamentStatus = "draft" | "open" | "in_progress" | "finished"
type Visibility = "public" | "private"

type Tournament = {
  id: string
  name: string
  startDate: string
  endDate: string
  status: TournamentStatus
  visibility: Visibility
  categories: string[]
  enrolled: number
  maxTeams: number
  matchesPlayed: number
  matchesTotal: number
}

const tournaments: Tournament[] = [
  {
    id: "1",
    name: "Copa Primavera 2026",
    startDate: "15 Abr 2026",
    endDate: "30 Abr 2026",
    status: "in_progress",
    visibility: "public",
    categories: ["A", "B"],
    enrolled: 16,
    maxTeams: 16,
    matchesPlayed: 10,
    matchesTotal: 15,
  },
  {
    id: "2",
    name: "Liga Nocturna Abril",
    startDate: "20 Abr 2026",
    endDate: "20 May 2026",
    status: "open",
    visibility: "public",
    categories: ["B", "C"],
    enrolled: 10,
    maxTeams: 24,
    matchesPlayed: 0,
    matchesTotal: 0,
  },
  {
    id: "3",
    name: "Torneo Relámpago",
    startDate: "10 Abr 2026",
    endDate: "12 Abr 2026",
    status: "in_progress",
    visibility: "private",
    categories: ["C"],
    enrolled: 8,
    maxTeams: 8,
    matchesPlayed: 6,
    matchesTotal: 7,
  },
  {
    id: "4",
    name: "Copa Verano 2026",
    startDate: "01 Jun 2026",
    endDate: "30 Jun 2026",
    status: "draft",
    visibility: "private",
    categories: ["A"],
    enrolled: 0,
    maxTeams: 32,
    matchesPlayed: 0,
    matchesTotal: 0,
  },
  {
    id: "5",
    name: "Torneo Apertura 2026",
    startDate: "01 Feb 2026",
    endDate: "28 Feb 2026",
    status: "finished",
    visibility: "public",
    categories: ["A", "B", "C"],
    enrolled: 24,
    maxTeams: 24,
    matchesPlayed: 23,
    matchesTotal: 23,
  },
  {
    id: "6",
    name: "Liga Interna Marzo",
    startDate: "01 Mar 2026",
    endDate: "31 Mar 2026",
    status: "finished",
    visibility: "private",
    categories: ["B"],
    enrolled: 12,
    maxTeams: 16,
    matchesPlayed: 11,
    matchesTotal: 11,
  },
]

const statusConfig: Record<
  TournamentStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; color: string }
> = {
  draft: { label: "Borrador", variant: "outline", color: "text-muted-foreground" },
  open: { label: "Abierto", variant: "secondary", color: "text-chart-2" },
  in_progress: { label: "En curso", variant: "default", color: "text-chart-1" },
  finished: { label: "Finalizado", variant: "outline", color: "text-chart-4" },
}

const summaryCards = [
  { label: "Total", value: tournaments.length, icon: IconTournament, color: "text-foreground", bg: "bg-muted" },
  { label: "Borradores", value: tournaments.filter((t) => t.status === "draft").length, icon: IconFileDescription, color: "text-muted-foreground", bg: "bg-muted/60" },
  { label: "Abiertos", value: tournaments.filter((t) => t.status === "open").length, icon: IconUsers, color: "text-chart-2", bg: "bg-chart-2/10" },
  { label: "En curso", value: tournaments.filter((t) => t.status === "in_progress").length, icon: IconPlayerPlay, color: "text-chart-1", bg: "bg-chart-1/10" },
  { label: "Finalizados", value: tournaments.filter((t) => t.status === "finished").length, icon: IconTrophy, color: "text-chart-4", bg: "bg-chart-4/10" },
]

export default function TournamentsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all")

  const filtered = tournaments.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (visibilityFilter !== "all" && t.visibility !== visibilityFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Torneos</h2>
          <p className="text-sm text-muted-foreground">
            Crea y administra los torneos de tu club
          </p>
        </div>
        <Button asChild>
          <Link href="/clubs/tournaments/new">
            <IconPlus data-icon="inline-start" className="size-4" />
            Nuevo torneo
          </Link>
        </Button>
      </div>

      {/* ── Summary cards ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`size-4 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-xl font-semibold leading-tight text-foreground">
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Filters ── */}
      <Card size="sm">
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar torneo..."
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
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="open">Abierto</SelectItem>
                  <SelectItem value="in_progress">En curso</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier fecha</SelectItem>
                  <SelectItem value="this_month">Este mes</SelectItem>
                  <SelectItem value="next_month">Próximo mes</SelectItem>
                  <SelectItem value="past">Pasados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="public">
                    <IconWorld className="size-3.5 text-muted-foreground" />
                    Público
                  </SelectItem>
                  <SelectItem value="private">
                    <IconLock className="size-3.5 text-muted-foreground" />
                    Privado
                  </SelectItem>
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
            {filtered.length} {filtered.length === 1 ? "torneo" : "torneos"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Categorías</TableHead>
                <TableHead className="hidden sm:table-cell">Inscritos</TableHead>
                <TableHead className="hidden lg:table-cell">Partidos</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No se encontraron torneos
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => {
                  const status = statusConfig[t.status]
                  return (
                    <TableRow key={t.id}>
                      {/* Name + visibility */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {t.name}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                              {t.visibility === "public" ? (
                                <IconWorld className="size-3" />
                              ) : (
                                <IconLock className="size-3" />
                              )}
                              {t.visibility === "public" ? "Público" : "Privado"}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Dates */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <IconCalendarEvent className="size-3.5 shrink-0" />
                          <span>
                            {t.startDate} — {t.endDate}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      {/* Categories */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex gap-1">
                          {t.categories.map((cat) => (
                            <span
                              key={cat}
                              className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      {/* Enrolled */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground">
                            {t.enrolled}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / {t.maxTeams}
                          </span>
                        </div>
                        <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                              width: `${Math.min((t.enrolled / t.maxTeams) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </TableCell>

                      {/* Matches */}
                      <TableCell className="hidden lg:table-cell">
                        {t.matchesTotal > 0 ? (
                          <span className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {t.matchesPlayed}
                            </span>{" "}
                            / {t.matchesTotal}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Actions */}
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
                              <IconCategory className="size-4" />
                              Categorías
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <IconTrash className="size-4" />
                              Eliminar
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
    </div>
  )
}
