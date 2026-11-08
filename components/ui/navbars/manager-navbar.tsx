"use client"

/**
 * Role/shell navbar UI: manager navbar.
 * Powered by unified AppNavbar.
 */
import * as React from "react"
import { CreditCard, FileText, House, Search, Users } from "lucide-react"
import {
  AppNavbar,
  AppNavbarNavLink,
  AppNavbarProps,
  HamburgerIcon,
  Logo,
} from "./app-navbar"

export type ManagerNavbarNavLink = AppNavbarNavLink

export interface ManagerNavbarProps extends Omit<AppNavbarProps, "navigationLinks"> {
  navigationLinks?: ManagerNavbarNavLink[]
}

const defaultNavigationLinks: ManagerNavbarNavLink[] = [
  { href: "/manager/dashboard", icon: <House className="h-4 w-4" />, label: "Home" },
  { href: "/internal-search", icon: <Search className="h-4 w-4" />, label: "Internal Search" },
  { href: "/manager/employee-table", icon: <Users className="h-4 w-4" />, label: "Employees" },
  { href: "/manager/payroll-records-table", icon: <CreditCard className="h-4 w-4" />, label: "Payroll" },
  { href: "/manager/benefits", icon: <FileText className="h-4 w-4" />, label: "Benefits" },
]

/**
 * Manager Navbar component.
 * @returns The rendered ManagerNavbar UI.
 */
export const ManagerNavbar = React.forwardRef<HTMLElement, ManagerNavbarProps>(
  (
    {
      logoHref = "/manager/dashboard",
      navigationLinks = defaultNavigationLinks,
      roleTitle = "Manager Dashboard",
      ...props
    },
    ref,
  ) => {
    return (
      <AppNavbar
        ref={ref}
        logoHref={logoHref}
        navigationLinks={navigationLinks}
        roleTitle={roleTitle}
        {...props}
      />
    )
  },
)

ManagerNavbar.displayName = "ManagerNavbar"

export { Logo, HamburgerIcon }
