'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function CheckoutPage() {
    // Basic state setup for form - no API logic yet as requested
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Order Placed:', formData);
        alert('Thank you for your order! (This is a demo checkout)');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Secure Checkout</h1>
                <p className={styles.subtitle}>Complete your purchase to receive your handcrafted blooms.</p>
            </header>

            <div className={styles.layout}>
                {/* Form Section */}
                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit}>
                        <h2 className={styles.sectionTitle}>Shipping & Billing</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>First Name</label>
                                <input
                                    className={styles.input}
                                    name="firstName"
                                    required
                                    placeholder="John"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input
                                    className={styles.input}
                                    name="lastName"
                                    required
                                    placeholder="Doe"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    className={styles.input}
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Street Address</label>
                                <input
                                    className={styles.input}
                                    name="address"
                                    required
                                    placeholder="123 Botanical Lane"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>City</label>
                                <input
                                    className={styles.input}
                                    name="city"
                                    required
                                    placeholder="New York"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>State / Province</label>
                                <input
                                    className={styles.input}
                                    name="state"
                                    required
                                    placeholder="NY"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Zip / Postal Code</label>
                                <input
                                    className={styles.input}
                                    name="zip"
                                    required
                                    placeholder="10001"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Country</label>
                                <input
                                    className={styles.input}
                                    name="country"
                                    required
                                    placeholder="United States"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Order Notes (Optional)</label>
                                <textarea
                                    className={styles.textarea}
                                    name="message"
                                    placeholder="Special instructions or gift message..."
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Summary Section */}
                <div className={styles.summarySection}>
                    <div className={styles.orderCard}>
                        <h2 className={styles.sectionTitle}>Your Order</h2>
                        <div style={{ marginBottom: '1rem', color: '#64748b' }}>
                            <p>Calculating total...</p>
                            <small>Items are reserved for 30 minutes.</small>
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', color: '#064e3b' }}>
                                <span>Total</span>
                                <span>--</span>
                            </div>
                        </div>

                        <button className={styles.placeOrderBtn} onClick={handleSubmit}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
