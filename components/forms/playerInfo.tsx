"use client"

import { updatePlayerProfile } from "@/app/actions/player"
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
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { PlayerProfile } from "@/generated/prisma/client"
import type {
  CityResponse,
  CountryResponse,
  StateResponse,
} from "@/utils/getCounries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const formSchema = z.object({
  dominantHand: z.enum(["left", "right"], {
    error: "La mano dominante debe ser izquierda o derecha.",
  }),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    error: "El nivel debe ser principiante, intermedio o avanzado.",
  }),
  gender: z.enum(["male", "female", "other"], {
    error: "El genero debe ser masculino, femenino o otro.",
  }),
  city: z
    .string()
    .min(3, "La ciudad debe tener al menos 3 caracteres.")
    .max(50, "La ciudad debe tener como maximo 50 caracteres."),
  state: z
    .string()
    .min(3, "El estado debe tener al menos 3 caracteres.")
    .max(50, "El estado debe tener como maximo 50 caracteres."),
  country: z
    .string()
    .min(3, "El pais debe tener al menos 3 caracteres.")
    .max(50, "El pais debe tener como maximo 50 caracteres."),
  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ingresa una fecha valida.",
    }),
  bio: z.string().max(500, "La bio debe tener como maximo 500 caracteres.").optional(),
})

export function PlayerInfo({
  playerProfile,
}: {
  playerProfile: PlayerProfile
}) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)

  const [countries, setCountries] = React.useState<CountryResponse[]>([])
  const [states, setStates] = React.useState<StateResponse[]>([])
  const [cities, setCities] = React.useState<CityResponse[]>([])

  const [isCountriesLoading, setIsCountriesLoading] = React.useState(true)
  const [isStatesLoading, setIsStatesLoading] = React.useState(false)
  const [isCitiesLoading, setIsCitiesLoading] = React.useState(false)
  const countriesCacheRef = React.useRef<CountryResponse[] | null>(null)
  const statesCacheRef = React.useRef<Map<string, StateResponse[]>>(new Map())
  const citiesCacheRef = React.useRef<Map<string, CityResponse[]>>(new Map())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dominantHand:
        playerProfile.dominantHand === "right" ? "right" : "left",
      level:
        playerProfile.level === "intermediate" ||
        playerProfile.level === "advanced"
          ? playerProfile.level
          : "beginner",
      gender:
        playerProfile.gender === "female" || playerProfile.gender === "other"
          ? playerProfile.gender
          : "male",
      city: playerProfile.city ?? "",
      state: playerProfile.state ?? "",
      country: playerProfile.country ?? "",
      birthDate: playerProfile.birthDate
        ? playerProfile.birthDate.toISOString().slice(0, 10)
        : "",
      bio: playerProfile.bio ?? "",
    },
  })

  const selectedCountryName = form.watch("country")
  const selectedStateName = form.watch("state")

  const selectedCountryCode = React.useMemo(() => {
    const country = countries.find((item) => item.name === selectedCountryName)
    return country?.iso2 ?? ""
  }, [countries, selectedCountryName])

  const selectedStateCode = React.useMemo(() => {
    const state = states.find((item) => item.name === selectedStateName)
    return state?.iso2 ?? ""
  }, [selectedStateName, states])

  React.useEffect(() => {
    if (countriesCacheRef.current) {
      setCountries(countriesCacheRef.current)
      setIsCountriesLoading(false)
      return
    }

    let mounted = true

    async function loadCountries() {
      setIsCountriesLoading(true)

      try {
        const response = await fetch("/api/geo", { cache: "no-store" })
        const data = (await response.json()) as CountryResponse[]
        const nextCountries = Array.isArray(data) ? data : []

        if (mounted) {
          countriesCacheRef.current = nextCountries
          setCountries(nextCountries)
        }
      } catch {
        if (mounted) {
          setCountries([])
        }
      } finally {
        if (mounted) {
          setIsCountriesLoading(false)
        }
      }
    }

    void loadCountries()

    return () => {
      mounted = false
    }
  }, [])

  React.useEffect(() => {
    form.setValue("state", "")
    form.setValue("city", "")
    setCities([])

    if (!selectedCountryCode) {
      setIsStatesLoading(false)
      setStates([])
      return
    }

    const cachedStates = statesCacheRef.current.get(selectedCountryCode)
    if (cachedStates) {
      setStates(cachedStates)
      setIsStatesLoading(false)
      return
    }

    let mounted = true

    async function loadStates() {
      setIsStatesLoading(true)

      try {
        const response = await fetch(
          `/api/geo?countryCode=${encodeURIComponent(selectedCountryCode)}`,
          {
            cache: "no-store",
          }
        )
        const data = (await response.json()) as StateResponse[]
        const nextStates = Array.isArray(data) ? data : []

        if (mounted) {
          statesCacheRef.current.set(selectedCountryCode, nextStates)
          setStates(nextStates)
        }
      } catch {
        if (mounted) {
          setStates([])
        }
      } finally {
        if (mounted) {
          setIsStatesLoading(false)
        }
      }
    }

    void loadStates()

    return () => {
      mounted = false
    }
  }, [form, selectedCountryCode])

  React.useEffect(() => {
    form.setValue("city", "")

    if (!selectedCountryCode || !selectedStateCode) {
      setIsCitiesLoading(false)
      setCities([])
      return
    }

    const cityCacheKey = `${selectedCountryCode}:${selectedStateCode}`
    const cachedCities = citiesCacheRef.current.get(cityCacheKey)
    if (cachedCities) {
      setCities(cachedCities)
      setIsCitiesLoading(false)
      return
    }

    let mounted = true

    async function loadCities() {
      setIsCitiesLoading(true)

      try {
        const response = await fetch(
          `/api/geo?countryCode=${encodeURIComponent(selectedCountryCode)}&stateCode=${encodeURIComponent(selectedStateCode)}`,
          { cache: "no-store" }
        )
        const data = (await response.json()) as CityResponse[]
        const nextCities = Array.isArray(data) ? data : []

        if (mounted) {
          citiesCacheRef.current.set(cityCacheKey, nextCities)
          setCities(nextCities)
        }
      } catch {
        if (mounted) {
          setCities([])
        }
      } finally {
        if (mounted) {
          setIsCitiesLoading(false)
        }
      }
    }

    void loadCities()

    return () => {
      mounted = false
    }
  }, [form, selectedCountryCode, selectedStateCode])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSaving(true)

    try {
      const result = await updatePlayerProfile(data)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Perfil actualizado correctamente.")
      router.refresh()
    } catch {
      toast.error("Ocurrio un error al guardar los cambios.")
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    form.reset()
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-4">
        <CardTitle>Informacion del jugador</CardTitle>
        <CardDescription>
          Actualiza los datos de tu perfil de jugador.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form id="player-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* ── Perfil ── */}
            <FieldSet>
              <FieldLegend>Perfil</FieldLegend>
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="dominantHand"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="player-dominant-hand">
                        Mano dominante
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="player-dominant-hand"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="left">Izquierda</SelectItem>
                          <SelectItem value="right">Derecha</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="level"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="player-level">Nivel</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="player-level"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="md:col-span-2">
                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="player-gender">Genero</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            id="player-gender"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Femenino</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </FieldSet>

            <FieldSeparator />

            {/* ── Ubicacion ── */}
            <FieldSet>
              <FieldLegend>Ubicacion</FieldLegend>

              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  name="country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="player-country">Pais</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="player-country"
                          aria-invalid={fieldState.invalid}
                          disabled={isCountriesLoading}
                        >
                          <SelectValue
                            placeholder={
                              isCountriesLoading ? "Cargando..." : "Seleccionar"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {countries.map((country) => (
                            <SelectItem key={country.iso2} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="player-state">Estado</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="player-state"
                          aria-invalid={fieldState.invalid}
                          disabled={!selectedCountryCode || isStatesLoading}
                        >
                          <SelectValue
                            placeholder={
                              !selectedCountryCode
                                ? "Primero el pais"
                                : isStatesLoading
                                  ? "Cargando..."
                                  : "Seleccionar"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {states.map((state) => (
                            <SelectItem key={state.iso2} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="player-city">Ciudad</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="player-city"
                          aria-invalid={fieldState.invalid}
                          disabled={!selectedStateCode || isCitiesLoading}
                        >
                          <SelectValue
                            placeholder={
                              !selectedStateCode
                                ? "Primero el estado"
                                : isCitiesLoading
                                  ? "Cargando..."
                                  : "Seleccionar"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="birthDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="player-birth-date">
                      Fecha de nacimiento
                    </FieldLabel>
                    <InputGroup className="max-w-xs">
                      <Input
                        {...field}
                        id="player-birth-date"
                        aria-invalid={fieldState.invalid}
                        type="date"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>

            <FieldSeparator />

            {/* ── Bio ── */}
            <FieldSet>
              <FieldLegend>Bio</FieldLegend>

              <Controller
                name="bio"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="player-bio">Sobre ti</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="player-bio"
                        placeholder="Cuéntanos un poco sobre ti..."
                        rows={4}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reiniciar
        </Button>
        <Button type="submit" form="player-form" disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
