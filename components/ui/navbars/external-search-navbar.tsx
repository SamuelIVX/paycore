"use client"

/**
 * Role/shell navbar UI: external search navbar.
 */
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * External Search Navbar component.
 * @returns The rendered ExternalSearchNavbar UI.
 * @example
 * <ExternalSearchNavbar />
 */
export function ExternalSearchNavbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 shadow-xs",
      )}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground hover:opacity-90 transition-opacity cursor-pointer no-underline"
          >
            <div className="shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="PayCore Logo"
                className="size-9 rounded-full object-cover ring-1 ring-border"
                width={36}
                height={36}
                priority
              />
            </div>

            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-base tracking-tight leading-none text-foreground">PayCore</span>
              <span className="text-[11px] font-medium text-muted-foreground leading-none mt-1">Directory Search</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
            aria-label="Toggle color theme"
            className="cursor-pointer"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground border border-border rounded-md cursor-pointer"
            size="sm"
            variant="ghost"
            asChild
          >
            <Link href="/" className="flex items-center gap-1.5 no-underline">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
