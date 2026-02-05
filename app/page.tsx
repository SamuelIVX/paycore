'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCircle2, Lock } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Simple authentication logic for demonstration purposes
    // Backend team, please replace this with better authentication (fetch from Supabase)
    // Also, implement proper error handling and security measures.

    if (username.toLocaleLowerCase() === "manager" || username.toLocaleLowerCase().includes("manager")) {
      router.push("components/manager-dashboard");
    } else if (username.toLocaleLowerCase() === "employee" || username.toLocaleLowerCase().includes("employee")) {
      router.push("components/employee-dashboard")
    }

  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Card className="w-full max-w-md shadow-lg">

        <CardHeader>

          {/* This a temporary icon. Should be replaced by our logo. */}
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <UserCircle2 className="w-10 h-10 text-white" />
          </div>

          <CardTitle
            className="text-center text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Payroll System Login
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardFooter>

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
