"use client"

import { useEffect, useRef } from "react"
import { promoteToClub } from "@/app/actions/club"

export default function ClubCallbackPage() {
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    promoteToClub().then(() => {
      window.location.replace("/")
    })
  }, [])

  return (
    <main className="flex min-h-svh items-center justify-center p-6 text-sm text-muted-foreground">
      Configurando tu cuenta de club...
    </main>
  )
}
