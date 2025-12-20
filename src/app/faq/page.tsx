import React from 'react';
import styles from '@/components/PolicyPage/policy.module.css';

export default function FAQPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Frequently Asked Questions</h1>
            <div className={styles.content}>
                <h2>Are the flowers real glass?</h2>
                <p>Yes, all our products are hand-blown crystal glass.</p>
                <h2>How do I clean them?</h2>
                <p>We recommend using a soft microfiber cloth or a gentle compressed air duster.</p>
                <h2>Do you do custom orders?</h2>
                <p>Yes! Please use our Contact page to inquire about custom arrangements.</p>
            </div>
        </div>
    );
}
