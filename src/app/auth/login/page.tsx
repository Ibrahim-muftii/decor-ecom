'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GlassInput from '@/components/GlassInput/GlassInput';
import GlassButton from '@/components/GlassButton/GlassButton';
import { supabase } from '@/lib/supabaseClient';
import styles from '../auth.module.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            // Check Role and Block Status
            if (data.session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, is_blocked')
                    .eq('id', data.session.user.id)
                    .single();

                // Check if user is blocked
                if (profile?.is_blocked) {
                    await supabase.auth.signOut();
                    setError('Your account has been blocked. Please contact support.');
                    toast.error('Account blocked. Contact support.');
                    return;
                }

                toast.success(`Welcome back, ${email.split('@')[0]}!`);

                if (profile?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/shop');
                }
            }

        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
            toast.error(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to continue to your account.</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleLogin}>
                    <GlassInput
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <GlassInput
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                        <Link
                            href="/auth/forgot-password"
                            style={{
                                color: '#10b981',
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <GlassButton fullWidth variant="primary" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </GlassButton>
                </form>

                <p className={styles.footer}>
                    Don't have an account?
                    <Link href="/auth/register" className={styles.link}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
