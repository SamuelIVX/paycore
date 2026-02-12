"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  LogOut,
  House,
  Users,
  CreditCard,
  FileText,
} from "lucide-react"
import Link from "next/link"

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      aria-label="Logo"
      role="img"
      fill="none"
      height="1em"
      viewBox="0 0 324 323"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...(props as any)}
    >
      <rect fill="currentColor" height="323" rx="161.5" width="323" x="0.5" />
      <circle cx="162" cy="161.5" fill="white" r="60" className="dark:fill-black" />
    </svg>
  )
}

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
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
    {...(props as any)}
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

// Types
export interface ManagerNavbarNavLink {
  href: string
  icon?: React.ReactNode
  label: string
  active?: boolean
}

export interface ManagerNavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  logoHref?: string
  navigationLinks?: ManagerNavbarNavLink[]
  logoutText?: string
  logoutHref?: string
  onLogoutClick?: () => void
}

// Default navigation links
const defaultNavigationLinks: ManagerNavbarNavLink[] = [
  { href: "/manager/dashboard", icon: <House />, label: "Home" },
  { href: "/manager/employee-table", icon: <Users />, label: "Employees" },
  { href: "/manager/payroll-table/table", icon: <CreditCard />, label: "Payroll" },
  { href: "/manager/benefits", icon: <FileText />, label: "Benefits" },
]

export const ManagerNavbar = React.forwardRef<HTMLElement, ManagerNavbarProps>(
  (
    {
      // TODO (Backend team) - fix navigation links for logout button and icons (via Next.js Link component)
      className,
      logoHref = "#",
      navigationLinks = defaultNavigationLinks,
      logoutText = "Log Out",
      logoutHref = "#logout",
      onLogoutClick,
      ...props
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef<HTMLElement>(null)

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth
          setIsMobile(width < 768) // 768px is md breakpoint
        }
      }

      checkWidth()

      const resizeObserver = new ResizeObserver(checkWidth)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        resizeObserver.disconnect()
      }
    }, [])

    // Combine refs
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

    return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur bg-primary-foreground px-4 md:px-6 **:no-underline",
          className,
        )}
        ref={combinedRef}
        {...(props as any)}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">

          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    size="icon"
                    variant="ghost"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-1">

                      {navigationLinks.map((link) => (
                        <NavigationMenuItem className="w-full" key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                              link.active
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/80",
                            )}
                          >
                            {link.icon && <span className="mr-2 h-4 w-4 items-center flex ">{link.icon}</span>}
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}

                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                className="flex items-center gap-3 text-primary hover:text-primary/90 transition-colors cursor-pointer"
                onClick={e => e.preventDefault()}
              >
                <div className="shrink-0">
                  <LayoutDashboard className="h-10 w-10" />
                </div>

                <div className="flex flex-col items-start justify-center">
                  <h1 className="font-semibold text-lg leading-tight">PayCore</h1>
                  <p className="text-xs text-muted-foreground leading-tight">Manager Dashboard</p>
                </div>
              </button>

              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link) => (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                            link.active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground/80",
                          )}
                        >
                          {link.icon && <span className="mr-2 h-5 w-5 items-center flex ">{link.icon}</span>}
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              className="text-sm font-medium hover:bg-accent hover:text-accent-foreground border border-border rounded-md cursor-pointer"
              onClick={e => {
                e.preventDefault()
                if (onLogoutClick) {
                  onLogoutClick()
                }
              }}
              size="sm"
              variant="ghost"
            >
              <LogOut className="mr-2" />
              {logoutText}
            </Button>
          </div>

        </div>
      </header >
    )
  },
)

ManagerNavbar.displayName = "ManagerNavbar"

export { Logo, HamburgerIcon }