"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";

export function NavbarWrapper() {
    const pathname = usePathname();

    // Hide the navbar on the login page ("/"), but show it on all other pages.
    if (pathname === "/") return null;

    return <Navbar />;
}