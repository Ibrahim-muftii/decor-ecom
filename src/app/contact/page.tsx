import React from 'react';
import styles from '@/components/PolicyPage/policy.module.css';

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Contact Us</h1>
            <div className={styles.content}>
                <p>We'd love to hear from you.</p>
                <h2>Email</h2>
                <p>support@glassflowers.com</p>
                <h2>Phone</h2>
                <p>+1 (555) 123-4567</p>
                <h2>Address</h2>
                <p>123 Botanical Ave, Glass City, GC 12345</p>
            </div>
        </div>
    );
}
