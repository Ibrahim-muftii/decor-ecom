import React from 'react';
import Link from 'next/link';
import GlassInput from '@/components/GlassInput/GlassInput';
import GlassButton from '@/components/GlassButton/GlassButton';
import styles from '../auth.module.css';

export default function Register() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join us and discover premium decor</p>
                </div>

                <form className={styles.form}>
                    <GlassInput placeholder="Full Name" type="text" />
                    <GlassInput placeholder="Email" type="email" />
                    <GlassInput placeholder="Password" type="password" />
                    <GlassButton fullWidth variant="primary">Sign Up</GlassButton>
                </form>

                <p className={styles.footer}>
                    Already have an account?
                    <Link href="/auth/login" className={styles.link}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
