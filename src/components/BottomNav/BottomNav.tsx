'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiHome, FiGrid, FiShoppingCart, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import styles from './BottomNav.module.css';



const BottomNav = () => {
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check initial user
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkUser();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const getNavItems = () => {
        const baseItems = [
            { href: '/', icon: FiHome, label: 'Home' },
            { href: '/shop', icon: FiGrid, label: 'Shop' },
            { href: '/cart', icon: FiShoppingCart, label: 'Cart' },
        ];

        if (user) {
            return [
                ...baseItems,
                { href: '/profile', icon: FiUser, label: 'Profile' },
                { href: '/auth/login', icon: FiLogOut, label: 'Logout' }, // Logout logic usually needs onClick preventDefault, but link to login page works as toggle often if handled there. Ideally we should handle logout action.
            ];
        } else {
            return [
                ...baseItems,
                { href: '/auth/login', icon: FiLogIn, label: 'Sign In' },
            ];
        }
    };

    const currentNavItems = getNavItems();

    useEffect(() => {
        let matchedIndex = 0;
        for (let i = 0; i < currentNavItems.length; i++) {
            if (pathname === currentNavItems[i].href || (currentNavItems[i].href !== '/' && pathname?.startsWith(currentNavItems[i].href))) {
                matchedIndex = i;
            }
        }
        setActiveIndex(matchedIndex);
    }, [pathname, currentNavItems.length]); // Re-run if items change

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await supabase.auth.signOut();
            toast.success('Logged out successfully!');
            // Use router.push instead of window.location to avoid reload loop
            const { useRouter } = await import('next/navigation');
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    return (
        <div className={styles.navContainer}>
            <nav className={styles.navbar}>
                <div
                    className={styles.activeIndicatorContainer}
                    style={{
                        width: `${100 / currentNavItems.length}%`, // Dynamic width based on item count
                        transform: `translateX(${activeIndex * 100}%)`
                    }}
                >
                    <div className={styles.notchCurveLeft}></div>
                    <div className={styles.notchCurveRight}></div>
                    <div className={styles.activeCircle}>
                        {currentNavItems[activeIndex]?.icon({ className: styles.activeIcon })}
                    </div>
                </div>

                <div className={styles.itemsContainer}>
                    {currentNavItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeIndex === index;
                        const isLogout = item.label === 'Logout';

                        if (isLogout) {
                            return (
                                <button
                                    key={item.href}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    onClick={(e) => handleLogout(e)}
                                    data-logout="true"
                                >
                                    <span className={styles.iconWrapper}>
                                        <Icon className={styles.icon} />
                                    </span>
                                    <span className={`${styles.label} ${isActive ? styles.showLabel : ''}`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        }

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
