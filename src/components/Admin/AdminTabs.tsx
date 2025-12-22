'use client';

import React, { useState } from 'react';
import { FaChartBar, FaBox, FaPlusCircle, FaClipboardList, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './AdminTabs.module.css';

const AdminTabs = () => {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
        { id: 'products', label: 'Products', icon: FaBox },
        { id: 'users', label: 'Users', icon: FaUsers },
        { id: 'orders', label: 'Orders', icon: FaClipboardList },
        { id: 'save-product', label: 'Save Product', icon: FaPlusCircle },
    ];

    const handleTabClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={styles.mobileToggle}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                <span>Menu</span>
            </button>

            {/* Tabs Container */}
            <div className={`${styles.container} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            href={`/admin?tab=${tab.id}`}
                            className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
                            onClick={handleTabClick}
                        >
                            <Icon className={styles.icon} />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className={styles.mobileOverlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default AdminTabs;
