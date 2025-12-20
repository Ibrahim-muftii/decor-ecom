'use client';

import React from 'react';
import { FaChartBar, FaBox, FaPlusCircle, FaClipboardList } from 'react-icons/fa';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './AdminTabs.module.css';

const AdminTabs = () => {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
        { id: 'products', label: 'Products', icon: FaBox },
        { id: 'save-product', label: 'Save Product', icon: FaPlusCircle },
        { id: 'orders', label: 'Orders', icon: FaClipboardList },
    ];

    return (
        <div className={styles.container}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <Link
                        key={tab.id}
                        href={`/admin?tab=${tab.id}`}
                        className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
                    >
                        <Icon className={styles.icon} />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
};

export default AdminTabs;
