'use client'

/**
 * Login page: email/password sign-in, then routes by profiles.role (MANAGER/EMPLOYEE).
 * SECURITY: auth credentials handled by Supabase Auth — never log passwords.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCircle2, Lock, Sparkles } from "lucide-react";
import PayCoreLogo from "../public/logo.png";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { canonicalizeAuthRole } from "@/lib/auth/roles";
import SplitText from "@/components/SplitText";

/**
 * Email/password login; routes by profiles.role after sign-in.
 * @returns The rendered LoginPage UI.
 */
export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError || !data.user) {
        alert("Invalid credentials.");
        return;
      }

      // Fetch user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        alert("Error fetching user profile.");
        await supabase.auth.signOut();
        return;
      }

      const role = canonicalizeAuthRole(profile?.role);

      if (role === "MANAGER") {
        router.push("/manager/dashboard");
        return;
      }
      if (role === "EMPLOYEE") {
        router.push("/employee/dashboard");
        return;
      }
      await supabase.auth.signOut();
      alert("Unauthorized role.");
    } catch {
      alert("Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-md border-border">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto relative size-16 rounded-full mb-3 overflow-hidden ring-1 ring-border shadow-xs">
            <Image
              src={PayCoreLogo}
              alt="PayCore Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
            <SplitText
              text="PayCore Login"
              delay={20}
              duration={0.4}
              ease="power2.out"
              splitType="chars"
              from={{ opacity: 0, y: 15 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="center"
            />
          </CardTitle>

          <CardDescription className="text-center text-sm text-muted-foreground mt-1">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative text-muted-foreground">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <UserCircle2 className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative text-muted-foreground">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                variant="default"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 cursor-pointer font-medium"
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>

              <div className="text-center pt-1">
                <Link
                  href="/internal-search"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline hover:underline"
                >
                  Searching for someone?
                </Link>
              </div>
            </div>
          </form>

          <section
            aria-labelledby="demo-heading"
            className="space-y-4 border-t pt-5"
          >
            <div className="space-y-1">
              <h2 id="demo-heading" className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Class project demo
              </h2>
              <p className="text-sm text-muted-foreground">
                PayCore is a class project demo. Try it using either demo account below.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                { role: "Manager", email: "johnsmith@paycore.com", password: "manager123" },
                { role: "Employee", email: "emilydavis@paycore.com", password: "employee123" },
              ].map((account) => (
                <div
                  key={account.role}
                  className="relative space-y-2 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/80"
                >
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    className="absolute top-3.5 right-3.5 cursor-pointer text-[11px] h-6 px-2.5 font-medium"
                    onClick={() => handleAutoFill(account.email, account.password)}
                  >
                    Auto Fill
                  </Button>
                  <h3 className="text-sm font-semibold text-foreground pr-20">{account.role}</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-muted-foreground">Email:</dt>
                      <dd className="min-w-0 select-text break-all font-mono text-xs text-foreground">{account.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-muted-foreground">Password:</dt>
                      <dd className="min-w-0 select-text break-all font-mono text-xs text-foreground">{account.password}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
