'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GlassInput from '@/components/GlassInput/GlassInput';
import GlassButton from '@/components/GlassButton/GlassButton';
import { supabase } from '@/lib/supabaseClient';
import styles from '../auth.module.css';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            });

            if (signUpError) throw signUpError;

            // Create profile with role='user' by default
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            email: data.user.email,
                            full_name: formData.fullName,
                            role: 'user', // Default role for new registrations
                        },
                    ]);

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }

                // Send welcome email (non-blocking, errors are logged but don't prevent registration)
                console.log('📧 Attempting to send welcome email to:', data.user.email);
                try {
                    const response = await fetch('/api/send-welcome-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: data.user.email,
                            name: formData.fullName || 'Valued Customer'
                        }),
                    });

                    const responseData = await response.json();
                    console.log('📧 Email API Response:', responseData);

                    if (response.ok) {
                        console.log('✅ Welcome email sent successfully');
                    } else {
                        console.error('⚠️ Welcome email failed:', response.status, responseData);
                    }
                } catch (emailError) {
                    console.error('❌ Welcome email error:', emailError);
                }
            }

            if (data.session) {
                // Auto logged in
                toast.success('Welcome to GlassFlowers! 🌿');
                router.push('/shop');
                router.refresh();
            } else {
                // Email confirmation might be required
                toast.success('Registration successful! Check your email for confirmation.');
                router.push('/auth/login');
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred');
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join us and discover premium decor.</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleRegister}>
                    <GlassInput
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <GlassInput
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <GlassInput
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <GlassButton fullWidth variant="primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </GlassButton>
                </form>

                <p className={styles.footer}>
                    Already have an account?
                    <Link href="/auth/login" className={styles.link}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
