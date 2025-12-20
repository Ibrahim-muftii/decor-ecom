'use client';

import React, { useEffect, useState } from 'react';
import { FaBox, FaUserCircle } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (orderData) setOrders(orderData);
        }
        setLoading(false);
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    // Use email name or fallback
    const displayName = user?.email?.split('@')[0] || 'User';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <FaUserCircle className={styles.avatarIcon} />
                    <div>
                        <h1 className={styles.name}>{displayName}</h1>
                        <p className={styles.email}>{user?.email}</p>
                    </div>
                </div>
                {/* <GlassButton variant="secondary">Edit Profile</GlassButton> */}
            </div>

            <div className={styles.content}>
                <h2 className={styles.sectionTitle}>Order History</h2>
                {orders.length === 0 ? (
                    <p className={styles.placeholder}>No orders found.</p>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map(order => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <span className={styles.orderId}>#{order.id.slice(0, 8)}</span>
                                    <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>{order.status}</span>
                                </div>
                                <div className={styles.orderDetails}>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className={styles.orderTotal}>${order.total_price}</span>
                                </div>
                                <GlassButton variant="secondary" className={styles.viewBtn}>View Details</GlassButton>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
