"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const updateClubSchema = z.object({
  name: z.string().min(5).max(32),
  description: z.string().min(20).max(100),
  address: z.string().min(10).max(100),
  city: z.string().min(3).max(50),
  state: z.string().min(3).max(50),
  country: z.string().min(3).max(50),
  phone: z.string().min(10).max(15),
  website: z.string().url(),
})

const createTournamentSchema = z
  .object({
    name: z.string().trim().min(5).max(180),
    description: z.string().trim().max(5000).optional(),
    venueName: z.string().trim().max(150).optional(),
    venueAddress: z.string().trim().max(255).optional(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    registrationOpenAt: z.string().optional(),
    registrationCloseAt: z.string().optional(),
    status: z.enum([
      "DRAFT",
      "REGISTRATION_OPEN",
      "REGISTRATION_CLOSED",
      "IN_PROGRESS",
      "FINISHED",
      "CANCELLED",
    ]),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    rules: z.string().trim().max(5000).optional(),
    coverImageUrl: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (Number.isNaN(startDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Fecha de inicio invalida",
      })
    }

    if (Number.isNaN(endDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Fecha de finalizacion invalida",
      })
    }

    if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && endDate < startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "La fecha de finalizacion no puede ser anterior a la de inicio",
      })
    }
  })

export async function updateClubProfile(raw: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { error: "No autenticado" }
  }

  const parsed = updateClubSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  const club = await prisma.club.findUnique({
    where: { ownerUserId: session.user.id },
  })

  if (!club) {
    return { error: "No se encontro tu club" }
  }

  await prisma.club.update({
    where: { ownerUserId: session.user.id },
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      phone: data.phone,
      website: data.website,
    },
  })

  return { success: true }
}

function normalizeOptionalText(value?: string) {
  if (!value) return null

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

async function buildUniqueTournamentSlug(name: string) {
  const baseSlug = slugify(name).slice(0, 170) || "torneo"
  const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  let attempt = 1

  while (true) {
    const rawSlug = attempt === 1 ? `${baseSlug}-${dateSuffix}` : `${baseSlug}-${dateSuffix}-${attempt}`
    const slug = rawSlug.slice(0, 190)
    const existing = await prisma.tournament.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) {
      return slug
    }

    attempt += 1
  }
}

export async function createTournament(raw: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { error: "No autenticado" }
  }

  const parsed = createTournamentSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const club = await prisma.club.findUnique({
    where: { ownerUserId: session.user.id },
    select: { id: true },
  })

  if (!club) {
    return { error: "No se encontro tu club" }
  }

  const data = parsed.data
  const slug = await buildUniqueTournamentSlug(data.name)

  const tournament = await prisma.tournament.create({
    data: {
      clubId: club.id,
      name: data.name,
      slug,
      description: normalizeOptionalText(data.description),
      venueName: normalizeOptionalText(data.venueName),
      venueAddress: normalizeOptionalText(data.venueAddress),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      registrationOpenAt: data.registrationOpenAt ? new Date(data.registrationOpenAt) : null,
      registrationCloseAt: data.registrationCloseAt ? new Date(data.registrationCloseAt) : null,
      status: data.status,
      visibility: data.visibility,
      rules: normalizeOptionalText(data.rules),
      coverImageUrl: normalizeOptionalText(data.coverImageUrl),
    },
    select: { id: true },
  })

  return { success: true, tournamentId: tournament.id }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function promoteToClub() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { error: "No autenticado" }
  }

  const userId = session.user.id

  const baseSlug = slugify(session.user.name || "club")
  const uniqueSuffix = userId.slice(-6)
  const slug = `${baseSlug}-${uniqueSuffix}`

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { role: "CLUB" },
    })

    await tx.playerProfile.deleteMany({
      where: { userId },
    })

    const existing = await tx.club.findUnique({
      where: { ownerUserId: userId },
    })

    if (existing) {
      return { clubId: existing.id }
    }

    const club = await tx.club.create({
      data: {
        ownerUserId: userId,
        name: session.user.name || "Mi Club",
        slug,
      },
    })

    return { clubId: club.id }
  })

  return { success: true, clubId: result.clubId }
}
