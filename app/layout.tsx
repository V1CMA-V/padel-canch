import { Geist_Mono, Noto_Sans, Noto_Serif } from "next/font/google"

import { Header } from "@/components/layout/header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import "./globals.css"

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
})

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable,
        notoSerifHeading.variable
      )}
    >
      <body>
        <TooltipProvider>
          <ThemeProvider>
            <Header />
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
