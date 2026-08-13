"use client";
/**
 * Chooses Manager vs Employee navbar from the URL path; hidden on login and internal-search.
 * Temporary path heuristic — see TODO(#186).
 */
import { usePathname } from "next/navigation";
import { ManagerNavbar } from "@/components/ui/navbars/manager-navbar";
import { EmployeeNavbar } from "@/components/ui/navbars/employee-navbar";

/**
 * Renders ManagerNavbar or EmployeeNavbar from pathname, or null on / and /internal-search.
 */
export function NavbarWrapper() {
    const pathname = usePathname();

    // Hide the navbar on the login page ("/") and external search page.
    // The external search page has its own navbar.
    if (pathname === "/" || pathname === "/internal-search") return null;

    // TODO(#186): Path-based navbar is temporary — determine the user's role and render the matching navbar instead of relying on the URL path.
    if (pathname.startsWith("/manager")) {
        return <ManagerNavbar />;
    }

    return <EmployeeNavbar />;
}