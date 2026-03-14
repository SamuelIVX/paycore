import { createClient } from "@/utils/supabase/client"

export async function getCurrentEmployee() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    throw profileError ?? new Error("Profile not found")
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("*")
    .eq("profile.id", profile.id)
    .single()

  if (employeeError || !employee) {
    throw employeeError ?? new Error("Employee record not found")
  }

  return {
    user,
    profile,
    employee,
  }
}