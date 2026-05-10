'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAuthenticatedUserRoleAction } from "./actions";

export function useAuthenticatedRole(): string {
    const [role, setRole] = useState<string>('visitor');

    useEffect(() => {
        const supabase = createClient();
        let mounted = true;

        const handleSession = async (hasSession: boolean) => {
            if (!hasSession) {
                if (mounted) setRole('visitor');
                return;
            }

            try {
                const next = await getAuthenticatedUserRoleAction();
                if (mounted) setRole(next);
            } catch (err) {
                console.error("Error loading user role:", err);
                if (mounted) setRole('visitor');
            }
        };

        supabase.auth.getSession().then(({ data }) => {
            handleSession(Boolean(data.session?.user.id));
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                await handleSession(Boolean(session?.user.id));
            },
        );

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    return role;
}
