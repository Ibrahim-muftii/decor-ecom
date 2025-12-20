import React from 'react';
import styles from '@/components/PolicyPage/policy.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Terms of Service</h1>
            <div className={styles.content}>
                <p>Welcome to GlassFlowers. By using our site, you agree to these terms.</p>
                <h2>Usage</h2>
                <p>Our products are for personal use / decoration. Please handle glass items with care.</p>
                <h2>Returns</h2>
                <p>Please refer to our Shipping & Returns policy for information on refunds.</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
