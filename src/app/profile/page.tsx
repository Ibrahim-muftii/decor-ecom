'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBox, FaUserCircle, FaCrown } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            setUser(user);

            if (user) {
                // Fetch user role
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                setUserRole(profileData?.role || null);

                // Fetch orders
                const { data: orderData, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (orderData) setOrders(orderData);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
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
                {userRole === 'admin' && (
                    <Link href="/admin">
                        <GlassButton variant="primary" className={styles.adminBtn}>
                            <FaCrown style={{ marginRight: '8px' }} />
                            Visit Admin Panel
                        </GlassButton>
                    </Link>
                )}
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
