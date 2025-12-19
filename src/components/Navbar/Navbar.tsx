'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaLeaf } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={styles.navbar}>
            {/* 
               Background Layer:
               - Full width/height of the navbar
               - Handles the blur and opacity
               - Transparent initially, changes on scroll
            */}
            <div className={`${styles.backgroundLayer} ${scrolled ? styles.scrolledBackground : ''}`} />

            {/* Content Layer */}
            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <FaLeaf />
                    </div>
                    <span className={styles.logoText}>GlassFlowers</span>
                </Link>

                <div className={styles.navLinks}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/shop" className={styles.link}>Shop</Link>
                    <Link href="/cart" className={styles.link}>Cart</Link>
                </div>

                <div className={styles.navActions}>
                    <Link href="/cart" className={styles.iconBtn}>
                        <FaShoppingCart />
                        <span className={styles.badge}>2</span>
                    </Link>
                    <Link href="/profile" className={styles.iconBtn}>
                        <FaUser />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
