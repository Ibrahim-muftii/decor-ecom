import React from 'react';
import styles from '@/components/PolicyPage/policy.module.css';

export default function ShippingPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Shipping & Returns</h1>
            <div className={styles.content}>
                <h2>Shipping</h2>
                <p>We ship worldwide. All glass items are securely packaged in double-reinforced boxes.</p>
                <h2>Returns</h2>
                <p>If your item arrives damaged, please contact us within 48 hours with photos for a full replacement.</p>
                <p>Standard returns are accepted within 30 days of purchase.</p>
            </div>
        </div>
    );
}
