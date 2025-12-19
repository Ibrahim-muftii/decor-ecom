'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiFileText, FiDroplet, FiShoppingCart } from 'react-icons/fi';
import styles from './BottomNav.module.css';

const navItems = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/shop', icon: FiGrid, label: 'Shop' },
    { href: '/orders', icon: FiFileText, label: 'Orders' },
    { href: '/featured', icon: FiDroplet, label: 'Drops' },
    { href: '/cart', icon: FiShoppingCart, label: 'Cart' },
];

const BottomNav = () => {
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        let matchedIndex = 0;
        for (let i = 0; i < navItems.length; i++) {
            if (pathname === navItems[i].href || (navItems[i].href !== '/' && pathname?.startsWith(navItems[i].href))) {
                matchedIndex = i;
            }
        }
        setActiveIndex(matchedIndex);
    }, [pathname]);

    return (
        <div className={styles.navContainer}>
            <nav className={styles.navbar}>
                {/* The Moving Notch/Curve Container */}
                {/* Since items are evenly distributed 20% each (1/5), we just translate 100% of that 20% width width relative to the container */}
                <div
                    className={styles.activeIndicatorContainer}
                    style={{
                        width: '20%', // Explicitly 1/5th
                        transform: `translateX(${activeIndex * 100}%)`
                    }}
                >
                    <div className={styles.notchCurveLeft}></div>
                    <div className={styles.notchCurveRight}></div>
                    <div className={styles.activeCircle}>
                        {navItems[activeIndex].icon({ className: styles.activeIcon })}
                    </div>
                </div>

                {/* Nav Items */}
                <div className={styles.itemsContainer}>
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeIndex === index;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <span className={styles.iconWrapper}>
                                    <Icon className={styles.icon} />
                                </span>
                                <span className={`${styles.label} ${isActive ? styles.showLabel : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default BottomNav;
