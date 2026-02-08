'use client'

import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import Providers from "./providers";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide the navbar on the login page ("/"), but show it on all other pages.
  const isHiddenPage = pathname === "/";

  return (
    <html lang="en">

      <head>
        <title>PayCore</title>
        <meta
          name="description"
          content="A web-based payroll management system designed to simplify employee compensation processing." />
      </head>

      <body>

        {!isHiddenPage && (
          <header className="sticky top-0 z-10 flex p-4 gap-2 h-16 items-center">
            <Navbar />
          </header>
        )}

        <div>
          <Providers>{children}</Providers>
        </div>

      </body>
    </html>
  );
}
