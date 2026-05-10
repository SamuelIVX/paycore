'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { searchEmployeesByName, getCurrentUserRole, type EmployeeWithProfile } from "@/lib/supabase/employee";
import { createClient } from "@/utils/supabase/client";
import { ExternalSearchNavbar } from "@/components/ui/navbars/external-search-navbar";
import { Button } from "@/components/animate-ui/components/buttons/button";

function formatLocation(employee: EmployeeWithProfile) {
  const pieces = [
    ('address_line' in employee ? employee.address_line : null),
    ('city' in employee ? employee.city : null),
    ('state' in employee ? employee.state : null),
    ('zip_code' in employee ? employee.zip_code : null),
  ].filter(Boolean);

  return pieces.length > 0 ? pieces.join(", ") : "Location not available";
}

function hasPayInfo(employee: EmployeeWithProfile): employee is EmployeeWithProfile & { pay_rate: number } {
  return 'pay_rate' in employee;
}

function hasAddressInfo(employee: EmployeeWithProfile): employee is EmployeeWithProfile & { address_line: string } {
  return 'address_line' in employee;
}

export default function ExternalEmployeeSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EmployeeWithProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  // Fetch user role on mount and listen for auth changes
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const loadUserRole = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log("Auth check - has user:", !!user, "error:", authError?.message);
        
        if (authError || !user) {
          console.log("No authenticated user, setting to visitor");
          if (mounted) {
            setUserRole('visitor');
            setResults([]);
            setHasSearched(false);
            setIsLoadingRole(false);
          }
          return;
        }

        // User is authenticated, get their role
        const role = await getCurrentUserRole();
        console.log("User role loaded:", role);
        if (mounted) {
          setUserRole(role ?? 'visitor');
          setIsLoadingRole(false);
        }
      } catch (err) {
        console.error("Error loading user role:", err);
        if (mounted) {
          setUserRole('visitor');
          setResults([]);
          setHasSearched(false);
          setIsLoadingRole(false);
        }
      }
    };

    loadUserRole();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, _session) => {
        console.log("Auth state changed:", _event);
        await loadUserRole();
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a name to search.");
      setHasSearched(false);
      return;
    }

    setError(null);
    setIsSearching(true);
    setHasSearched(true);

    try {
      const employees = await searchEmployeesByName(trimmed, userRole);
      console.log("Search returned results with role:", userRole);
      console.log("Results count:", employees?.length);
      if (employees && employees.length > 0) {
        console.log("First result keys:", Object.keys(employees[0]));
        console.log("First result:", employees[0]);
        console.log("Has address info:", hasAddressInfo(employees[0]));
        console.log("Has pay info:", hasPayInfo(employees[0]));
      }
      setResults(employees || []);
    } catch (searchError) {
      console.error(searchError);
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper function to display role with proper capitalization
  const displayRole = () => {
    if (!userRole) return 'visitor';
    const normalized = userRole.toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <>
      <ExternalSearchNavbar />
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 py-10 bg-background text-foreground">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Search for Someone</h1>
            <p className="mt-2 text-muted-foreground">
              Enter a name to look up a person in our company directory.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {isLoadingRole ? (
                "Loading access level..."
              ) : (
                <>
                  Your access level: <span className="font-semibold capitalize">{displayRole()}</span>
                </>
              )}
            </p>
          </div>

          {isLoadingRole ? (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <form onSubmit={handleSearch} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="external-search">Enter a name</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </span>
                    <Input
                      id="external-search"
                      placeholder="Type a first or last name"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" variant="default" className="w-full sm:w-auto" disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Results will only appear after a name is entered.
                  </p>
                </div>
              </form>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

              {hasSearched && !error && !isSearching && results.length === 0 && (
                <p className="mt-6 text-sm text-muted-foreground">No matching employee found.</p>
              )}

              {results.length > 0 && (
                <div className="mt-6 space-y-4">
                  {results.map((employee) => (
                    <div key={employee.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            {employee.first_name ?? ""} {employee.last_name ?? ""}
                          </p>
                          <p className="text-sm text-muted-foreground">{employee.position || "Title not available"}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Phone(s)</p>
                          <p className="mt-1 text-sm text-foreground">{employee.phone || "Not available"}</p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Email</p>
                          <p className="mt-1 text-sm text-foreground">{employee.profiles?.email || "Not available"}</p>
                        </div>

                        {hasAddressInfo(employee) && (
                          <div className="sm:col-span-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Location</p>
                            <p className="mt-1 text-sm text-foreground">{formatLocation(employee)}</p>
                          </div>
                        )}

                        {hasPayInfo(employee) && (
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Pay Rate</p>
                            <p className="mt-1 text-sm text-foreground">${employee.pay_rate?.toLocaleString() || "N/A"}</p>
                          </div>
                        )}

                        {('pay_frequency' in employee) && (
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Pay Frequency</p>
                            <p className="mt-1 text-sm text-foreground">{(employee as any).pay_frequency || "N/A"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
