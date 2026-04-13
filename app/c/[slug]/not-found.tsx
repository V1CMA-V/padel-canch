import { IconTournament } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ClubNotFound() {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center px-4 text-center">
      <IconTournament className="size-12 text-muted-foreground/30" />
      <h1 className="mt-4 text-xl font-semibold text-foreground">
        Club no encontrado
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        El club que buscas no existe o fue eliminado.
      </p>
      <Button variant="outline" className="mt-6" asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
