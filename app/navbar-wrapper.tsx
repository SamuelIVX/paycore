"use client";
import { usePathname } from "next/navigation";
import { ManagerNavbar } from "@/components/ui/navbars/manager-navabar";
import { EmployeeNavbar } from "@/components/ui/navbars/employee-navbar";

export function NavbarWrapper() {
    const pathname = usePathname();

    // Hide the navbar on the login page ("/"), but show it on all other pages.
    if (pathname === "/") return null;

    // TODO (backend team): This is a temporary solution. We should ideally determine the user's role and render the appropriate navbar based on that,
    // rather than relying on the URL path. 
    if (pathname.startsWith("/manager/dashboard")) {
        return <ManagerNavbar />;
    }

    return <EmployeeNavbar />;
}