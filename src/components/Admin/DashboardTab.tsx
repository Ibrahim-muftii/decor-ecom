import React from 'react';
import { FaDollarSign, FaShoppingBag, FaUsers, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import styles from './DashboardTab.module.css';
import Link from 'next/link';

interface DashboardTabProps {
    metrics: {
        totalOrders: number;
        totalRevenue: number;
        totalUsers: number;
        totalProducts: number;
        outOfStock: number;
    };
    lowStockProducts: any[];
    recentOrders: any[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ metrics, lowStockProducts, recentOrders }) => {

    // Explicitly typing Props for StatCard to avoid 'any' lint if possible
    const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass: string }) => (
        <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles[colorClass as keyof typeof styles] || styles.bgBlue}`}>
                <Icon size={24} />
            </div>
            <div className={styles.statContent}>
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
                <StatCard
                    title="Total Revenue"
                    value={`$${metrics.totalRevenue.toLocaleString()}`}
                    icon={FaDollarSign}
                    colorClass="bgEmerald"
                />
                <StatCard
                    title="Total Orders"
                    value={metrics.totalOrders}
                    icon={FaShoppingBag}
                    colorClass="bgEmerald"
                />
                <StatCard
                    title="Total Users"
                    value={metrics.totalUsers}
                    icon={FaUsers}
                    colorClass="bgEmerald"
                />
                <StatCard
                    title="Products"
                    value={metrics.totalProducts}
                    icon={FaBoxOpen}
                    colorClass="bgEmerald"
                />
                <StatCard
                    title="Out of Stock"
                    value={metrics.outOfStock}
                    icon={FaExclamationTriangle}
                    colorClass="bgEmerald"
                />
            </div>

            {/* Tables Section */}
            <div className={styles.tablesSection}>

                {/* Low Stock Table */}
                <div className={`${styles.card} ${styles.cardLarge}`}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Low Stock Alert (&lt; 10)</h3>
                        <Link href="/admin?tab=products" className={styles.viewAll}>
                            View All
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                                        <td className={styles.stockRed}>{p.stock}</td>
                                        <td>${p.price}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8' }}>No low stock items</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className={`${styles.card} ${styles.cardSmall}`}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Recent Orders</h3>
                        <Link href="/admin?tab=orders" className={styles.viewAll}>
                            View All
                        </Link>
                    </div>

                    <div className={styles.ordersList}>
                        {recentOrders.length > 0 ? recentOrders.map(order => (
                            <div key={order.id} className={styles.orderItem}>
                                <div>
                                    <p className={styles.orderId}>#{order.id.slice(0, 8)}</p>
                                    <p className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p className={styles.price}>${order.total_price}</p>
                                    <span className={`${styles.badge} ${styles[order.status.toLowerCase()] || styles.badge}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No recent orders</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardTab;
