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

  const existing = await prisma.club.findUnique({
    where: { ownerUserId: userId },
  })

  if (existing) {
    return { success: true, clubId: existing.id }
  }

  const baseSlug = slugify(session.user.name || "club")
  const uniqueSuffix = userId.slice(-6)
  const slug = `${baseSlug}-${uniqueSuffix}`

  const club = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { role: "CLUB" },
    })

    return tx.club.create({
      data: {
        ownerUserId: userId,
        name: session.user.name || "Mi Club",
        slug,
      },
    })
  })

  return { success: true, clubId: club.id }
}
