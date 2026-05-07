'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { searchEmployeesByName, type EmployeeWithProfile } from "@/lib/supabase/employee";
import { ExternalSearchNavbar } from "@/components/ui/navbars/external-search-navbar";
import { Button } from "@/components/animate-ui/components/buttons/button";

function formatLocation(employee: EmployeeWithProfile) {
  const pieces = [
    employee.address_line,
    employee.city,
    employee.state,
    employee.zip_code,
  ].filter(Boolean);

  return pieces.length > 0 ? pieces.join(", ") : "Location not available";
}

export default function ExternalEmployeeSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EmployeeWithProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
      const employees = await searchEmployeesByName(trimmed);
      setResults(employees || []);
    } catch (searchError) {
      console.error(searchError);
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
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
          </div>
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
                <Button type="submit" variant="default" className="w-full sm:w-auto">
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
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Location</p>
                        <p className="mt-1 text-sm text-foreground">{formatLocation(employee)}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Phone(s)</p>
                        <p className="mt-1 text-sm text-foreground">{employee.phone || "Not available"}</p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Email</p>
                        <p className="mt-1 text-sm text-foreground">{employee.profiles?.email || "Not available"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
