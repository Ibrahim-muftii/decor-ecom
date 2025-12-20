'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';
import { useAppDispatch } from './hooks';
import { setCredentials, logout, setLoading } from './features/authSlice';

export default function AuthSync() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get initial session
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    const { role } = await fetchRole(session.user.id);
                    dispatch(setCredentials({ user: session.user, role }));
                } else {
                    dispatch(logout());
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                dispatch(logout());
            } finally {
                dispatch(setLoading(false));
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (session) {
                    const { role } = await fetchRole(session.user.id);
                    dispatch(setCredentials({ user: session.user, role }));

                    // Optional: Handle redirects based on event type if needed
                    if (event === 'SIGNED_IN') {
                        router.refresh();
                    }
                } else {
                    dispatch(logout());
                    router.refresh();
                }
            });

            return () => subscription.unsubscribe();
        };

        initializeAuth();
    }, [dispatch, router]);

    return null; // This component renders nothing
}

async function fetchRole(userId: string): Promise<{ role: 'admin' | 'user' }> {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        return { role: data?.role === 'admin' ? 'admin' : 'user' };
    } catch {
        return { role: 'user' };
    }
}
