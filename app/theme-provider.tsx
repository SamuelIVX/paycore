"use client"

/**
 * next-themes ThemeProvider wrapper for light/dark/system.
 */
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Theme Provider component.
 * @param children - Nested React nodes.
 * @returns The rendered ThemeProvider UI.
 * @example
 * <ThemeProvider children={...} />
 */
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}