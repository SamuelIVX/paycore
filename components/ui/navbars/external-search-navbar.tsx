"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExternalSearchNavbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur bg-primary-foreground px-4 md:px-6 no-underline",
      )}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:text-primary/90 transition-colors cursor-pointer"
          >
            <div className="shrink-0">
              <Image
                src="/logo.png"
                alt="PayCore Logo"
                className="size-15 rounded-full object-cover"
                width={60}
                height={60}
              />
            </div>

            <div className="flex flex-col items-start justify-center leading-tight">
              <span className="font-semibold text-base">PayCore</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground border border-border rounded-md"
            size="sm"
            variant="ghost"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
