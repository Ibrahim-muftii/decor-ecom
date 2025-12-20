'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaLeaf, FaSignOutAlt } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { supabase } from '@/lib/supabaseClient';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const router = useRouter();

    // Redux Auth State
    const { user, role } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await supabase.auth.signOut();
        dispatch(logout());
        router.push('/auth/login');
        router.refresh();
    };

    const isAdmin = role === 'admin';

    return (
        <nav className={styles.navbar}>
            <div className={`${styles.backgroundLayer} ${scrolled ? styles.scrolledBackground : ''}`} />

            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <FaLeaf />
                    </div>
                    <span className={styles.logoText}>GlassFlowers</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.navLinks}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/shop" className={styles.link}>Shop</Link>
                    {isAdmin && (
                        <Link href="/admin" className={styles.link}>Admin</Link>
                    )}
                </div>

                {/* Icons */}
                <div className={styles.navActions}>
                    <button className={styles.iconBtn}>
                        <FaSearch />
                    </button>
                    <Link href="/cart" className={styles.iconBtn}>
                        <FaShoppingCart />
                        {/* TODO: Connect Cart Count to Redux */}
                        {/* <span className={styles.badge}>0</span> */}
                    </Link>

                    {user ? (
                        <div className={styles.userMenuWrapper} ref={dropdownRef}>
                            <button
                                className={`${styles.iconBtn} ${isDropdownOpen ? styles.active : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <FaUser />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <span className={styles.dropdownEmail}>{user.email}</span>
                                    </div>
                                    <div className={styles.dropdownDivider} />

                                    <Link
                                        href="/profile"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <FaUser className={styles.dropdownIcon} />
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className={`${styles.dropdownItem} ${styles.logoutItem}`}
                                    >
                                        <FaSignOutAlt className={styles.dropdownIcon} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/auth/login" className={styles.link} style={{ marginLeft: '1rem' }}>
                            Sign In
                        </Link>
                    )}

                    {/* Mobile Toggle can be added here if needed */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
