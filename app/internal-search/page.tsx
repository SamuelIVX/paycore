'use client'

/**
 * Internal employee directory search UI with role-tiered result cards.
 */
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { type EmployeeWithProfile } from "@/lib/supabase/employee";
import { searchEmployeesByNameAction } from "./actions";
import { ExternalSearchNavbar } from "@/components/ui/navbars/external-search-navbar";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthenticatedRole } from "./use-authenticated-role";
import { EmployeeResultCard } from "./employee-result-card";

type SearchState = {
  sessionKey: string;
  query: string;
  results: EmployeeWithProfile[];
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;
};

function createSearchState(sessionKey: string): SearchState {
  return {
    sessionKey,
    query: "",
    results: [],
    isSearching: false,
    error: null,
    hasSearched: false,
  };
}

/**
 * Default export: External Employee Search Page.
 */
export default function ExternalEmployeeSearchPage() {
  const { role, userId } = useAuthenticatedRole();
  const sessionKey = userId ?? "visitor";
  const latestSessionKey = useRef(sessionKey);

  useEffect(() => {
    latestSessionKey.current = sessionKey;
  }, [sessionKey]);

  const [searchState, setSearchState] = useState<SearchState>(() =>
    createSearchState(sessionKey),
  );
  const currentSearchState =
    searchState.sessionKey === sessionKey ? searchState : createSearchState(sessionKey);
  const { query, results, isSearching, error, hasSearched } = currentSearchState;

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSearching) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchState({
        ...currentSearchState,
        error: "Enter a name to search.",
        hasSearched: false,
      });
      return;
    }

    const requestSessionKey = sessionKey;
    setSearchState({
      ...currentSearchState,
      error: null,
      isSearching: true,
      hasSearched: true,
    });

    try {
      const { results: employees } = await searchEmployeesByNameAction(trimmed);
      if (latestSessionKey.current !== requestSessionKey) return;

      setSearchState({
        sessionKey: requestSessionKey,
        query,
        results: employees,
        isSearching: false,
        error: null,
        hasSearched: true,
      });
    } catch (searchError) {
      if (latestSessionKey.current !== requestSessionKey) return;

      console.error(searchError);
      setSearchState({
        sessionKey: requestSessionKey,
        query,
        results: [],
        isSearching: false,
        error: "Search failed. Please try again.",
        hasSearched: true,
      });
    }
  };

  const visibleResults = role === "visitor" ? [] : results;
  const visibleHasSearched = role === "visitor" ? false : hasSearched;
  const showEmptyState = visibleHasSearched && !error && !isSearching && visibleResults.length === 0;
  const showResults = visibleResults.length > 0;

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
                      onChange={(e) =>
                        setSearchState({
                          ...currentSearchState,
                          query: e.target.value,
                        })
                      }
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
                {visibleResults.length} {visibleResults.length === 1 ? "result" : "results"}
              </p>
              <div className="space-y-3">
                {visibleResults.map((employee) => (
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
