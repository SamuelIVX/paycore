import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/interfaces/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseKey || !supabaseUrl) {
    throw new Error("Missing Supabase environment variables");
}

export const createClient = () =>
    createBrowserClient<Database>(
        supabaseUrl,
        supabaseKey,
    );
