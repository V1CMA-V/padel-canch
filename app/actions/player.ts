"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { z } from "zod"

const updateProfileSchema = z.object({
  dominantHand: z.enum(["left", "right"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(3).max(50),
  state: z.string().min(3).max(50),
  country: z.string().min(3).max(50),
  birthDate: z
    .string()
    .min(1)
    .refine((v) => !Number.isNaN(new Date(v).getTime())),
  bio: z.string().max(500).optional(),
})

export async function updatePlayerProfile(raw: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { error: "No autenticado" }
  }

  const parsed = updateProfileSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Datos invalidos", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data

  const profile = await prisma.playerProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return { error: "No se encontro tu perfil de jugador" }
  }

  await prisma.playerProfile.update({
    where: { userId: session.user.id },
    data: {
      dominantHand: data.dominantHand,
      level: data.level,
      gender: data.gender,
      city: data.city,
      state: data.state,
      country: data.country,
      birthDate: new Date(data.birthDate),
      bio: data.bio ?? null,
    },
  })

  return { success: true }
}
