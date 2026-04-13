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
