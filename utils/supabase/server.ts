/**
 * Cookie-backed server Supabase client for Server Components / server actions.
 * SECURITY: session cookies drive auth — do not log cookie values.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/interfaces/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Builds a server Supabase client bound to the request cookie store.
 * SECURITY: session cookies — never log cookie values.
 * @throws If Supabase env vars are missing.
 */
export async function createClient() {

    if (!supabaseKey || !supabaseUrl) {
        throw new Error("Missing Supabase environment variables");
    }

    const cookieStore = await cookies();

    return createServerClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        })
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};
