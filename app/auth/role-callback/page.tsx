import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function RoleCallbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user) {
    redirect("/sign-in")
  }

  if (user.role === "CLUB") {
    redirect("/clubs")
  }

  await prisma.playerProfile.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  })

  redirect("/player")
}
