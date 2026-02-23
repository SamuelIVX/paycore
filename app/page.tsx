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

import SplitText from "@/components/SplitText";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.SubmitEvent) => {
    e.preventDefault();
    // Simple authentication logic for demonstration purposes
    // Backend team, please replace this with better authentication (fetch from Supabase)
    // Also, implement proper error handling and security measures.

    if (username.toLowerCase().includes("manager")) {
      router.push("/manager/dashboard");
    } else if (username.toLowerCase().includes("employee")) {
      router.push("/employee/dashboard")
    } else {
      // Temporary error message display
      alert("Invalid credentials. Use 'manager' or 'employee' as username.");
    }
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
              text="PayCore Login Form"
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
            Enter your credentials to access your account.
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
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
          <p>Username: <span className="font-mono">manager</span> or <span className="font-mono">employee</span></p>
          <p>Password: <span className="font-mono">any</span></p>
        </div>

      </Card>
    </div >
  )
}
