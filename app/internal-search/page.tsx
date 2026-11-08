'use client'

/**
 * Internal employee directory search UI with role-tiered result cards and adaptive shell navbar.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Lock, Search, Users, X } from "lucide-react";
import { type EmployeeWithProfile } from "@/lib/supabase/employee";
import { searchEmployeesByNameAction } from "./actions";
import { ManagerNavbar } from "@/components/ui/navbars/manager-navbar";
import { EmployeeNavbar } from "@/components/ui/navbars/employee-navbar";
import { ExternalSearchNavbar } from "@/components/ui/navbars/external-search-navbar";
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
 * Renders the role-appropriate navigation bar for the search view.
 */
function SearchHeaderNavbar({ role }: { role: string }) {
  if (role === "manager") {
    return <ManagerNavbar />;
  }
  if (role === "employee") {
    return <EmployeeNavbar />;
  }
  return <ExternalSearchNavbar />;
}

/**
 * Employee directory search page with role-aware result cards.
 * @returns Search UI for looking up coworkers by name.
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

  const handleSearchQuery = async (searchName: string) => {
    if (isSearching) return;
    const trimmed = searchName.trim();
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
      query: searchName,
      error: null,
      isSearching: true,
      hasSearched: true,
    });

    try {
      const { results: employees } = await searchEmployeesByNameAction(trimmed);
      if (latestSessionKey.current !== requestSessionKey) return;

      setSearchState({
        sessionKey: requestSessionKey,
        query: searchName,
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
        query: searchName,
        results: [],
        isSearching: false,
        error: "Search failed. Please try again.",
        hasSearched: true,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchQuery(query);
  };

  const isVisitor = role === "visitor";
  const visibleResults = isVisitor ? [] : results;
  const visibleHasSearched = isVisitor ? false : hasSearched;
  const showEmptyState = visibleHasSearched && !error && !isSearching && visibleResults.length === 0;
  const showResults = visibleResults.length > 0;

  return (
    <>
      <SearchHeaderNavbar role={role} />

      <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-8 text-foreground">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {/* Header */}
          <header className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Employee Directory</h1>
              {role === "manager" && (
                <Badge variant="outline" className="text-xs">
                  Manager View · Elevated Records
                </Badge>
              )}
              {role === "employee" && (
                <Badge variant="secondary" className="text-xs">
                  Team Directory
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Search colleagues across departments by first or last name.
            </p>
          </header>

          {/* Visitor Notice */}
          {isVisitor && (
            <Card className="border-border bg-muted/40">
              <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sign In Required</p>
                    <p className="text-xs text-muted-foreground">
                      Company directory records are restricted to authenticated team members.
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" className="w-full sm:w-auto shrink-0 cursor-pointer">
                  <Link href="/">Sign In to Search</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Search Box */}
          <Card className="shadow-xs border-border">
            <CardContent className="p-5">
              <form onSubmit={handleFormSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="external-search" className="text-xs font-medium text-foreground">
                    Search Name
                  </Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="external-search"
                      placeholder={isVisitor ? "Sign in to search employees" : "Type a name (e.g. John, Emily, Sarah)..."}
                      disabled={isVisitor}
                      value={query}
                      onChange={(e) =>
                        setSearchState({
                          ...currentSearchState,
                          query: e.target.value,
                        })
                      }
                      className="pl-9 pr-8"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "external-search-error" : undefined}
                    />
                    {query && !isSearching && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearchState({
                            ...currentSearchState,
                            query: "",
                            results: [],
                            hasSearched: false,
                            error: null,
                          })
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Clear search input"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick suggestions when not visitor */}
                {!isVisitor && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="text-[11px]">Quick search:</span>
                    {["John", "Emily", "Sarah", "Michael"].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => handleSearchQuery(sample)}
                        className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent cursor-pointer"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="default"
                  className="w-full sm:w-auto sm:justify-self-end cursor-pointer"
                  disabled={isSearching || isVisitor}
                >
                  {isSearching ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Searching…
                    </span>
                  ) : (
                    "Search Directory"
                  )}
                </Button>
              </form>

              {error && (
                <p id="external-search-error" className="mt-3 text-xs text-destructive">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Empty State */}
          {showEmptyState && (
            <Card className="border-dashed border-border bg-card/40">
              <CardContent className="p-8 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">No matching employees found</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  We couldn&apos;t find any team members matching &ldquo;{query}&rdquo;. Try checking the spelling or searching by first name only.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {showResults && (
            <section className="space-y-3" aria-label="Search results">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {visibleResults.length} {visibleResults.length === 1 ? "Employee Found" : "Employees Found"}
                </p>
              </div>
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
