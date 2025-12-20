import React from 'react';
import styles from '@/components/PolicyPage/policy.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <div className={styles.content}>
                <p>At GlassFlowers, we value your privacy. This policy outlines how we handle your data.</p>
                <h2>Data Collection</h2>
                <p>We collect only necessary information to process your orders and improve your experience.</p>
                <h2>Security</h2>
                <p>Your data is encrypted and stored securely. We do not sell your data to third parties.</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
