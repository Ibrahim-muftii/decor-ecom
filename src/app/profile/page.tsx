import React from 'react';
import { FaBox, FaUserCircle } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import styles from './page.module.css';

// Mock Data
const ORDERS = [
    { id: 'ORD-123', date: '2023-11-15', total: 109.99, status: 'Delivered' },
    { id: 'ORD-124', date: '2023-12-01', total: 45.99, status: 'Processing' },
];

export default function Profile() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <FaUserCircle className={styles.avatarIcon} />
                    <div>
                        <h1 className={styles.name}>John Doe</h1>
                        <p className={styles.email}>john.doe@example.com</p>
                    </div>
                </div>
                <GlassButton variant="secondary">Edit Profile</GlassButton>
            </div>

            <div className={styles.content}>
                <h2 className={styles.sectionTitle}>Order History</h2>
                <div className={styles.ordersList}>
                    {ORDERS.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <span className={styles.orderId}>#{order.id}</span>
                                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>{order.status}</span>
                            </div>
                            <div className={styles.orderDetails}>
                                <span>{order.date}</span>
                                <span className={styles.orderTotal}>${order.total}</span>
                            </div>
                            <GlassButton variant="secondary" className={styles.viewBtn}>View Details</GlassButton>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
