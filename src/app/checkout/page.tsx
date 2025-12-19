'use client';

import React from 'react';
import GlassButton from '@/components/GlassButton/GlassButton';
import GlassInput from '@/components/GlassInput/GlassInput';
import styles from './page.module.css';

export default function Checkout() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Checkout</h1>

            <div className={styles.grid}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Shipping Details</h2>
                    <form className={styles.form}>
                        <div className={styles.row}>
                            <GlassInput placeholder="First Name" />
                            <GlassInput placeholder="Last Name" />
                        </div>
                        <GlassInput placeholder="Email Address" type="email" />
                        <GlassInput placeholder="Address" />
                        <div className={styles.row}>
                            <GlassInput placeholder="City" />
                            <GlassInput placeholder="Postal Code" />
                        </div>
                        <GlassInput placeholder="Country" />
                    </form>
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <h2 className={styles.sectionTitle}>Order Summary</h2>
                        <div className={styles.lineItems}>
                            <div className={styles.item}>
                                <span>Golden Orchid x1</span>
                                <span>$45.99</span>
                            </div>
                            <div className={styles.item}>
                                <span>Velvet Rose x2</span>
                                <span>$59.00</span>
                            </div>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span className={styles.totalAmount}>$109.99</span>
                        </div>
                        <GlassButton fullWidth variant="accent">Place Order</GlassButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
