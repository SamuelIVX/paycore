/**
 * Root layout: theme + React Query providers and NavbarWrapper around all pages.
 */
import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { NavbarWrapper } from "./navbar-wrapper";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  title: "PayCore",
  description: "A web-based payroll management system...",
  icons: {
    icon: '/favicon.ico',
  }
};

/**
 * Root Layout component.
 * @param children - Nested React nodes.
 * @returns The rendered RootLayout UI.
 * @example
 * // <RootLayout children={...} />
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>

            <NavbarWrapper />

            {children}

          </Providers>
        </ThemeProvider>

      </body>
    </html >
  );
}
