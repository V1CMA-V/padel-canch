"use client"

import { createTournament } from "@/app/actions/club"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Club } from "@/generated/prisma/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(5, "El nombre debe tener al menos 5 caracteres.")
      .max(180, "El nombre no puede superar 180 caracteres."),
    description: z.string().trim().max(5000),
    venueName: z.string().trim().max(150),
    venueAddress: z.string().trim().max(255),
    startDate: z.string().min(1, "La fecha de inicio es obligatoria."),
    endDate: z.string().min(1, "La fecha de finalizacion es obligatoria."),
    registrationOpenAt: z.string(),
    registrationCloseAt: z.string(),
    status: z.enum([
      "DRAFT",
      "REGISTRATION_OPEN",
      "REGISTRATION_CLOSED",
      "IN_PROGRESS",
      "FINISHED",
      "CANCELLED",
    ]),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    rules: z.string().trim().max(5000),
    coverImageUrl: z.union([z.string().url("URL invalida"), z.literal("")]),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (endDate < startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "La fecha de finalizacion no puede ser anterior a la de inicio.",
      })
    }

    const hasOpen = Boolean(data.registrationOpenAt)
    const hasClose = Boolean(data.registrationCloseAt)

    if (hasOpen && !hasClose) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registrationCloseAt"],
        message: "Completa tambien el cierre de inscripcion.",
      })
    }

    if (hasClose && !hasOpen) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registrationOpenAt"],
        message: "Completa tambien la apertura de inscripcion.",
      })
    }

    if (hasOpen && hasClose) {
      const openAt = new Date(data.registrationOpenAt as string)
      const closeAt = new Date(data.registrationCloseAt as string)

      if (closeAt < openAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["registrationCloseAt"],
          message: "El cierre debe ser posterior a la apertura.",
        })
      }

      if (closeAt > startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["registrationCloseAt"],
          message: "El cierre de inscripcion debe ocurrir antes del inicio.",
        })
      }
    }
  })

export function NewTournamentForm({ clubProfile }: { clubProfile: Club }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      venueName: clubProfile.name ?? "",
      venueAddress: clubProfile.address ?? "",
      startDate: "",
      endDate: "",
      registrationOpenAt: "",
      registrationCloseAt: "",
      status: "DRAFT",
      visibility: "PUBLIC",
      rules: "",
      coverImageUrl: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSaving(true)

    try {
      const result = await createTournament({
        ...data,
        description: data.description.trim() || undefined,
        venueName: data.venueName.trim() || undefined,
        venueAddress: data.venueAddress.trim() || undefined,
        registrationOpenAt: data.registrationOpenAt || undefined,
        registrationCloseAt: data.registrationCloseAt || undefined,
        rules: data.rules.trim() || undefined,
        coverImageUrl: data.coverImageUrl.trim() || undefined,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Torneo creado correctamente.")
      router.push("/clubs/tournaments")
      router.refresh()
    } catch {
      toast.error("Ocurrio un error al crear el torneo.")
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    form.reset()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nuevo torneo</CardTitle>
        <CardDescription>Completa la informacion base del torneo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="tournament-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Datos generales</FieldLegend>

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tournament-name">Nombre</FieldLabel>
                    <Input
                      {...field}
                      id="tournament-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Copa Primavera 2026"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tournament-description">Descripcion</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="tournament-description"
                        placeholder="Descripcion del torneo (opcional)"
                        rows={3}
                        className="min-h-20 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {(field.value ?? "").length}/5000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Ubicacion y fechas</FieldLegend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="venueName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-venue-name">Sede</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="tournament-venue-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Club Central"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="venueAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-venue-address">Direccion</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="tournament-venue-address"
                        aria-invalid={fieldState.invalid}
                        placeholder="Calle Principal 123"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-start-date">Fecha de inicio</FieldLabel>
                      <Input
                        {...field}
                        id="tournament-start-date"
                        type="date"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-end-date">Fecha de finalizacion</FieldLabel>
                      <Input
                        {...field}
                        id="tournament-end-date"
                        type="date"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="registrationOpenAt"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-registration-open">
                        Apertura de inscripcion
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="tournament-registration-open"
                        type="datetime-local"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="registrationCloseAt"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-registration-close">
                        Cierre de inscripcion
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="tournament-registration-close"
                        type="datetime-local"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Configuracion</FieldLegend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-status">Estado</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange} name={field.name}>
                        <SelectTrigger id="tournament-status" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="DRAFT">Borrador</SelectItem>
                          <SelectItem value="REGISTRATION_OPEN">Inscripciones abiertas</SelectItem>
                          <SelectItem value="REGISTRATION_CLOSED">Inscripciones cerradas</SelectItem>
                          <SelectItem value="IN_PROGRESS">En curso</SelectItem>
                          <SelectItem value="FINISHED">Finalizado</SelectItem>
                          <SelectItem value="CANCELLED">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="visibility"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="tournament-visibility">Visibilidad</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange} name={field.name}>
                        <SelectTrigger id="tournament-visibility" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="PUBLIC">Publico</SelectItem>
                          <SelectItem value="PRIVATE">Privado</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="rules"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tournament-rules">Reglas</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        value={field.value ?? ""}
                        id="tournament-rules"
                        placeholder="Reglamento del torneo (opcional)"
                        rows={4}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {(field.value ?? "").length}/5000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="coverImageUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tournament-cover-image-url">
                      URL imagen de portada
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="tournament-cover-image-url"
                      type="url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://..."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reiniciar
        </Button>
        <Button type="submit" form="tournament-form" disabled={isSaving}>
          {isSaving ? "Creando..." : "Crear torneo"}
        </Button>
      </CardFooter>
    </Card>
  )
}
