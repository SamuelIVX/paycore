'use client';

/**
 * App-wide React Query (QueryClient) provider.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

/**
 * App-wide React Query (QueryClient) provider.
 * @param children - Nested React nodes.
 * @returns The rendered Providers UI.
 * @example
 * // <Providers children={...} />
 */
export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}