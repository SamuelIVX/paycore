'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCircle2, Lock } from "lucide-react";
import PayCoreLogo from "../public/logo.png";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import SplitText from "@/components/SplitText";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { sup } from "motion/react-client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    // Authenticate with Supabase Auth (using signInWithPassword for simplicity)
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
      return;
    }

    const role = profile.role;

    if (role === "MANAGER") {
      router.push("/manager/dashboard");
      return;
    }
    if (role === "EMPLOYEE") {
      router.push("/employee/dashboard");
    }
    await supabase.auth.signOut();
    alert("Unauthorized role.");
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Card className="w-full max-w-md shadow-lg">

        <CardHeader>

          <div className="mx-auto relative size-32 rounded-full mb-2 overflow-hidden">
            <Image
              src={PayCoreLogo}
              alt="PayCore Logo"
              fill
              className="object-cover"
            />
          </div>


          <CardTitle
            className="text-center text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            <SplitText
              text="PayCore Login"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </CardTitle>

          <CardDescription
            className="text-center"
            style={{ color: "var(--muted-foreground)" }}
          >
            <EncryptedText
              text="Enter your credentials to access your account."
              revealDelayMs={50}
            />
          </CardDescription>

        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative" style={{ color: "var(--muted-foreground)" }}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5">
                    <UserCircle2 />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative" style={{ color: "var(--muted-foreground)" }}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5">
                    <Lock />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                variant="default"
                type="submit"
                className="w-full"
              >
                Login
              </Button>

            </div>

          </form>
        </CardContent>

        <div
          className="text-sm text-center p-4 bg-blue-100 rounded-md m-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Manager: <span className="font-mono">johnsmith@paycore.com</span></p>
          <p>Employee: <span className="font-mono">emilydavis@paycore.com</span></p>
        </div>

      </Card>
    </div >
  )
}
