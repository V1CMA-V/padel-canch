"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

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
