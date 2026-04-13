import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

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

  if (user?.role === "CLUB") {
    redirect("/clubs")
  }

  if (user?.role === "PLAYER") {
    redirect("/player")
  }

  redirect("/")
}
