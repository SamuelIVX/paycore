/**
 * Browser Supabase client factory (createBrowserClient).
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
 * throws at module load if either is missing.
 * SECURITY: publishable key only — never put service-role secrets in NEXT_PUBLIC_*.
 */
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/interfaces/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseKey || !supabaseUrl) {
    throw new Error("Missing Supabase environment variables");
}

/**
 * Returns a typed browser Supabase client.
 * SECURITY: uses the publishable anon key only.
 */
export const createClient = () =>
    createBrowserClient<Database>(
        supabaseUrl,
        supabaseKey,
    );
