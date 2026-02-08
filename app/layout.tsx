import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { NavbarWrapper } from "./navbar-wrapper";

export const metadata: Metadata = {
  title: "PayCore",
  description: "A web-based payroll management system...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>

        <NavbarWrapper />

        <Providers>{children}</Providers>

      </body>
    </html >
  );
}
