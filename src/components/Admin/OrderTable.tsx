'use client';

import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaChevronLeft, FaChevronRight, FaBoxOpen, FaTruck, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './OrderTable.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderTableProps {
    orders: any[];
    currentPage: number;
    totalPages: number;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, currentPage, totalPages }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) {
            toast.error('Failed to update status');
        } else {
            toast.success(`Order marked as ${status}`);
            router.refresh(); // Refresh SSR data
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/admin?${params.toString()}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Order Management</h2>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>No orders found</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td className={styles.id}>#{order.id.slice(0, 8)}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 500 }}>
                                        {/* Ideally fetch user name, simplified here */}
                                        Guest / User
                                    </td>
                                    <td className={styles.total}>${order.total_price}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`${styles.badge} ${order.status === 'Pending' ? styles.bgAmber :
                                                order.status === 'Shipped' ? styles.bgBlue :
                                                    styles.bgGreen
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            {order.status === 'Pending' && (
                                                <button onClick={() => updateStatus(order.id, 'Shipped')} className={`${styles.actionBtn} ${styles.shipBtn}`}>
                                                    <FaBoxOpen size={14} /> Ship
                                                </button>
                                            )}
                                            {order.status === 'Shipped' && (
                                                <button onClick={() => updateStatus(order.id, 'Delivered')} className={`${styles.actionBtn} ${styles.deliverBtn}`}>
                                                    <FaTruck size={14} /> Deliver
                                                </button>
                                            )}
                                            {order.status === 'Delivered' && (
                                                <span className={styles.completed}><FaCheck size={14} /> Done</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Showing {currentPage} of {totalPages} pages</span>
                    <div className={styles.pageControls}>
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className={styles.pageBtn}><FaChevronLeft /></button>
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className={styles.pageBtn}><FaChevronRight /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTable;
