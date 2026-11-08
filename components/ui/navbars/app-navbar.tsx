"use client"

/**
 * Unified application shell navigation bar for Manager and Employee views.
 */
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { LogOut, Moon, Sun } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

/**
 * Standard PayCore SVG Logo primitive.
 */
export const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      aria-label="PayCore Logo"
      role="img"
      fill="none"
      height="1em"
      viewBox="0 0 324 323"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="currentColor" height="323" rx="161.5" width="323" x="0.5" />
      <circle cx="162" cy="161.5" fill="white" r="60" className="dark:fill-black" />
    </svg>
  )
}

/**
 * Animated hamburger / close menu icon.
 */
export const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    aria-label="Menu"
    className={cn("pointer-events-none", className)}
    fill="none"
    height={16}
    role="img"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
      d="M4 12L20 12"
    />
    <path
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
      d="M4 12H20"
    />
    <path
      className="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
      d="M4 12H20"
    />
  </svg>
)

export interface AppNavbarNavLink {
  href: string
  icon?: React.ReactNode
  label: string
  active?: boolean
}

export interface AppNavbarProps extends React.HTMLAttributes<HTMLElement> {
  roleTitle?: string
  logo?: React.ReactNode
  logoHref?: string
  navigationLinks?: AppNavbarNavLink[]
  logoutText?: string
  logoutHref?: string
  onLogoutClick?: () => void
}

/**
 * Unified AppNavbar component with automatic route highlighting and responsive mobile drawer.
 */
export const AppNavbar = React.forwardRef<HTMLElement, AppNavbarProps>(
  (
    {
      className,
      roleTitle = "Dashboard",
      logo,
      logoHref = "/manager/dashboard",
      navigationLinks = [],
      logoutText = "Log Out",
      logoutHref = "/",
      onLogoutClick,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobile, setIsMobile] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const containerRef = useRef<HTMLElement>(null)
    const { setTheme } = useTheme()

    const handleLogout = async (e: React.MouseEvent) => {
      e.preventDefault()
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch {
        // Fallback if supabase client fails
      }
      if (onLogoutClick) {
        onLogoutClick()
      }
      router.push(logoutHref)
    }

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth
          setIsMobile(width < 768)
        }
      }

      checkWidth()

      if (typeof ResizeObserver === "undefined") return

      const resizeObserver = new ResizeObserver(checkWidth)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        resizeObserver.disconnect()
      }
    }, [])

    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    const switchTheme = () => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    const isLinkActive = (link: AppNavbarNavLink) => {
      if (typeof link.active === "boolean") return link.active
      if (!pathname) return false
      if (pathname === link.href) return true
      if (
        link.href !== "/manager/dashboard" &&
        link.href !== "/employee/dashboard" &&
        link.href !== "/" &&
        pathname.startsWith(link.href)
      ) {
        return true
      }
      return false
    }

    return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 shadow-xs",
          className,
        )}
        ref={combinedRef}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side brand + links */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Mobile popover trigger */}
            {isMobile && (
              <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    size="icon"
                    variant="ghost"
                    aria-label="Toggle navigation menu"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-2 shadow-lg">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-1 w-full">
                      {navigationLinks.map((link) => {
                        const active = isLinkActive(link)
                        return (
                          <NavigationMenuItem className="w-full" key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer no-underline",
                                active
                                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                              )}
                            >
                              {link.icon && <span className="h-4 w-4 shrink-0 flex items-center">{link.icon}</span>}
                              <span>{link.label}</span>
                            </Link>
                          </NavigationMenuItem>
                        )
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {/* Brand Logo & Title */}
            <Link
              href={logoHref}
              className="flex items-center gap-3 text-foreground hover:opacity-90 transition-opacity cursor-pointer no-underline"
            >
              <div className="shrink-0 flex items-center justify-center">
                {logo ?? (
                  <Image
                    src="/logo.png"
                    alt="PayCore Logo"
                    className="size-9 rounded-full object-cover ring-1 ring-border"
                    width={36}
                    height={36}
                    priority
                  />
                )}
              </div>

              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-base tracking-tight leading-none text-foreground">PayCore</span>
                <span className="text-[11px] font-medium text-muted-foreground leading-none mt-1">{roleTitle}</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <NavigationMenu className="flex">
                <NavigationMenuList className="gap-1">
                  {navigationLinks.map((link) => {
                    const active = isLinkActive(link)
                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer no-underline",
                            active
                              ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                          )}
                        >
                          {link.icon && <span className="h-4 w-4 shrink-0 flex items-center">{link.icon}</span>}
                          <span>{link.label}</span>
                        </Link>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Right side utilities */}
          <div className="flex items-center gap-2">
            <Button
              onClick={switchTheme}
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
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              asChild
            >
              <Link href={logoutHref} className="flex items-center gap-1.5 no-underline">
                <LogOut className="h-4 w-4" />
                <span>{logoutText}</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
    )
  },
)

AppNavbar.displayName = "AppNavbar"
