'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { type EmployeeWithProfile } from "@/lib/supabase/employee";
import { searchEmployeesByNameAction } from "./actions";
import { ExternalSearchNavbar } from "@/components/ui/navbars/external-search-navbar";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthenticatedRole } from "./use-authenticated-role";
import { EmployeeResultCard } from "./employee-result-card";
import { capitalizeRole } from "./utils";

export default function ExternalEmployeeSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EmployeeWithProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const role = useAuthenticatedRole();

  // Clear results when the user logs out so privileged data isn't left on screen.
  useEffect(() => {
    if (role === 'visitor') {
      setResults([]);
      setHasSearched(false);
    }
  }, [role]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSearching) return;
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
      const { results: employees } = await searchEmployeesByNameAction(trimmed);
      setResults(employees);
    } catch (searchError) {
      console.error(searchError);
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const showEmptyState = hasSearched && !error && !isSearching && results.length === 0;
  const showResults = results.length > 0;

  return (
    <>
      <ExternalSearchNavbar />
      <div className="min-h-[calc(100vh-73px)] bg-background px-4 pb-16 pt-12 text-foreground">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <header className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Search for someone</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Find a teammate by their first or last name in the company directory.
            </p>
          </header>

          <Card>
            <CardContent className="p-5">
              <form onSubmit={handleSearch} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="external-search">Name</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="external-search"
                      placeholder="Type a first or last name"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "external-search-error" : undefined}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full sm:w-auto sm:justify-self-end"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Searching…
                    </span>
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>

              {error && (
                <p id="external-search-error" className="mt-3 text-sm text-destructive">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {showEmptyState && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <p className="text-sm font-medium text-foreground">No matching employee found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different name or check your spelling.
                </p>
              </CardContent>
            </Card>
          )}

          {showResults && (
            <section className="space-y-3" aria-label="Search results">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <div className="space-y-3">
                {results.map((employee) => (
                  <EmployeeResultCard key={employee.id} employee={employee} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
