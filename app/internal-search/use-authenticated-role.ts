'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAuthenticatedUserRoleAction } from "./actions";

type AuthenticatedRoleState = {
    role: string;
    userId: string | null;
};

export function useAuthenticatedRole(): AuthenticatedRoleState {
    const [authState, setAuthState] = useState<AuthenticatedRoleState>({
        role: 'visitor',
        userId: null,
    });

    useEffect(() => {
        const supabase = createClient();
        let mounted = true;
        let requestId = 0;

        const handleSession = async (userId: string | null) => {
            const currentRequestId = ++requestId;
            if (!userId) {
                if (mounted) setAuthState({ role: 'visitor', userId: null });
                return;
            }

            try {
                const next = await getAuthenticatedUserRoleAction();
                if (mounted && currentRequestId === requestId) {
                    setAuthState({ role: next, userId });
                }
            } catch (err) {
                console.error("Error loading user role:", err);
                if (mounted && currentRequestId === requestId) {
                    setAuthState({ role: 'visitor', userId: null });
                }
            }
        };

        supabase.auth.getSession().then(({ data }) => {
            handleSession(data.session?.user.id ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                await handleSession(session?.user.id ?? null);
            },
        );

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    return authState;
}
