"use client"

import { useState } from "react"
import {
  IconCalendarEvent,
  IconCheck,
  IconCircleCheck,
  IconClipboardList,
  IconClock,
  IconCreditCard,
  IconDownload,
  IconFilter,
  IconHourglass,
  IconSearch,
  IconTournament,
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
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

// ─── Types ───

type RegistrationStatus = "pending" | "approved" | "rejected" | "cancelled"
type PaymentStatus = "paid" | "pending" | "exempt"

type Registration = {
  id: string
  player1: string
  player2: string | null
  teamName: string
  tournament: string
  tournamentId: string
  category: string
  status: RegistrationStatus
  payment: PaymentStatus
  registeredAt: string
  notes: string
}

// ─── Mock data ───

const registrations: Registration[] = [
  {
    id: "r1",
    player1: "Carlos Martínez",
    player2: "Diego López",
    teamName: "Martínez / López",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    status: "pending",
    payment: "paid",
    registeredAt: "12 Abr 2026",
    notes: "",
  },
  {
    id: "r2",
    player1: "Ana García",
    player2: "Laura Ruiz",
    teamName: "García / Ruiz",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    status: "pending",
    payment: "pending",
    registeredAt: "12 Abr 2026",
    notes: "Solicitan horario nocturno",
  },
  {
    id: "r3",
    player1: "Roberto Pérez",
    player2: "Manuel Sánchez",
    teamName: "Pérez / Sánchez",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "B",
    status: "approved",
    payment: "paid",
    registeredAt: "10 Abr 2026",
    notes: "",
  },
  {
    id: "r4",
    player1: "Sofía Torres",
    player2: "Valentina Díaz",
    teamName: "Torres / Díaz",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    status: "approved",
    payment: "paid",
    registeredAt: "09 Abr 2026",
    notes: "",
  },
  {
    id: "r5",
    player1: "Fernando Romero",
    player2: null,
    teamName: "Romero / —",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "C",
    status: "pending",
    payment: "pending",
    registeredAt: "11 Abr 2026",
    notes: "Busca pareja para completar equipo",
  },
  {
    id: "r6",
    player1: "Alejandro Castro",
    player2: "Miguel Flores",
    teamName: "Castro / Flores",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    status: "approved",
    payment: "exempt",
    registeredAt: "08 Abr 2026",
    notes: "",
  },
  {
    id: "r7",
    player1: "Lucía Herrera",
    player2: "Camila Medina",
    teamName: "Herrera / Medina",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "A",
    status: "rejected",
    payment: "pending",
    registeredAt: "07 Abr 2026",
    notes: "Categoría incorrecta, se sugirió re-inscribir en B",
  },
  {
    id: "r8",
    player1: "Mateo Vargas",
    player2: "Nicolás Ríos",
    teamName: "Vargas / Ríos",
    tournament: "Liga Nocturna Abril",
    tournamentId: "t2",
    category: "B",
    status: "pending",
    payment: "paid",
    registeredAt: "13 Abr 2026",
    notes: "",
  },
  {
    id: "r9",
    player1: "Isabella Morales",
    player2: "Gabriela Ortiz",
    teamName: "Morales / Ortiz",
    tournament: "Copa Primavera 2026",
    tournamentId: "t1",
    category: "B",
    status: "pending",
    payment: "pending",
    registeredAt: "13 Abr 2026",
    notes: "",
  },
  {
    id: "r10",
    player1: "Daniel Guzmán",
    player2: "Andrés Paredes",
    teamName: "Guzmán / Paredes",
    tournament: "Torneo Relámpago",
    tournamentId: "t3",
    category: "C",
    status: "cancelled",
    payment: "pending",
    registeredAt: "06 Abr 2026",
    notes: "Cancelado por el equipo",
  },
]

// ─── Config maps ───

const statusConfig: Record<
  RegistrationStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof IconClock }
> = {
  pending: { label: "Pendiente", variant: "secondary", icon: IconClock },
  approved: { label: "Aprobada", variant: "default", icon: IconCircleCheck },
  rejected: { label: "Rechazada", variant: "destructive", icon: IconX },
  cancelled: { label: "Cancelada", variant: "outline", icon: IconX },
}

const paymentConfig: Record<PaymentStatus, { label: string; color: string }> = {
  paid: { label: "Pagado", color: "text-chart-1" },
  pending: { label: "Pendiente", color: "text-chart-3" },
  exempt: { label: "Exento", color: "text-muted-foreground" },
}

const tournamentOptions = [
  ...new Map(registrations.map((r) => [r.tournamentId, r.tournament])),
]
const categories = [...new Set(registrations.map((r) => r.category))].sort()

// ─── Component ───

export default function RegistrationsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tournamentFilter, setTournamentFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [incompleteOnly, setIncompleteOnly] = useState("all")
  const [selected, setSelected] = useState<Registration | null>(null)

  const filtered = registrations.filter((r) => {
    if (search) {
      const q = search.toLowerCase()
      const matchesSearch =
        r.teamName.toLowerCase().includes(q) ||
        r.player1.toLowerCase().includes(q) ||
        (r.player2?.toLowerCase().includes(q) ?? false)
      if (!matchesSearch) return false
    }
    if (statusFilter !== "all" && r.status !== statusFilter) return false
    if (tournamentFilter !== "all" && r.tournamentId !== tournamentFilter) return false
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false
    if (paymentFilter !== "all" && r.payment !== paymentFilter) return false
    if (incompleteOnly === "incomplete" && r.player2 !== null) return false
    if (incompleteOnly === "no_payment" && r.payment !== "pending") return false
    return true
  })

  const countByStatus = (s: RegistrationStatus) =>
    registrations.filter((r) => r.status === s).length

  const kpis = [
    { label: "Total", value: registrations.length, icon: IconClipboardList, color: "text-foreground", bg: "bg-muted" },
    { label: "Pendientes", value: countByStatus("pending"), icon: IconHourglass, color: "text-chart-3", bg: "bg-chart-3/10" },
    { label: "Aprobadas", value: countByStatus("approved"), icon: IconCircleCheck, color: "text-chart-1", bg: "bg-chart-1/10" },
    { label: "Rechazadas", value: countByStatus("rejected"), icon: IconX, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Sin pago", value: registrations.filter((r) => r.payment === "pending").length, icon: IconCreditCard, color: "text-chart-2", bg: "bg-chart-2/10" },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Inscripciones</h2>
          <p className="text-sm text-muted-foreground">
            Revisa y gestiona las inscripciones de tus torneos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconDownload data-icon="inline-start" className="size-3.5" />
            Exportar
          </Button>
        </div>
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
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar jugador o equipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Select row */}
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      Categoría {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier pago</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="pending">Sin pagar</SelectItem>
                  <SelectItem value="exempt">Exento</SelectItem>
                </SelectContent>
              </Select>

              <Select value={incompleteOnly} onValueChange={setIncompleteOnly}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Más filtros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sin filtro extra</SelectItem>
                  <SelectItem value="incomplete">
                    <IconUsers className="size-3.5 text-muted-foreground" />
                    Equipo incompleto
                  </SelectItem>
                  <SelectItem value="no_payment">
                    <IconCreditCard className="size-3.5 text-muted-foreground" />
                    Sin pago
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
            {filtered.length} {filtered.length === 1 ? "inscripción" : "inscripciones"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead className="hidden md:table-cell">Jugadores</TableHead>
                <TableHead className="hidden sm:table-cell">Torneo</TableHead>
                <TableHead>Cat.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden lg:table-cell">Fecha</TableHead>
                <TableHead className="hidden lg:table-cell">Pago</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No se encontraron inscripciones
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => {
                  const status = statusConfig[r.status]
                  const payment = paymentConfig[r.payment]
                  const incomplete = r.player2 === null
                  return (
                    <TableRow key={r.id}>
                      {/* Team */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <IconUsersGroup className="size-4 text-muted-foreground" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {r.teamName}
                            </p>
                            {incomplete && (
                              <p className="text-[11px] text-chart-3">Equipo incompleto</p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Players */}
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <IconUser className="size-3" />
                            {r.player1}
                          </div>
                          {r.player2 ? (
                            <div className="flex items-center gap-1">
                              <IconUser className="size-3" />
                              {r.player2}
                            </div>
                          ) : (
                            <span className="italic text-muted-foreground/50">Sin pareja</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Tournament */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <IconTournament className="size-3.5 shrink-0" />
                          <span className="truncate">{r.tournament}</span>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                          {r.category}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{r.registeredAt}</span>
                      </TableCell>

                      {/* Payment */}
                      <TableCell className="hidden lg:table-cell">
                        <span className={`text-xs font-medium ${payment.color}`}>
                          {payment.label}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelected(r)}
                        >
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
          {selected && <RegistrationDetail registration={selected} onClose={() => setSelected(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─── Detail drawer content ───

function RegistrationDetail({
  registration: r,
  onClose,
}: {
  registration: Registration
  onClose: () => void
}) {
  const status = statusConfig[r.status]
  const payment = paymentConfig[r.payment]
  const StatusIcon = status.icon

  return (
    <>
      <SheetHeader>
        <SheetTitle>Detalle de inscripción</SheetTitle>
        <SheetDescription>{r.teamName}</SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 px-4">
        {/* Status banner */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <StatusIcon className="size-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Estado: <Badge variant={status.variant}>{status.label}</Badge>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Registrado el {r.registeredAt}
            </p>
          </div>
        </div>

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
                <p className="text-sm font-medium text-foreground">{r.player1}</p>
                <p className="text-xs text-muted-foreground">Jugador 1</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <IconUser className="size-4 text-primary" />
              </span>
              <div>
                {r.player2 ? (
                  <>
                    <p className="text-sm font-medium text-foreground">{r.player2}</p>
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

        {/* Tournament info */}
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Torneo
          </p>
          <dl className="grid grid-cols-2 gap-3">
            <DetailField icon={IconTournament} label="Torneo" value={r.tournament} fullWidth />
            <DetailField icon={IconCalendarEvent} label="Categoría" value={`Categoría ${r.category}`} />
            <DetailField icon={IconCreditCard} label="Pago" value={payment.label} valueColor={payment.color} />
          </dl>
        </section>

        {/* Notes */}
        {r.notes && (
          <>
            <Separator />
            <section className="space-y-2">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                Notas
              </p>
              <p className="rounded-lg bg-muted/50 p-3 text-sm text-foreground">
                {r.notes}
              </p>
            </section>
          </>
        )}
      </div>

      {/* Footer actions */}
      {r.status === "pending" && (
        <SheetFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onClose}
            >
              <IconX data-icon="inline-start" className="size-4" />
              Rechazar
            </Button>
            <Button className="flex-1" onClick={onClose}>
              <IconCheck data-icon="inline-start" className="size-4" />
              Aprobar
            </Button>
          </div>
        </SheetFooter>
      )}
    </>
  )
}

// ─── Small helper ───

function DetailField({
  icon: Icon,
  label,
  value,
  valueColor,
  fullWidth,
}: {
  icon: typeof IconTournament
  label: string
  value: string
  valueColor?: string
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className={`mt-0.5 text-sm font-medium ${valueColor ?? "text-foreground"}`}>
        {value}
      </dd>
    </div>
  )
}
