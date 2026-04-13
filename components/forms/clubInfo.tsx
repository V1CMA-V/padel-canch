"use client"

import { updateClubProfile } from "@/app/actions/club"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
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
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Club } from "@/generated/prisma/client"
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
  name: z
    .string()
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(32, "El nombre debe tener como maximo 32 caracteres."),
  description: z
    .string()
    .min(20, "La descripcion debe tener al menos 20 caracteres.")
    .max(100, "La descripcion debe tener como maximo 100 caracteres."),
  address: z
    .string()
    .min(10, "La direccion debe tener al menos 10 caracteres.")
    .max(100, "La direccion debe tener como maximo 100 caracteres."),
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
  phone: z
    .string()
    .min(10, "El telefono debe tener al menos 10 caracteres.")
    .max(15, "El telefono debe tener como maximo 15 caracteres."),
  website: z.string().url("URL del sitio web invalida"),
  logoUrl: z
    .instanceof(File)
    .refine((file) => file.size <= 1024 * 1024 * 5, {
      message: "El logo debe pesar menos de 5MB",
    })
    .refine(
      (file) =>
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg",
      {
        message: "El logo debe ser PNG, JPG o JPEG",
      }
    )
    .optional(),
})

export function ClubForm({ clubProfile }: { clubProfile: Club }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)
  const initialLogoPreviewUrl = clubProfile.logoUrl ?? ""
  const [countries, setCountries] = React.useState<CountryResponse[]>([])
  const [states, setStates] = React.useState<StateResponse[]>([])
  const [cities, setCities] = React.useState<CityResponse[]>([])
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState(initialLogoPreviewUrl)
  const [logoFileName, setLogoFileName] = React.useState("")
  const [logoInputKey, setLogoInputKey] = React.useState(0)

  const [isCountriesLoading, setIsCountriesLoading] = React.useState(true)
  const [isStatesLoading, setIsStatesLoading] = React.useState(false)
  const [isCitiesLoading, setIsCitiesLoading] = React.useState(false)
  const countriesCacheRef = React.useRef<CountryResponse[] | null>(null)
  const statesCacheRef = React.useRef<Map<string, StateResponse[]>>(new Map())
  const citiesCacheRef = React.useRef<Map<string, CityResponse[]>>(new Map())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clubProfile.name,
      description: clubProfile.description ?? "",
      address: clubProfile.address ?? "",
      city: clubProfile.city ?? "",
      state: clubProfile.state ?? "",
      country: clubProfile.country ?? "",
      phone: clubProfile.phone ?? "",
      website: clubProfile.website ?? "",
      logoUrl: undefined,
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

  React.useEffect(() => {
    return () => {
      if (logoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreviewUrl)
      }
    }
  }, [logoPreviewUrl])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSaving(true)

    try {
      const { logoUrl: _ignored, ...profileData } = data
      void _ignored
      const result = await updateClubProfile(profileData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Informacion del club actualizada correctamente.")
      router.refresh()
    } catch {
      toast.error("Ocurrio un error al guardar los cambios.")
    } finally {
      setIsSaving(false)
    }
  }

  function handleLogoChange(
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | undefined) => void
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      if (logoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreviewUrl)
      }
      setLogoPreviewUrl(initialLogoPreviewUrl)
      setLogoFileName("")
      onChange(undefined)
      return
    }

    if (logoPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl)
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    setLogoPreviewUrl(nextPreviewUrl)
    setLogoFileName(file.name)
    onChange(file)
  }

  function handleReset() {
    if (logoPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl)
    }
    setLogoPreviewUrl(initialLogoPreviewUrl)
    setLogoFileName("")
    setLogoInputKey((prev) => prev + 1)
    form.reset()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informacion del club</CardTitle>
        <CardDescription>Ingresa la informacion de tu club.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="club-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* ── Identidad ── */}
            <FieldSet>
              <FieldLegend>Identidad</FieldLegend>

              <Controller
                name="logoUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="club-logo">Logo</FieldLabel>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {logoPreviewUrl ? (
                        <Image
                          src={logoPreviewUrl}
                          alt="Vista previa del logo"
                          width={48}
                          height={48}
                          unoptimized
                          className="size-12 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                          Logo
                        </div>
                      )}
                      <InputGroup className="w-full flex-1">
                        <InputGroupInput
                          key={logoInputKey}
                          name={field.name}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          id="club-logo"
                          aria-invalid={fieldState.invalid}
                          type="file"
                          accept="image/png,image/jpg,image/jpeg"
                          onChange={(event) =>
                            handleLogoChange(event, field.onChange)
                          }
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText>
                            {logoFileName || "Ningun archivo seleccionado"}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="club-name">Nombre del club</FieldLabel>
                    <Input
                      {...field}
                      id="club-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Mi club"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="club-description">
                      Descripcion
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="club-description"
                        placeholder="Una breve descripcion de tu club..."
                        rows={3}
                        className="min-h-20 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/100
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>

            <FieldSeparator />

            {/* ── Ubicacion ── */}
            <FieldSet>
              <FieldLegend>Ubicacion</FieldLegend>

              <div className="grid gap-4 sm:grid-cols-3">
                <Controller
                  name="country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="club-country">Pais</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="club-country"
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
                      <FieldLabel htmlFor="club-state">Estado</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="club-state"
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
                      <FieldLabel htmlFor="club-city">Ciudad</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="club-city"
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
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="club-address">Direccion</FieldLabel>
                    <Input
                      {...field}
                      id="club-address"
                      aria-invalid={fieldState.invalid}
                      placeholder="Calle Principal 123, Oficina 4"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>

            <FieldSeparator />

            {/* ── Contacto ── */}
            <FieldSet>
              <FieldLegend>Contacto</FieldLegend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="club-phone">Telefono</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="club-phone"
                          aria-invalid={fieldState.invalid}
                          type="tel"
                          placeholder="+34 600 123 456"
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/15
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="website"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="club-website">Sitio web</FieldLabel>
                      <Input
                        {...field}
                        id="club-website"
                        aria-invalid={fieldState.invalid}
                        type="url"
                        placeholder="https://miclub.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reiniciar
        </Button>
        <Button type="submit" form="club-form" disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
