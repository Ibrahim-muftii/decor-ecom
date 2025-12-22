'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GlassInput from '@/components/GlassInput/GlassInput';
import GlassButton from '@/components/GlassButton/GlassButton';
import { supabase } from '@/lib/supabaseClient';
import styles from '../auth.module.css';
import { MdLockOutline, MdMailOutline } from 'react-icons/md';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Request password reset from Supabase
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            setSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Check Your Email <MdMailOutline /></h1>
                        <p className={styles.subtitle}>
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                            Click the link in the email to reset your password.
                        </p>
                        <Link href="/auth/login" className={styles.link}>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Forgot Password? <MdLockOutline /></h1>
                    <p className={styles.subtitle}>
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleResetRequest}>
                    <GlassInput
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <GlassButton fullWidth variant="primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </GlassButton>
                </form>

                <p className={styles.footer}>
                    Remember your password?
                    <Link href="/auth/login" className={styles.link}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
