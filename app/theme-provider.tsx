"use client"

/**
 * next-themes ThemeProvider wrapper for light/dark/system.
 */
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Renders the Theme Provider UI.
 */
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}