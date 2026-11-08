"use client"

/**
 * Role/shell navbar UI: employee navbar.
 * Powered by unified AppNavbar.
 */
import * as React from "react"
import { FileText, HandCoins, House, Search } from "lucide-react"
import {
  AppNavbar,
  AppNavbarNavLink,
  AppNavbarProps,
  HamburgerIcon,
  Logo,
} from "./app-navbar"

export type EmployeeNavbarNavLink = AppNavbarNavLink

export interface EmployeeNavbarProps extends Omit<AppNavbarProps, "navigationLinks"> {
  navigationLinks?: EmployeeNavbarNavLink[]
}

const defaultNavigationLinks: EmployeeNavbarNavLink[] = [
  { href: "/employee/dashboard", icon: <House className="h-4 w-4" />, label: "Home" },
  { href: "/internal-search", icon: <Search className="h-4 w-4" />, label: "Internal Search" },
  { href: "/employee/benefits", icon: <FileText className="h-4 w-4" />, label: "Benefits" },
  { href: "/employee/paystubs", icon: <HandCoins className="h-4 w-4" />, label: "Pay Stubs" },
]

/**
 * Employee Navbar component.
 * @returns The rendered EmployeeNavbar UI.
 */
export const EmployeeNavbar = React.forwardRef<HTMLElement, EmployeeNavbarProps>(
  (
    {
      logoHref = "/employee/dashboard",
      navigationLinks = defaultNavigationLinks,
      roleTitle = "Employee Dashboard",
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

EmployeeNavbar.displayName = "EmployeeNavbar"

export { Logo, HamburgerIcon }
